/**
 * Contacto por Gmail: el formulario valida y abre el correo del visitante con
 * el mensaje ya escrito y dirigido a Eidan; el visitante lo envía desde allí.
 *
 *  - Escritorio: redactor web de Gmail en una pestaña nueva.
 *  - Teléfono: `mailto:`. El redactor web de Gmail no prellena en móvil (abre
 *    la bandeja), y `mailto:` abre la app de correo (Gmail en Android) con
 *    destinatario, asunto y cuerpo.
 *
 * Si Eidan desplegó su Apps Script (`apps-script/contacto.gs`), el mensaje
 * se envía solo (`sendViaScript`) y lo anterior queda como plan B.
 *
 * Solo se anuncia lo que se puede comprobar: que el servidor confirmó el
 * envío, que la pestaña o la app se abrió, o que no lo hizo.
 *
 * Sin imports de Vite ni alias `@/` (los textos se importan por ruta relativa):
 * `node --test` carga el módulo tal cual.
 */
import { validationCopy } from "../data/contact-copy.ts";

export type ContactFields = { name: string; email: string; message: string };

export type FieldErrors = Partial<Record<keyof ContactFields, string>>;

/** El mensaje viaja en la URL de Gmail: por encima de esto la URL se acerca al límite de los servidores. */
export const MESSAGE_MAX = 1500;
/** Los mismos topes que `MAX` en `apps-script/contacto.gs`: el script rechaza lo que los supere. */
export const NAME_MAX = 100;
export const EMAIL_MAX = 150;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(f: ContactFields): FieldErrors {
  const e: FieldErrors = {};
  const name = f.name.trim();
  if (name.length < 2) e.name = validationCopy.name;
  else if (name.length > NAME_MAX) e.name = validationCopy.nameLong(NAME_MAX);
  const email = f.email.trim();
  if (!EMAIL_RE.test(email)) e.email = validationCopy.email;
  else if (email.length > EMAIL_MAX) e.email = validationCopy.emailLong(EMAIL_MAX);
  const message = f.message.trim();
  if (message.length < 10) e.message = validationCopy.messageShort;
  else if (message.length > MESSAGE_MAX) e.message = validationCopy.messageLong(MESSAGE_MAX);
  return e;
}

/**
 * Cambia los sustitutos UTF-16 sueltos (los puede dejar un pegado o un teclado) por U+FFFD: con
 * ellos `encodeURIComponent` lanza `URIError`, y las URLs de Gmail y `mailto:` se calculan al pintar.
 */
function wellFormed(s: string): string {
  return s.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDFFF]/g, (m) => (m.length === 2 ? m : "�"));
}

/** Asunto y cuerpo del correo; el cuerpo firma con el email del visitante para poder responderle. */
export function composeMessage(fields: ContactFields): { subject: string; body: string } {
  const name = wellFormed(fields.name.trim());
  return {
    subject: `Contacto desde el portafolio — ${name}`,
    body: `${wellFormed(fields.message.trim())}\n\n— ${name} (${wellFormed(fields.email.trim())})`,
  };
}

/**
 * Redactor de Gmail web con destinatario, asunto y cuerpo prellenados. Se
 * codifica con `encodeURIComponent` (no `URLSearchParams`): así un "+" del
 * mensaje no llega a Gmail convertido en espacio.
 */
export function gmailComposeUrl(to: string, fields: ContactFields): string {
  const { subject, body } = composeMessage(fields);
  const q = [`view=cm`, `fs=1`, `to=${encodeURIComponent(to)}`, `su=${encodeURIComponent(subject)}`, `body=${encodeURIComponent(body)}`];
  return `https://mail.google.com/mail/?${q.join("&")}`;
}

