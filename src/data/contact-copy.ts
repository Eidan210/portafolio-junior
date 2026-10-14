/**
 * Textos del formulario de contacto, en español aquí y en inglés en
 * `en/contact-copy.ts`. `src/lib/contact.ts`, que se prueba con `node --test`,
 * usa los de validación tal cual: por eso los imports son relativos y con
 * extensión, sin alias `@/`.
 *
 * Regla de todos los textos: el visitante sabe siempre qué se envió, qué se
 * abrió o qué falló. Ninguno da por enviado algo que no se comprobó.
 */
import { pick } from "../i18n/lang.ts";
import { en } from "./en/contact-copy.ts";

const es = {
  validationCopy: {
    name: "Escribe tu nombre.",
    nameLong: (max: number) => `Usa una versión más corta (máximo ${max} caracteres).`,
    email: "Revisa el formato del email.",
    emailLong: (max: number) => `Ese email es demasiado largo (máximo ${max} caracteres).`,
    messageShort: "Cuéntame un poco más (mínimo 10 caracteres).",
    messageLong: (max: number) => `Resúmelo un poco (máximo ${max} caracteres).`,
  },
  /** Envío automático con el Apps Script de Eidan: aquí sí hay confirmación del servidor. */
  autoCopy: {
    submit: "Enviar mensaje",
    sending: "Enviando…",
    sendingLive: "Enviando tu mensaje…",
    note: "Te llega directo a mi correo. Este sitio no guarda tus datos.",
    sentTitle: "¡Mensaje enviado!",
    sentBody: "Ya está en mi bandeja de entrada. Te respondo a",
    sentBodyEnd: "lo antes posible.",
    failedTitle: "No se pudo enviar automáticamente.",
    failedBody: "Tu texto sigue aquí: envíalo con tu correo (ya va escrito) o copia mi email.",
    failure: {
      offline: "Parece que no tienes conexión a internet.",
      timeout: "El servidor tardó demasiado en responder.",
      network: "No pude conectar con el servidor de correo.",
      rejected: "El servidor de correo no aceptó el envío.",
    },
  },
  /** Plan B (o canal único si el envío automático no está configurado): abrir el correo del visitante. */
  channelCopy: {
    web: {
      submit: "Enviar con Gmail",
      note: "Se abrirá Gmail con tu mensaje listo para enviar. Este sitio no envía ni guarda tus datos.",
      openedTitle: "¡Tu mensaje está listo en Gmail!",
      openedBody: "Lo abrí en otra pestaña, ya escrito para mí.",
      reopen: "Volver a abrir Gmail",
      blockedTitle: "Tu navegador bloqueó la pestaña de Gmail.",
      blockedBody: "Ábrela con este botón (tu mensaje ya va escrito) o copia mi email.",
      retry: "Abrir Gmail",
    },
    app: {
      submit: "Enviar desde tu correo",
      note: "Se abrirá tu app de correo (Gmail en Android) con tu mensaje listo. Este sitio no envía ni guarda tus datos.",
      openedTitle: "¡Tu mensaje está listo en tu correo!",
      openedBody: "Se abrió tu app de correo con el mensaje ya escrito para mí.",
      reopen: "Volver a abrir mi correo",
      blockedTitle: "No se abrió tu app de correo.",
      blockedBody: "Inténtalo con este botón o copia mi email y escríbeme desde donde prefieras.",
      retry: "Abrir mi correo",
    },
  },
  sharedCopy: {
    launching: "Abriendo tu correo…",
    launchingLive: "Abriendo tu app de correo…",
    sendHint: "Revísalo y pulsa",
    sendHintAction: "Enviar",
    sendHintEnd: "para que me llegue.",
    another: "Escribir otro",
    copyEmail: "Copiar email",
    copied: "¡Copiado!",
    noGmail: "¿No usas Gmail?",
    noGmailCopy: "Copia mi email",
    noGmailCopied: "¡Email copiado!",
    noGmailEnd: "y escríbeme desde tu correo.",
    validationNudge: "Casi. Revisa los campos marcados y lo intentamos de nuevo.",
  },
};

/** Forma común de los textos: la versión inglesa debe tener exactamente las mismas claves. */
export type ContactCopy = typeof es;

export const { validationCopy, autoCopy, channelCopy, sharedCopy } = pick({ es, en });
