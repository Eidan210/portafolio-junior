/**
 * Contacto sin backend: el formulario valida y compone un `mailto:` con el
 * mensaje prellenado. Así no hay servicio de terceros recibiendo datos del
 * visitante ni un endpoint que mantener; el envío real lo hace su cliente.
 */
import { AnimatePresence, motion, useReducedMotionConfig } from "motion/react";
import { Check, Copy, Download, Send } from "lucide-react";
import { useId, useState } from "react";
import type { FormEvent } from "react";
import { contactThanks, copiedEmail } from "@/data/buddy-script";
import { profile } from "@/data/profile";
import { copyEmail } from "@/buddy/BuddyPanel";
import { useBuddy } from "@/buddy/BuddyProvider";
import { GitHubIcon } from "@/components/icons";
import { GlowPanel, Magnetic, Reveal } from "@/components/interactive";
import { SectionHeading } from "@/components/SectionHeading";

type Fields = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(f: Fields): Errors {
  const e: Errors = {};
  if (f.name.trim().length < 2) e.name = "Escribe tu nombre.";
  if (!EMAIL_RE.test(f.email.trim())) e.email = "Revisa el formato del email.";
  if (f.message.trim().length < 10) e.message = "Cuéntame un poco más (mínimo 10 caracteres).";
  return e;
}

const input =
  "w-full rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3 text-fg placeholder:text-subtle/70 transition-colors focus:border-claude/70 focus:bg-white/[0.08] focus:outline-none aria-[invalid=true]:border-danger";

/** Check que se dibuja trazo a trazo: confirmación del envío. */
function SuccessMark() {
  const reduce = useReducedMotionConfig();
  return (
    <svg viewBox="0 0 52 52" className="size-14" aria-hidden="true">
      <motion.circle cx="26" cy="26" r="24" fill="none" stroke="var(--color-olive-light)" strokeWidth="3" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
      <motion.path d="M15 27 l7 7 l15 -16" fill="none" stroke="var(--color-olive-light)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.4 }} />
    </svg>
  );
}

export function Contact() {
  const { say } = useBuddy();
  const uid = useId();
  const [fields, setFields] = useState<Fields>({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (k: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(fields);
    setErrors(found);
    const first = (Object.keys(found) as (keyof Fields)[])[0];
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus();
      say({ type: "text", text: "Casi. Revisa los campos marcados y lo intentamos de nuevo.", mood: "surprised", auto: true });
      return;
    }
    const subject = `Contacto desde el portafolio — ${fields.name.trim()}`;
    const body = `${fields.message.trim()}\n\n— ${fields.name.trim()} (${fields.email.trim()})`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    say({ type: "text", text: contactThanks, mood: "happy", auto: true });
  };

  const onCopy = async () => {
    if (!(await copyEmail())) return;
    setCopied(true);
    say({ type: "text", text: copiedEmail, mood: "happy", auto: true });
    window.setTimeout(() => setCopied(false), 2200);
  };

  const field = (k: keyof Fields, label: string, el: "input" | "textarea", type = "text", autoComplete?: string) => {
    const id = `${uid}-${k}`;
    const err = errors[k];
    return (
      <div>
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-muted">
          {label}
        </label>
        {el === "input" ? (
          <input id={id} type={type} autoComplete={autoComplete} value={fields[k]} onChange={set(k)} aria-invalid={!!err} aria-describedby={err ? `${id}-err` : undefined} className={input} />
        ) : (
          <textarea id={id} rows={5} value={fields[k]} onChange={set(k)} aria-invalid={!!err} aria-describedby={err ? `${id}-err` : undefined} className={`${input} resize-y`} />
        )}
        <AnimatePresence>
          {err && (
            <motion.p id={`${id}-err`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-1.5 text-xs text-danger">
              {err}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <section id="contacto" aria-labelledby="contact-title" className="shell px-4 py-24 sm:px-6">
      <SectionHeading id="contact-title" eyebrow="Contacto" title={<>¿Construimos <span className="text-gradient">algo juntos</span>?</>}>
        {profile.availability}. Escríbeme por el formulario o por el canal que prefieras.
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
              <span className="block text-xs text-subtle">{copied ? "¡Copiado!" : "Email · clic para copiar"}</span>
              <span className="block truncate font-semibold">{profile.email}</span>
            </span>
          </button>
          <a href={profile.github} target="_blank" rel="noreferrer" className="glass flex items-center gap-4 rounded-3xl p-5 transition-colors hover:bg-white/[0.08]">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sky/15 text-sky-light">
              <GitHubIcon className="size-5" />
            </span>
            <span>
              <span className="block text-xs text-subtle">GitHub</span>
              <span className="block font-semibold">github.com/{profile.githubUser}</span>
            </span>
          </a>
          <a href={profile.cv} download className="glass flex items-center gap-4 rounded-3xl p-5 transition-colors hover:bg-white/[0.08]">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-sky/15 text-sky-light">
              <Download className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-xs text-subtle">Currículum</span>
              <span className="block font-semibold">Descargar CV (PDF)</span>
            </span>
          </a>
        </Reveal>

        <Reveal delay={0.1}>
          <GlowPanel className="rounded-3xl p-6 sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                <motion.div key="sent" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex min-h-[22rem] flex-col items-center justify-center gap-4 text-center" role="status">
                  <SuccessMark />
                  <p className="font-display text-xl font-bold">¡Mensaje preparado!</p>
                  <p className="max-w-sm text-sm text-muted">Tu cliente de correo se abrió con el texto listo. Si no se abrió, copia el email de la izquierda.</p>
                  <button type="button" className="btn btn-ghost !text-sm" onClick={() => { setSent(false); setFields({ name: "", email: "", message: "" }); }}>
                    Escribir otro
                  </button>
                </motion.div>
              ) : (
                <motion.form key="form" exit={{ opacity: 0 }} noValidate onSubmit={onSubmit} className="grid gap-4" aria-label="Formulario de contacto">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {field("name", "Nombre", "input", "text", "name")}
                    {field("email", "Email", "input", "email", "email")}
                  </div>
                  {field("message", "Mensaje", "textarea")}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-subtle">Se abrirá tu app de correo; no guardo tus datos.</p>
                    <Magnetic>
                      <button type="submit" className="btn btn-primary">
                        <Send className="size-4" aria-hidden="true" /> Enviar mensaje
                      </button>
                    </Magnetic>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </GlowPanel>
        </Reveal>
      </div>
    </section>
  );
}
