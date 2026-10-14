/**
 * Resumen de 30 segundos para quien evalúa con prisa: rol, stack con evidencia,
 * tres proyectos, datos clave y contacto, sin animaciones ni recorrido. Todo
 * sale de `src/data`, así que no se desincroniza del resto del portafolio.
 */
import { Download, ExternalLink, Mail, X } from "lucide-react";
import { useId } from "react";
import { profile, profileCode } from "@/data/profile";
import { projects } from "@/data/projects";
import { projectsFor, techs } from "@/data/skills";
import { quickViewCopy as copy } from "@/data/ui";
import { useBuddyActions } from "@/buddy/BuddyProvider";
import { Dialog } from "@/components/Dialog";
import { GitHubIcon } from "@/components/icons";

/** Stack ordenado por evidencia (proyectos que lo usan); a igual evidencia, el orden de `skills.ts`. */
const TOP_STACK = techs
  .map((tech, i) => ({ tech, used: projectsFor(tech).length, i }))
  .filter((x) => x.used > 0)
  .sort((a, b) => b.used - a.used || a.i - b.i)
  .slice(0, 8);
/** Los tres primeros del bento: el orden de `projects.ts` ya es el de relevancia. */
const FEATURED = projects.slice(0, 3);
const FACTS = profileCode.filter((e) => e.key !== "rol" && typeof e.value !== "boolean");

const heading = "mb-3 text-xs font-semibold tracking-wider text-subtle uppercase";
const link = "inline-flex items-center gap-1 font-semibold text-claude-light underline-offset-4 hover:underline";

export function QuickView({ open, onClose }: { open: boolean; onClose: () => void }) {
  const id = useId();
  const { scrollTo } = useBuddyActions();

  const write = () => {
    onClose();
    // Al cerrar, el navegador devuelve el foco al botón del hero: el scroll va después.
    requestAnimationFrame(() => scrollTo("contacto"));
  };

  return (
    <Dialog open={open} onClose={onClose} labelledBy={`${id}-title`}>
      <header className="mb-6 flex items-start gap-4">
        <div className="min-w-0">
          <p className="eyebrow mb-1">{profile.role}</p>
          <h2 id={`${id}-title`} className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {copy.title}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {profile.location} · {profile.availability}
          </p>
        </div>
        <button type="button" onClick={onClose} className="ml-auto grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-fg" aria-label={copy.close}>
          <X className="size-5" aria-hidden="true" />
        </button>
      </header>

      <section className="mb-6">
        <h3 className={heading}>{copy.doing}</h3>
        <p className="leading-relaxed text-muted">{profile.valueProp}</p>
      </section>

      <section className="mb-6">
        <h3 className={heading}>{copy.stack}</h3>
        <ul className="flex flex-wrap gap-2">
          {TOP_STACK.map(({ tech, used }) => (
            <li key={tech.id} className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm">
              <span className="font-semibold">{tech.name}</span> <span className="text-subtle">· {copy.stackEvidence(used)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h3 className={heading}>{copy.featured}</h3>
        <ol className="grid gap-3">
          {FEATURED.map((p) => (
            <li key={p.id} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-semibold">{p.title}</span>
                <span className="text-xs text-subtle">{p.category}</span>
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{p.summary}</p>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <span className="text-subtle">{p.stack.slice(0, 4).join(" · ")}</span>
                <a href={p.repoUrl} target="_blank" rel="noreferrer" className={link}>
                  {copy.repo} <ExternalLink className="size-3.5" aria-hidden="true" />
                </a>
                {p.demoUrl && (
                  <a href={p.demoUrl} target="_blank" rel="noreferrer" className={link}>
                    {copy.demo} <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                )}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mb-8">
        <h3 className={heading}>{copy.facts}</h3>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {FACTS.map((e) => (
            <div key={e.key} className="rounded-2xl bg-white/[0.04] p-3">
              <dt className="text-xs text-subtle">{e.label}</dt>
              <dd className="mt-0.5 font-semibold">{String(e.value)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <footer className="flex flex-wrap gap-3">
        <a href={profile.cv} download className="btn btn-primary">
          <Download className="size-4" aria-hidden="true" /> {copy.cv}
        </a>
        <button type="button" onClick={write} className="btn btn-ghost">
          <Mail className="size-4" aria-hidden="true" /> {copy.write}
        </button>
        <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
          <GitHubIcon className="size-4" /> {copy.github}
        </a>
      </footer>
    </Dialog>
  );
}
