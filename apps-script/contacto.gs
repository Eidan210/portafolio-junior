/**
 * Contacto del portafolio con Google Apps Script: recibe el formulario y envía
 * el mensaje, con MailApp, a la cuenta de Google que despliega el script. Sin
 * servicios de terceros: el correo sale de tu propia cuenta hacia ti mismo.
 *
 * El sitio envía el cuerpo como text/plain (petición simple: Apps Script no
 * responde al preflight OPTIONS) y solo da el mensaje por enviado si aquí se
 * responde { ok: true }. Despliegue: ver apps-script/README.md.
 */

/** Topes de longitud: los mismos que valida el formulario (NAME_MAX, EMAIL_MAX y MESSAGE_MAX en src/lib/contact.ts). */
var MAX = { name: 100, email: 150, message: 1500 };
/** Antiabuso global: como mucho 8 mensajes cada 10 minutos. */
var RATE = { windowSeconds: 600, maxPerWindow: 8 };
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    // Honeypot: un campo oculto que solo rellenan los bots. Éxito simulado y sin correo.
    if (data.honeypot) return reply({ ok: true });

    // Sin caracteres de control: el nombre va en el asunto del correo (cabecera).
    var name = text(data.name).replace(/[\u0000-\u001f\u007f]+/g, " ");
    var email = text(data.email);
    var message = text(data.message);
    if (name.length < 2 || name.length > MAX.name) return reply({ ok: false, error: "invalid" });
    if (!EMAIL_RE.test(email) || email.length > MAX.email) return reply({ ok: false, error: "invalid" });
    if (message.length < 10 || message.length > MAX.message) return reply({ ok: false, error: "invalid" });

    if (!allow()) return reply({ ok: false, error: "rate" });
    if (MailApp.getRemainingDailyQuota() < 1) return reply({ ok: false, error: "quota" });

    MailApp.sendEmail({
      to: Session.getEffectiveUser().getEmail(),
      // Responder al correo contesta directamente al visitante.
      replyTo: email,
      name: "Portafolio de Eidan",
      subject: "Contacto desde el portafolio — " + name,
      body: message + "\n\n— " + name + " (" + email + ")",
    });
    return reply({ ok: true });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: "server" });
  }
}

/** Comprobación rápida: abrir la URL /exec en el navegador debe mostrar { ok: true }. */
function doGet() {
  return reply({ ok: true, service: "contacto" });
}

function text(value) {
  return typeof value === "string" ? value.trim() : "";
}

/** Contador global en caché con candado: evita que dos envíos simultáneos se salten el tope. */
function allow() {
  var lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    var cache = CacheService.getScriptCache();
    var count = Number(cache.get("contact-count") || 0);
    if (count >= RATE.maxPerWindow) return false;
    cache.put("contact-count", String(count + 1), RATE.windowSeconds);
    return true;
  } finally {
    lock.releaseLock();
  }
}

function reply(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
