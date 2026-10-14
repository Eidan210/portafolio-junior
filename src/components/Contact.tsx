/**
 * Contacto en dos modos (`@/lib/contact`):
 *
 *  - Envío automático: si Eidan desplegó su Apps Script (`profile.contactEndpoint`),
 *    el mensaje se envía solo y el éxito llega con la confirmación del servidor.
 *  - Su correo: el redactor web de Gmail en escritorio o la app de correo
 *    (`mailto:`, Gmail en Android) en el teléfono, con el mensaje ya escrito.
 *    Es el modo único sin Apps Script y el plan B cuando el envío falla.
 *
 * Solo se anuncia lo comprobable. Si algo falla, el texto se conserva y se
 * ofrece un enlace directo (un clic real no lo frena ningún bloqueador) y
 * copiar el email. Los textos viven en `@/data/contact-copy`.
 */
import { AnimatePresence, motion, useAnimate, useReducedMotionConfig } from "motion/react";
import { Check, Copy, Download, ExternalLink, Send, TriangleAlert } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, MouseEvent, ReactNode } from "react";
import { contactBlocked, contactFailed, contactSent, contactThanks, copiedEmail } from "@/data/buddy-script";
import { autoCopy, channelCopy, sharedCopy } from "@/data/contact-copy";
import { contactUiCopy } from "@/data/ui";
import { profile } from "@/data/profile";
import { copyEmail } from "@/buddy/BuddyPanel";
import { useBuddyActions } from "@/buddy/BuddyProvider";
import { PixelBurst } from "@/buddy/pixel-props";
import { GitHubIcon } from "@/components/icons";
import { GlowPanel, Magnetic, Reveal } from "@/components/interactive";
import { SectionHeading } from "@/components/SectionHeading";
import { MESSAGE_MAX, gmailComposeUrl, isPhone, launchApp, mailtoUrl, openInNewTab, sendViaScript, validateContact } from "@/lib/contact";
import type { ContactFields, FieldErrors, SendFailure } from "@/lib/contact";

/** `sending`, `sent` y `failed` son del envío automático; `launching`, `opened` y `blocked`, del correo del visitante. */
type Status = "idle" | "sending" | "sent" | "failed" | "launching" | "opened" | "blocked";

const EMPTY: ContactFields = { name: "", email: "", message: "" };
/** El contador aparece cuando el mensaje se acerca al tope. */
const COUNTER_FROM = Math.round(MESSAGE_MAX * 0.8);

const input =
  "w-full rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-fg placeholder:text-subtle/70 transition-colors focus:border-claude/70 focus:bg-white/[0.08] focus:outline-none aria-[invalid=true]:border-danger read-only:opacity-60";

/** Ráfaga de pixeles tras el icono de confirmación. Está pensada para un Clawd de ~240 px: a esta escala acompaña sin tapar. */
function Burst() {
  const reduce = useReducedMotionConfig();
  if (reduce) return null;
  return (
    <div className="pointer-events-none absolute inset-0 scale-50">
      <PixelBurst />
    </div>
  );
}

/** Check que se dibuja trazo a trazo: el servidor confirmó el envío. */
function SentMark() {
  const reduce = useReducedMotionConfig();
  return (
    <div className="relative grid size-16 place-items-center">
      <Burst />
      <svg viewBox="0 0 52 52" className="relative size-14" aria-hidden="true">
        <motion.circle cx="26" cy="26" r="24" fill="none" stroke="var(--color-olive-light)" strokeWidth="3" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
        <motion.path d="M15 27 l7 7 l15 -16" fill="none" stroke="var(--color-olive-light)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.4 }} />
      </svg>
    </div>
  );
}

/** Avión de papel que llega en arco y se posa: el mensaje está escrito en el correo del visitante. */
function PlaneMark() {
  const reduce = useReducedMotionConfig();
  return (
    <div className="relative grid size-16 place-items-center">
      <Burst />
      <motion.span
        className="relative grid size-14 place-items-center rounded-2xl bg-olive-light/15 text-olive-light"
        initial={reduce ? false : { x: -72, y: 34, rotate: -28, opacity: 0, scale: 0.6 }}
        animate={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 17 }}
      >
        <Send className="size-7" aria-hidden="true" />
      </motion.span>
    </div>
  );
}

/**
 * Contenido del botón. Mientras se envía o se abre el correo, el avión de papel
 * despega en bucle: sale por arriba a la derecha y vuelve a entrar desde la
 * izquierda, invisible en el salto.
 */
