/**
 * Caso de estudio de un proyecto en un diálogo nativo: problema, solución,
 * decisiones técnicas, resultados y aprendizajes, con enlaces al código y a la
 * demo. El contenido sale de `projects.ts` y se contrastó con el README del repo.
 */
import { ExternalLink, X } from "lucide-react";
import { useId } from "react";
import { caseStudyCopy as copy } from "@/data/ui";
import { Dialog } from "@/components/Dialog";
import type { Project } from "@/lib/types";

const heading = "mb-2 text-xs font-semibold tracking-wider text-subtle uppercase";

function Points({ title, items }: { title: string; items: readonly string[] }) {
  if (!items.length) return null;
  return (
    <section className="mb-6">
      <h3 className={heading}>{title}</h3>
      <ul className="grid gap-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2.5 leading-relaxed text-muted">
            <span className="mt-2.5 size-1.5 shrink-0 bg-claude" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CaseStudyDialog({ project, open, onClose }: { project: Project; open: boolean; onClose: () => void }) {
  const id = useId();
  const study = project.caseStudy;
  if (!study) return null;

  return (
    <Dialog open={open} onClose={onClose} labelledBy={`${id}-title`}>
      <header className="mb-6 flex items-start gap-4">
        <div className="min-w-0">
          <p className="eyebrow mb-1">{copy.eyebrow}</p>
          <h2 id={`${id}-title`} className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
            {project.title}
          </h2>
          <p className="mt-1 text-sm text-subtle">{project.stack.join(" · ")}</p>
        </div>
        <button type="button" onClick={onClose} className="ml-auto grid size-10 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-fg" aria-label={copy.close}>
          <X className="size-5" aria-hidden="true" />
        </button>
      </header>

      <section className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <h3 className={heading}>{copy.problem}</h3>
          <p className="leading-relaxed text-muted">{study.problem}</p>
        </div>
        <div className="rounded-2xl bg-white/[0.04] p-4">
          <h3 className={heading}>{copy.solution}</h3>
          <p className="leading-relaxed text-muted">{study.solution}</p>
        </div>
      </section>

      <Points title={copy.decisions} items={study.decisions} />
      <Points title={copy.results} items={study.results} />
      <Points title={copy.learnings} items={study.learnings} />

      <footer className="flex flex-wrap gap-3">
        <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
          {copy.repo} <ExternalLink className="size-4" aria-hidden="true" />
        </a>
        {project.demoUrl && (
          <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn btn-ghost">
            {copy.demo} <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        )}
      </footer>
    </Dialog>
  );
}
