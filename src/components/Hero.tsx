import { motion, useReducedMotionConfig } from "motion/react";
import { ArrowUpRight, Download, Mail } from "lucide-react";
import { profile } from "@/data/profile";
import { HeroBuddy } from "@/buddy/HeroBuddy";
import { useBuddy } from "@/buddy/BuddyProvider";
import { GitHubIcon } from "@/components/icons";
import { Magnetic } from "@/components/interactive";
import { ProfileCode } from "@/components/ProfileCode";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { stage, intro } = useBuddy();
  const reduce = useReducedMotionConfig();
  const hidden = { opacity: 0, y: reduce ? 0 : 24 };
  // Con la intro de escritorio en pantalla el texto espera: aparece mientras Clawd vuela hacia aquí.
  const rise = (delay: number) => ({
    initial: hidden,
    animate: intro === "play" ? hidden : { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  });

  return (
    <section id="inicio" aria-labelledby="hero-title" className="shell relative grid min-h-[100dvh] grid-cols-1 items-center gap-10 px-4 pt-28 pb-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-6">
      <div className="order-2 lg:order-1">
        <motion.p {...rise(0.1)} className="glass mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted sm:text-sm">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-olive-light opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-olive-light" />
          </span>
          {profile.availability}
        </motion.p>

        <motion.p {...rise(0.2)} className="eyebrow mb-2">
          {profile.role}
        </motion.p>

        <motion.p {...rise(0.25)} className="mb-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {profile.name}
        </motion.p>

        <motion.h1 {...rise(0.35)} id="hero-title" className="font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl">
          {profile.headline} <span className="text-gradient">{profile.headlineAccent}</span>
        </motion.h1>

        <motion.p {...rise(0.5)} className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          <strong className="font-semibold text-fg">{profile.tagline}.</strong> {profile.valueProp}
        </motion.p>

        <motion.div {...rise(0.65)} className="mt-8 flex flex-wrap items-center gap-3">
          <Magnetic>
            <a href={profile.cv} download className="btn btn-primary">
              <Download className="size-4" aria-hidden="true" /> Descargar CV
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contacto" className="btn btn-ghost">
              <Mail className="size-4" aria-hidden="true" /> Contacto
            </a>
          </Magnetic>
          <Magnetic>
            <a href={profile.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
              <GitHubIcon className="size-4" /> GitHub
              <ArrowUpRight className="size-3.5 text-subtle" aria-hidden="true" />
            </a>
          </Magnetic>
        </motion.div>
      </div>

      <div className="order-1 flex justify-center lg:order-2">{stage === "hero" ? <HeroBuddy /> : <ProfileCode />}</div>
    </section>
  );
}
