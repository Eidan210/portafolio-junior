import { Target } from "lucide-react";
import { principles, profile, timeline } from "@/data/profile";
import { GlowPanel, Reveal, TiltCard } from "@/components/interactive";
import { SectionHeading } from "@/components/SectionHeading";

export function About() {
  return (
    <section id="sobre-mi" aria-labelledby="about-title" className="shell px-4 py-24 sm:px-6">
      <SectionHeading id="about-title" eyebrow="Sobre mí" title={<>Diagnóstico antes que <span className="text-gradient">parche</span>.</>}>
        Cómo pienso, cómo trabajo y de dónde vengo.
      </SectionHeading>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal className="grid gap-6">
          <GlowPanel className="rounded-3xl p-6 sm:p-8">
            <div className="grid gap-4 text-base leading-relaxed text-muted">
              {profile.bio.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
          </GlowPanel>
          <GlowPanel className="flex gap-4 rounded-3xl p-6">
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-claude/15 text-claude-light">
              <Target className="size-5" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display font-bold">Objetivo</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{profile.objective}</p>
            </div>
          </GlowPanel>
        </Reveal>

        <Reveal delay={0.1}>
          <GlowPanel className="h-full rounded-3xl p-6 sm:p-8">
            <h3 className="mb-6 font-display text-lg font-bold">Trayectoria</h3>
            <ol className="relative grid gap-6 border-l border-white/12 pl-6">
              {timeline.map((m) => (
                <li key={m.title} className="relative">
                  <span className="absolute top-1.5 -left-[1.95rem] size-3 rounded-full border-2 border-ink bg-claude shadow-[0_0_12px_rgb(240_145_106/0.8)]" aria-hidden="true" />
                  <p className="text-xs font-semibold tracking-wide text-claude-light">{m.period}</p>
                  <p className="mt-0.5 font-semibold text-fg">{m.title}</p>
                  <p className="text-sm text-subtle">{m.org}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{m.detail}</p>
                </li>
              ))}
            </ol>
          </GlowPanel>
        </Reveal>
      </div>

      <h3 className="sr-only">Filosofía de trabajo</h3>
      <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((p, i) => (
          <li key={p.claim}>
            <Reveal delay={i * 0.08} className="h-full">
              <TiltCard className="h-full rounded-3xl p-6">
                <p className="text-xs font-semibold tracking-wider text-subtle uppercase">{p.area}</p>
                <p className="mt-2 font-display text-lg leading-snug font-bold">{p.claim}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.detail}</p>
              </TiltCard>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
