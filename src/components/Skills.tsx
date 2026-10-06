/**
 * Stack técnico como "inventario" de Clawd: cada tecnología es un slot con su
 * logo, para qué se usa y su evidencia (proyectos reales donde aparece). Los
 * filtros reordenan con animación de layout; pulsar un slot hace que Buddy la
 * explique y ofrezca saltar al proyecto.
 */
import { AnimatePresence, LayoutGroup, motion, useReducedMotionConfig } from "motion/react";
import { FileCheckCorner, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { categories, capacities, learning, projectsFor, techs } from "@/data/skills";
import { useBuddy } from "@/buddy/BuddyProvider";
import { Reveal, trackGlow } from "@/components/interactive";
import { SectionHeading } from "@/components/SectionHeading";
import { TechIcon } from "@/components/TechIcon";
import type { Tech, TechCategory } from "@/lib/types";

type Filter = TechCategory | "todo";

/** Colores de etiqueta por categoría, en la paleta de Anthropic. */
const TAG: Record<TechCategory, CSSProperties> = {
  lenguajes: { "--tag-fg": "var(--color-claude-light)", "--tag-bg": "rgb(217 119 87 / 0.14)" } as CSSProperties,
  datos: { "--tag-fg": "var(--color-sky-light)", "--tag-bg": "rgb(106 155 204 / 0.14)" } as CSSProperties,
  automatizacion: { "--tag-fg": "var(--color-olive-light)", "--tag-bg": "rgb(120 140 93 / 0.18)" } as CSSProperties,
  workflow: { "--tag-fg": "var(--color-sand)", "--tag-bg": "rgb(250 249 245 / 0.08)" } as CSSProperties,
};

const tagLabel = (c: TechCategory) => categories.find((x) => x.id === c)?.tag ?? c;

/** Medidor pixel de evidencia: un bloque por proyecto destacado (máx. 4). */
function EvidenceMeter({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {Array.from({ length: 4 }, (_, i) => (
        <span key={i} className={`h-2 w-2.5 ${i < count ? "bg-claude" : "bg-white/12"}`} />
      ))}
    </span>
  );
}

function TechSlot({ tech, onSelect }: { tech: Tech; onSelect: (t: Tech) => void }) {
  const used = projectsFor(tech);
  const n = used.length;
  const evidence = n > 0 ? `${n} ${n === 1 ? "proyecto" : "proyectos"}${tech.note ? ` · ${tech.note}` : ""}` : (tech.note ?? "");

  return (
    <button
      type="button"
      onClick={() => onSelect(tech)}
      onPointerMove={(e) => trackGlow(e.currentTarget, e)}
      onPointerLeave={(e) => e.currentTarget.style.setProperty("--glow", "0")}
      style={{ "--brand": tech.brand } as CSSProperties}
      aria-label={`${tech.name}: ${tech.role}. ${evidence}. Pregúntale a Buddy.`}
      className="tech-slot glass glow-border group flex h-full w-full items-start gap-4 rounded-2xl p-4 text-left transition-transform duration-300 hover:-translate-y-1"
    >
      <span className="tech-logo pixel-corners grid size-12 shrink-0 place-items-center bg-ink-3">
        <TechIcon id={tech.icon} className="size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span className="font-display font-bold text-fg">{tech.name}</span>
          <span className="pixel-tag shrink-0" style={TAG[tech.category]}>
            {tagLabel(tech.category)}
          </span>
        </span>
        <span className="mt-0.5 block text-sm leading-snug text-subtle">{tech.role}</span>
        <span className="mt-2.5 flex items-start gap-2 text-xs leading-snug text-muted">
          <span className="mt-0.5 shrink-0">
            {n > 0 ? <EvidenceMeter count={n} /> : <FileCheckCorner className="size-3.5 text-stone" aria-hidden="true" />}
          </span>
          <span>{evidence}</span>
        </span>
      </span>
    </button>
  );
}

export function Skills() {
  const { say, scrollTo } = useBuddy();
  const reduce = useReducedMotionConfig();
  const [filter, setFilter] = useState<Filter>("todo");

  const shown = useMemo(() => (filter === "todo" ? techs : techs.filter((t) => t.category === filter)), [filter]);
  const tabs: { id: Filter; label: string; count: number }[] = [
    { id: "todo", label: "Todo", count: techs.length },
    ...categories.map((c) => ({ id: c.id, label: c.label, count: techs.filter((t) => t.category === c.id).length })),
  ];

  // Buddy explica la tecnología con su evidencia y ofrece saltar a los proyectos donde se usó.
  const explain = (tech: Tech) => {
    const used = projectsFor(tech);
    const parts = [`${tech.role}.`];
    if (tech.capacities?.length) parts.push(`${tech.capacities.join(" · ")}.`);
    if (used.length) parts.push(`La usa en: ${used.map((p) => p.title).join(", ")}.`);
    else if (tech.note) parts.push(`${tech.note}.`);
    say({
      type: "text",
      title: tech.name,
      text: parts.join(" "),
      mood: tech.category === "automatizacion" ? "happy" : "coding",
      actions: used.slice(0, 2).map((p) => ({
        label: `Ver ${p.title.split(" ").slice(0, 2).join(" ")}`,
        run: () => {
          scrollTo(`proyecto-${p.id}`);
          say({ type: "project", projectId: p.id });
        },
      })),
    });
  };

  return (
    <section id="stack" aria-labelledby="stack-title" className="shell px-4 py-24 sm:px-6">
      <SectionHeading id="stack-title" eyebrow="Stack técnico" title={<>Herramientas con <span className="text-gradient">evidencia</span>.</>}>
        {techs.length} tecnologías agrupadas por función. Cada una dice para qué la uso y dónde se ve; pulsa cualquiera y Buddy te lo cuenta.
      </SectionHeading>

      <Reveal>
        <LayoutGroup id="stack-filter">
          <div role="group" aria-label="Filtrar el stack por categoría" className="glass mb-6 inline-flex max-w-full flex-wrap gap-1 rounded-2xl p-1.5">
            {tabs.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(tab.id)}
                  className={`relative flex min-h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-medium transition-colors ${active ? "text-ink" : "text-muted hover:text-fg"}`}
                >
                  {active && (
                    <motion.span
                      layoutId="stack-filter-pill"
                      className="absolute inset-0 rounded-xl bg-claude"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative">{tab.label}</span>
                  <span className={`relative font-pixel text-xs ${active ? "text-ink/80" : "text-stone"}`}>{tab.count}</span>
                </button>
              );
            })}
          </div>
        </LayoutGroup>
      </Reveal>

      <div className="@container">
        <motion.ul layout className="grid grid-cols-1 gap-3 @lg:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((tech, i) => (
              <motion.li
                key={tech.id}
                layout
                initial={{ opacity: 0, scale: reduce ? 1 : 0.9, y: reduce ? 0 : 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: reduce ? 1 : 0.9 }}
                transition={{ duration: 0.35, delay: reduce ? 0 : Math.min(i, 8) * 0.03, ease: [0.16, 1, 0.3, 1] }}
              >
                <TechSlot tech={tech} onSelect={explain} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>
      <p className="sr-only" role="status">
        {shown.length} tecnologías en {tabs.find((t) => t.id === filter)?.label}.
      </p>

      <Reveal className="mt-8 grid gap-3">
        <p className="flex flex-wrap items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5 font-semibold text-muted">
            <Sparkles className="size-4 text-claude-light" aria-hidden="true" /> Capacidades:
          </span>
          {capacities.map((c) => (
            <span key={c} className="chip !text-xs">
              {c}
            </span>
          ))}
        </p>
        <p className="flex flex-wrap items-center gap-2 text-sm text-subtle">
          <span className="font-semibold text-muted">En consolidación:</span>
          {learning.map((l) => (
            <span key={l} className="chip border-dashed !text-xs">
              {l}
            </span>
          ))}
        </p>
      </Reveal>
    </section>
  );
}