function SubmitLabel({ busy, label, busyLabel }: { busy: boolean; label: string; busyLabel: string }) {
  const reduce = useReducedMotionConfig();
  if (!busy) {
    return (
      <>
        <Send className="size-4" aria-hidden="true" /> {label}
      </>
    );
  }
  return (
    <>
      <motion.span
        className="inline-flex"
        animate={reduce ? { opacity: [1, 0.4, 1] } : { x: [0, 26, -18, 0], y: [0, -22, 10, 0], opacity: [1, 0, 0, 1], rotate: [0, 14, 0, 0] }}
        transition={reduce ? { duration: 1.2, repeat: Infinity } : { duration: 1.3, times: [0, 0.45, 0.46, 1], ease: "easeInOut", repeat: Infinity }}
        aria-hidden="true"
      >
        <Send className="size-4" />
      </motion.span>
      {busyLabel}
    </>
  );
}

/** Panel final (enviado o abierto en el correo), con su icono animado. */
function DonePanel({ mark, title, children }: { mark: ReactNode; title: string; children: ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[22rem] flex-col items-center justify-center gap-4 text-center" role="status">
      {mark}
      <p className="font-display text-xl font-bold">{title}</p>
      {children}
    </motion.div>
  );
}

export function Contact() {
  const { say } = useBuddyActions();
  const reduce = useReducedMotionConfig();
  const uid = useId();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [channel] = useState<"web" | "app">(() => (isPhone(navigator.userAgent) ? "app" : "web"));
  const [fields, setFields] = useState<ContactFields>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<SendFailure>("network");
  const [honeypot, setHoneypot] = useState("");
  const [copied, setCopied] = useState(false);
  // El formulario sigue en pantalla durante su animación de salida: un doble clic abriría dos pestañas o enviaría dos veces.
  const locked = useRef(false);
  const stopLaunch = useRef<(() => void) | null>(null);

  const endpoint = profile.contactEndpoint;
  const copy = channelCopy[channel];
  const busy = status === "sending" || status === "launching";
  const targetUrl = channel === "web" ? gmailComposeUrl(profile.email, fields) : mailtoUrl(profile.email, fields);

  useEffect(() => () => stopLaunch.current?.(), []);

  const set = (k: keyof ContactFields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  /** Sacudida de "no" del panel. Sin movimiento, el aviso y el foco ya lo dicen. */
  const shake = () => {
    if (reduce || !scope.current) return;
    void animate(scope.current, { x: [0, -10, 9, -6, 4, -2, 0] }, { duration: 0.45, ease: "easeOut" });
  };

  const markOpened = () => {
    locked.current = true;
    setStatus("opened");
    say({ type: "text", text: contactThanks, mood: "happy", auto: true });
  };

  const markBlocked = () => {
    locked.current = false;
    setStatus("blocked");
    shake();
    say({ type: "text", text: contactBlocked, mood: "surprised", auto: true });
  };

  /** Teléfono: lanza la app de correo y espera la señal de que el sistema cambió de app. */
  const launch = () => {
    setStatus("launching");
    stopLaunch.current?.();
    stopLaunch.current = launchApp(targetUrl, { onOpened: markOpened, onMissed: markBlocked });
  };

  /** Abrir el correo del visitante; síncrono, en el mismo tick del clic, para que el bloqueador lo deje pasar. */
  const openMail = () => {
    if (channel === "app") {
      launch();
      return;
    }
    if (openInNewTab(targetUrl) === "opened") markOpened();
    else markBlocked();
  };

  /** Enlace del aviso: en web el clic real abre la pestaña; en el teléfono se vuelve a vigilar el cambio de app. */
  const onRetry = (e: MouseEvent<HTMLAnchorElement>) => {
    if (channel === "web") {
      markOpened();
      return;
    }
    e.preventDefault();
    launch();
  };

  const sendAuto = async () => {
    setStatus("sending");
    const result = await sendViaScript(endpoint, fields, { online: navigator.onLine, honeypot }).catch(
      (err: unknown) => ({ ok: false as const, reason: "network" as const, detail: String(err) }),
    );
    if (result.ok) {
      setStatus("sent");
      say({ type: "text", text: contactSent, mood: "happy", auto: true });
      return;
    }
    // El motivo técnico queda en consola para depurar; al visitante se le explica en su idioma.
    console.warn("[contacto] envío automático fallido:", result.reason, result.detail ?? "");
    locked.current = false;
    setFailure(result.reason);
    setStatus("failed");
    shake();
    say({ type: "text", text: contactFailed, mood: "sad", auto: true });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (locked.current || busy) return;
    const found = validateContact(fields);
    setErrors(found);
    const first = (Object.keys(found) as (keyof ContactFields)[])[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      shake();
      say({ type: "text", text: sharedCopy.validationNudge, mood: "surprised", auto: true });
      return;
    }
    locked.current = true;
    if (endpoint) void sendAuto();
    else openMail();
  };

  const onCopy = async () => {
    // Plan manual tras un aviso de bloqueo: si ahora se va a su app de correo, eso ya no demuestra que se abriera el mailto.
    if (status === "blocked") {
      stopLaunch.current?.();
      stopLaunch.current = null;
    }
    if (!(await copyEmail())) return;
    setCopied(true);
    say({ type: "text", text: copiedEmail, mood: "happy", auto: true });
    window.setTimeout(() => setCopied(false), 2200);
  };

  const reset = () => {
    stopLaunch.current?.();
    stopLaunch.current = null;
    locked.current = false;
    setStatus("idle");
    setFields(EMPTY);
  };

  const field = (k: keyof ContactFields, label: string, el: "input" | "textarea", type = "text", autoComplete?: string) => {
    const id = `${uid}-${k}`;
    const err = errors[k];
    // Sin maxLength: recortaría en silencio lo pegado. Se cuenta lo que se enviará (sin espacios en los extremos).
    const count = el === "textarea" ? fields[k].trim().length : 0;
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-muted">
          {label}
        </label>
        {el === "input" ? (
          <input id={id} type={type} autoComplete={autoComplete} value={fields[k]} onChange={set(k)} readOnly={busy} aria-invalid={!!err} aria-describedby={err ? `${id}-err` : undefined} className={input} />
        ) : (
          <textarea id={id} rows={5} value={fields[k]} onChange={set(k)} readOnly={busy} aria-invalid={!!err} aria-describedby={err ? `${id}-err` : undefined} className={`${input} resize-y`} />
        )}
        <div className="flex items-start justify-between gap-3">
          <AnimatePresence>
            {err && (
              <motion.p id={`${id}-err`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-xs text-danger">
                {err}
              </motion.p>
            )}
          </AnimatePresence>
          {el === "textarea" && count >= COUNTER_FROM && (
            <p className={`mt-1.5 ml-auto text-xs tabular-nums ${count > MESSAGE_MAX ? "font-semibold text-danger" : "text-subtle"}`}>
              {count}/{MESSAGE_MAX}
            </p>
          )}
        </div>
      </div>
    );
  };

  /** Aviso con plan B: el enlace al correo del visitante (con el mensaje escrito) y copiar el email. */
  const fallbackAlert = (title: string, body: string) => (
    <motion.div key="alert" role="alert" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
      <div className="flex gap-3 rounded-2xl border border-danger/40 bg-danger/10 p-4">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
        <div className="min-w-0 text-sm">
          <p className="font-semibold text-fg">{title}</p>
          <p className="mt-0.5 text-muted">{body}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {/* Un clic real en un enlace no lo frena ningún bloqueador de ventanas. */}
            <a href={targetUrl} target={channel === "web" ? "_blank" : undefined} rel="noopener noreferrer" onClick={onRetry} className="btn btn-primary !min-h-9 !px-3 !py-1 !text-xs">
              <ExternalLink className="size-3.5" aria-hidden="true" /> {copy.retry}
            </a>
            <button type="button" onClick={onCopy} className="btn btn-ghost !min-h-9 !px-3 !py-1 !text-xs">
              {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
              {copied ? sharedCopy.copied : sharedCopy.copyEmail}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <section id="contacto" aria-labelledby="contact-title" className="shell px-4 py-24 sm:px-6">
      <SectionHeading
        id="contact-title"
        eyebrow={contactUiCopy.eyebrow}
        title={
          <>
            {contactUiCopy.titleLead}
            <span className="text-gradient">{contactUiCopy.titleAccent}</span>
            {contactUiCopy.titleEnd}
          </>
        }
      >
        {contactUiCopy.description(profile.availability)}
      </SectionHeading>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal className="grid content-start gap-3">
          <button type="button" onClick={onCopy} className="glass glow-border flex items-center gap-4 rounded-3xl p-5 text-left transition-colors hover:bg-white/[0.08]">
            <span className={`grid size-11 shrink-0 place-items-center rounded-2xl transition-colors ${copied ? "bg-olive-light/20 text-olive-light" : "bg-claude/15 text-claude-light"}`}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={copied ? "ok" : "copy"} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }}>
                  {copied ? <Check className="size-5" aria-hidden="true" /> : <Copy className="size-5" aria-hidden="true" />}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="min-w-0">
              <span className="block text-xs text-subtle">{copied ? sharedCopy.copied : contactUiCopy.copyEmailHint}</span>
              <span className="block truncate font-semibold">{profile.email}</span>
            </span>
          </button>
          <a href={profile.github} target="_blank" rel="noreferrer" className="glass flex items-center gap-4 rounded-3xl p-5 transition-colors hover:bg-white/[0.08]">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sky/15 text-sky-light">
              <GitHubIcon className="size-5" />
            </span>
            <span>
              <span className="block text-xs text-subtle">{contactUiCopy.githubLabel}</span>
              <span className="block font-semibold">github.com/{profile.githubUser}</span>
            </span>
          </a>
          <a href={profile.cv} download className="glass flex items-center gap-4 rounded-3xl p-5 transition-colors hover:bg-white/[0.08]">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sky/15 text-sky-light">
              <Download className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xs text-subtle">{contactUiCopy.cvLabel}</span>
              <span className="block font-semibold">{contactUiCopy.cvDownload}</span>
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <div ref={scope}>
            <GlowPanel className="rounded-3xl p-6 sm:p-8">
              <AnimatePresence mode="wait" initial={false}>
                {status === "sent" ? (
                  <DonePanel key="sent" mark={<SentMark />} title={autoCopy.sentTitle}>
                    <p className="max-w-sm text-sm text-muted">
                      {autoCopy.sentBody} <span className="font-semibold text-fg">{fields.email.trim()}</span> {autoCopy.sentBodyEnd}
                    </p>
                    <button type="button" className="btn btn-ghost !text-sm" onClick={reset}>
                      {sharedCopy.another}
                    </button>
                  </DonePanel>
                ) : status === "opened" ? (
                  <DonePanel key="opened" mark={<PlaneMark />} title={copy.openedTitle}>
                    <p className="max-w-sm text-sm text-muted">
                      {copy.openedBody} {sharedCopy.sendHint} <span className="font-semibold text-fg">{sharedCopy.sendHintAction}</span> {sharedCopy.sendHintEnd}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      <a href={targetUrl} target={channel === "web" ? "_blank" : undefined} rel="noopener noreferrer" className="btn btn-ghost !text-sm">
                        <ExternalLink className="size-4" aria-hidden="true" /> {copy.reopen}
                      </a>
                      <button type="button" className="btn btn-ghost !text-sm" onClick={reset}>
                        {sharedCopy.another}
                      </button>
                    </div>
                    {channel === "web" && (
                      <p className="text-xs text-subtle">
                        {sharedCopy.noGmail}{" "}
                        <button type="button" onClick={onCopy} className="font-semibold text-claude-light underline-offset-4 hover:underline">
                          {copied ? sharedCopy.noGmailCopied : sharedCopy.noGmailCopy}
                        </button>{" "}
                        {sharedCopy.noGmailEnd}
                      </p>
                    )}
                  </DonePanel>
                ) : (
                  <motion.form key="form" exit={{ opacity: 0 }} noValidate onSubmit={onSubmit} className="relative grid gap-4" aria-label={contactUiCopy.formAria} aria-busy={busy}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {field("name", contactUiCopy.nameLabel, "input", "text", "name")}
                      {field("email", contactUiCopy.emailLabel, "input", "email", "email")}
                    </div>
                    {field("message", contactUiCopy.messageLabel, "textarea")}
                    {/* Trampa para bots del envío automático: fuera de pantalla y del orden de tabulación; una persona nunca la rellena. */}
                    {endpoint && (
                      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
                        <label>
                          {contactUiCopy.honeypotLabel}
                          <input tabIndex={-1} autoComplete="off" name="hp_confirm" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                        </label>
                      </div>
                    )}

                    <AnimatePresence initial={false}>
                      {status === "blocked" && fallbackAlert(copy.blockedTitle, copy.blockedBody)}
                      {status === "failed" && fallbackAlert(autoCopy.failedTitle, `${autoCopy.failure[failure]} ${autoCopy.failedBody}`)}
                    </AnimatePresence>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-xs text-subtle">{endpoint ? autoCopy.note : copy.note}</p>
                      <Magnetic>
                        <button type="submit" disabled={busy} className="btn btn-primary min-w-[12.5rem] disabled:cursor-progress disabled:opacity-80">
                          <SubmitLabel busy={busy} label={endpoint ? autoCopy.submit : copy.submit} busyLabel={status === "sending" ? autoCopy.sending : sharedCopy.launching} />
                        </button>
                      </Magnetic>
                    </div>
                    {/* El cambio de texto del botón no siempre se anuncia: esta región sí. */}
                    <p className="sr-only" aria-live="polite">
                      {status === "sending" ? autoCopy.sendingLive : status === "launching" ? sharedCopy.launchingLive : ""}
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </GlowPanel>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