/** `mailto:` con asunto y cuerpo. El destinatario es un dato propio (`profile.email`), no del visitante. */
export function mailtoUrl(to: string, fields: ContactFields): string {
  const { subject, body } = composeMessage(fields);
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

/**
 * Teléfono o tablet Android, según el user agent. El iPad se presenta como
 * escritorio (Safari pide la versión de ordenador) y ahí el redactor web de
 * Gmail sí funciona.
 */
export function isPhone(userAgent: string): boolean {
  return /Android|iPhone|iPod|Mobile/i.test(userAgent);
}

export type OpenResult = "opened" | "blocked";

/** Forma mínima de `window.open` que usa `openInNewTab`: sustituible en los tests. */
export type TabOpener = (url: string, target: string) => { opener: unknown; location: { href: string } } | null;

/**
 * Abre `url` en una pestaña nueva sin darle acceso a esta página. Se abre en
 * blanco y se anula `opener` antes de navegar: con la opción `noopener`,
 * `window.open` devuelve siempre `null` y un bloqueo sería indistinguible de
 * un éxito. Llamar en el mismo tick del clic o del envío: los bloqueadores de
 * ventanas solo dejan pasar aperturas con activación del usuario.
 */
export function openInNewTab(url: string, open: TabOpener = (u, t) => window.open(u, t)): OpenResult {
  const tab = open("", "_blank");
  if (!tab) return "blocked";
  tab.opener = null;
  tab.location.href = url;
  return "opened";
}

/** Lo que `launchApp` necesita del documento: sustituible en los tests. */
export type VisibilitySource = {
  readonly hidden: boolean;
  addEventListener(type: "visibilitychange", listener: () => void): void;
  removeEventListener(type: "visibilitychange", listener: () => void): void;
};

export type LaunchOptions = {
  /** Navega a la URL de la app (por defecto, `location.href`). */
  navigate?: (url: string) => void;
  doc?: VisibilitySource;
  /** Margen para que el sistema cambie de app antes de darla por no abierta. */
  waitMs?: number;
  /**
   * Tras `onMissed`, cuánto más se acepta que la app se abra (un selector de apps puede tardar).
   * Pasado ese margen se deja de vigilar: cambiar de pestaña o bloquear el teléfono ya no
   * demuestra que se abriera el correo.
   */
  lateMs?: number;
  onOpened: () => void;
  onMissed: () => void;
};

/**
 * Lanza una URL que abre otra app (`mailto:`) y vigila la visibilidad de la
 * página: que se oculte es la única señal fiable de que el sistema cambió de
 * app. Si en `waitMs` no se ocultó, avisa con `onMissed`; si se oculta en los
 * `lateMs` siguientes, corrige con `onOpened`, y después deja de vigilar. Cada
 * callback se llama como mucho una vez. Devuelve la función de limpieza.
 */
export function launchApp(url: string, opts: LaunchOptions): () => void {
  const doc = opts.doc ?? document;
  const navigate = opts.navigate ?? ((u: string) => window.location.assign(u));
  let opened = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const stop = () => {
    clearTimeout(timer);
    doc.removeEventListener("visibilitychange", onVisibility);
  };
  const onVisibility = () => {
    if (!doc.hidden || opened) return;
    opened = true;
    stop();
    opts.onOpened();
  };
  doc.addEventListener("visibilitychange", onVisibility);
  timer = setTimeout(() => {
    opts.onMissed();
    timer = setTimeout(stop, opts.lateMs ?? 8000);
  }, opts.waitMs ?? 1800);
  navigate(url);
  return stop;
}

export type SendFailure = "offline" | "timeout" | "network" | "rejected";

export type SendResult = { ok: true } | { ok: false; reason: SendFailure; detail?: string };

export type SendOptions = {
  /** Sustituible en los tests. */
  fetch?: typeof fetch;
  /** `navigator.onLine`; sin valor se intenta igualmente. */
  online?: boolean;
  timeoutMs?: number;
  /** Campo trampa del formulario: el script descarta el envío si trae algo. */
  honeypot?: string;
};

/** Más que esto y el visitante ya duda: mejor ofrecerle su correo como plan B. */
const SEND_TIMEOUT_MS = 15_000;

/** `AbortSignal.timeout` no existe en Safari < 16: allí se envía sin límite antes que fallar siempre. */
function timeoutSignal(ms: number): AbortSignal | undefined {
  return typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(ms) : undefined;
}

function errorName(err: unknown): string {
  return typeof err === "object" && err !== null && "name" in err ? String(err.name) : "";
}

/** Traduce la respuesta del Apps Script. Solo es éxito con HTTP 2xx y `ok === true` booleano. */
export function interpretScriptResponse(status: number, body: unknown): SendResult {
  const record = typeof body === "object" && body !== null ? (body as Record<string, unknown>) : null;
  if (status >= 200 && status < 300 && record?.ok === true) return { ok: true };
  const error = typeof record?.error === "string" ? `: ${record.error}` : "";
  return { ok: false, reason: "rejected", detail: `HTTP ${status}${error}` };
}

/**
 * Envío automático al Apps Script de Eidan. El cuerpo viaja como text/plain:
 * es una petición simple, sin el preflight OPTIONS que Apps Script no
 * contesta, y su respuesta (tras la redirección de Google) se puede leer.
 */
export async function sendViaScript(endpoint: string, fields: ContactFields, opts: SendOptions = {}): Promise<SendResult> {
  if (opts.online === false) return { ok: false, reason: "offline" };
  const send = opts.fetch ?? globalThis.fetch.bind(globalThis);
  let res: Response;
  try {
    res = await send(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        name: fields.name.trim(),
        email: fields.email.trim(),
        message: fields.message.trim(),
        honeypot: opts.honeypot ?? "",
      }),
      signal: timeoutSignal(opts.timeoutMs ?? SEND_TIMEOUT_MS),
    });
  } catch (err) {
    const name = errorName(err);
    const reason: SendFailure = name === "TimeoutError" || name === "AbortError" ? "timeout" : "network";
    return { ok: false, reason, detail: String(err) };
  }
  // Un cuerpo que no es JSON (página de error, login de Google) es un rechazo, nunca un éxito.
  const body: unknown = await res.json().catch(() => null);
  return interpretScriptResponse(res.status, body);
}
