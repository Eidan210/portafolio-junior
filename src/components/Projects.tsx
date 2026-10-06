import { motion, useReducedMotionConfig } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { BuddyAvatar } from "@/buddy/BuddyAvatar";
import { useBuddy } from "@/buddy/BuddyProvider";
import { GitHubIcon } from "@/components/icons";
import { Reveal, TiltCard } from "@/components/interactive";
import { SectionHeading } from "@/components/SectionHeading";
import type { CSSProperties } from "react";
import type { Project } from "@/lib/types";

const FEATURED_TAG = { "--tag-fg": "var(--color-claude-light)", "--tag-bg": "rgb(217 119 87 / 0.14)" } as CSSProperties;

/** Pares de color de la paleta de Anthropic para las vistas previas generativas. */
const PALETTE = [
  ["#d97757", "#6a9bcc"],
  ["#6a9bcc", "#788c5d"],
  ["#788c5d", "#d4a27f"],
  ["#d4a27f", "#d97757"],
  ["#eba487", "#6a9bcc"],
  ["#9cc0e4", "#d97757"],
] as const;

/**
 * Bento sin huecos para 6 proyectos, sin celdas que crezcan en vacío.
 * lg (3 col): destacado horizontal a todo el ancho · Mym (2) + 1 · fila de 3 = 9.
 * md (2 col): destacado · Mym · 2 + 2 = 8.
 */
const SPANS = ["md:col-span-2 lg:col-span-3", "md:col-span-2", "", "", "", ""];

/** Vista previa generativa para repos sin captura: decorativa, no simula una UI que no existe. */
function GenerativePreview({ project, index }: { project: Project; index: number }) {
  const [a, b] = PALETTE[index % PALETTE.length] ?? PALETTE[0];
  return (
    <div
      className="relative flex h-full flex-col justify-end overflow-hidden p-5"
      style={{
        background: `radial-gradient(120% 90% at 0% 0%, ${a}66, transparent 60%), radial-gradient(90% 80% at 100% 100%, ${b}55, transparent 60%), #1c1b19`,
      }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgb(232_230_220/0.5)_1px,transparent_1.5px)] [background-size:16px_16px]" />
      <p className="relative font-mono text-[0.7rem] text-sand/70">$ git clone github.com/Eidan210/{project.repo}</p>
      <p className="relative mt-1 font-display text-2xl font-extrabold tracking-tight text-fg/90">{project.repo}</p>
    </div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { say, minimized, setMinimized } = useBuddy();
  const reduce = useReducedMotionConfig();
  // El destacado es horizontal en escritorio: captura a la izquierda, contenido a la derecha.
  const featured = index === 0;

  const askBuddy = () => {
    if (minimized) setMinimized(false);
    say({ type: "project", projectId: project.id });
  };

  return (
    <TiltCard max={featured ? 2 : 5} className={`group flex h-full flex-col overflow-hidden rounded-3xl ${featured ? "lg:flex-row" : ""}`}>
      <div
        className={`relative overflow-hidden border-b border-white/10 ${
          featured ? "aspect-[16/9] lg:aspect-auto lg:w-[54%] lg:shrink-0 lg:border-r lg:border-b-0" : index === 1 ? "aspect-[16/7]" : "aspect-[16/9]"
        }`}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={`Captura de ${project.title}`}
            loading="lazy"
            decoding="async"
            className="size-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <GenerativePreview project={project} index={index} />
        )}
        {/* Fondo casi opaco: sobre capturas claras el vidrio al 5 % no da contraste AA. */}
        <span className="absolute top-3 left-3 rounded-full border border-white/15 bg-ink/80 px-3 py-1 text-xs font-semibold text-fg backdrop-blur-md">
          {project.category}
        </span>
      </div>

      <div className={`flex flex-1 flex-col p-5 sm:p-6 ${featured ? "lg:justify-center lg:p-8" : ""}`}>
        {featured && <p className="pixel-tag mb-3 self-start" style={FEATURED_TAG}>★ Destacado</p>}
        <h3 className={`font-display font-bold ${featured ? "text-2xl" : "text-xl"}`}>{project.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.summary}</p>

        <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {project.metrics.map((m) => (
            <div key={m.label} className="flex items-baseline gap-1.5">
              <dt className="sr-only">{m.label}</dt>
              <dd className="font-display text-lg font-extrabold text-claude-light">{m.value}</dd>
              <span className="text-xs text-subtle" aria-hidden="true">
                {m.label}
              </span>
            </div>
          ))}
        </dl>

        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tecnologías">
          {project.stack.map((t) => (
            <li key={t} className="chip !px-2.5 !py-0.5 !text-xs">
              {t}
            </li>
          ))}
        </ul>

        <div className={`flex flex-wrap items-center gap-2 pt-6 ${featured ? "lg:mt-2" : "mt-auto"}`}>
          <motion.button
            type="button"
            onClick={askBuddy}
            whileHover={reduce ? undefined : { scale: 1.03 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className="btn btn-ghost !min-h-10 !border-claude/40 !bg-claude/10 !py-1.5 !pr-4 !pl-1.5 !text-sm hover:!bg-claude/20"
          >
            <BuddyAvatar mood="happy" bare className="size-8" />
            ¿Qué dice Buddy?
          </motion.button>
          <a href={project.repoUrl} target="_blank" rel="noreferrer" className="btn btn-ghost !min-h-10 !px-3.5 !text-sm" aria-label={`Repositorio de ${project.title}`}>
            <GitHubIcon className="size-4" /> Repo
          </a>
          {project.demoUrl && (
            <a href={project.demoUrl} target="_blank" rel="noreferrer" className="btn btn-ghost !min-h-10 !px-3.5 !text-sm" aria-label={`Demo en vivo de ${project.title}`}>
              <ArrowUpRight className="size-4" aria-hidden="true" /> Demo
            </a>
          )}
        </div>
      </div>
    </TiltCard>
  );
}

export function Projects() {
  return (
    <section id="proyectos" aria-labelledby="projects-title" className="shell px-4 py-24 sm:px-6">
      <SectionHeading id="projects-title" eyebrow="Proyectos destacados" title={<>Software que <span className="text-gradient">resuelve algo</span>.</>}>
        Seis repositorios reales, de la automatización con IA a herramientas en Python. Cada cifra sale del propio repo.
      </SectionHeading>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <li key={project.id} id={`proyecto-${project.id}`} className={`scroll-mt-28 ${SPANS[i] ?? ""}`}>
            <Reveal delay={(i % 3) * 0.08} className="h-full">
              <ProjectCard project={project} index={i} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
