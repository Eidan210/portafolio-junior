/**
 * Navegación principal. Cada enlace es una parada de la ruta de Buddy (mismo
 * número que en la ruta, en naranja cuando ya se visitó). En escritorio: pill
 * de hover que sigue al cursor, pill de sección activa y modo compacto al hacer
 * scroll. El progreso de lectura es el borde inferior del pill, que se llena;
 * un mini Clawd viaja colgado de él, como en una tirolesa, y se balancea con la
 * velocidad del scroll.
 */
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotionConfig,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { Check, Download, FolderGit2, Layers, Mail, Menu, UserRound, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";
import { profile } from "@/data/profile";
import { useBuddy } from "@/buddy/BuddyProvider";
import { stationNumber } from "@/buddy/stations";
import { GitHubIcon } from "@/components/icons";
import type { SectionId } from "@/lib/types";

const LINKS: readonly { id: SectionId; label: string; icon: LucideIcon }[] = [
  { id: "sobre-mi", label: "Sobre mí", icon: UserRound },
  { id: "stack", label: "Stack", icon: Layers },
  { id: "proyectos", label: "Proyectos", icon: FolderGit2 },
  { id: "contacto", label: "Contacto", icon: Mail },
];

const SPRING = { type: "spring", stiffness: 420, damping: 34 } as const;
/** Clawd con los brazos arriba: las manos (12 % superior del PNG) se agarran al borde del pill. */
const RIDER_SRC = `${import.meta.env.BASE_URL}clawd/clawd-hands-up.png`;

export function Nav() {
  const { activeSection, visited } = useBuddy();
  const reduce = useReducedMotionConfig();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<SectionId | null>(null);
  const [compact, setCompact] = useState(false);

  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 32, restDelta: 0.001 });
  // El envoltorio mide lo mismo que la vía: trasladarlo un % de su propio ancho lo lleva a ese % de la vía.
  const riderX = useTransform(progress, (v) => `${v * 100}%`);
  // En los extremos el mini Clawd taparía el logo o el botón de CV: aparece solo mientras avanza.
  const riderOpacity = useTransform(progress, [0, 0.03, 0.97, 1], [0, 1, 1, 0]);
  // Péndulo: al avanzar, el cuerpo se queda atrás; al frenar oscila hasta parar (resorte poco amortiguado).
  const velocity = useVelocity(scrollY);
  const swing = useSpring(useTransform(velocity, [-2400, 0, 2400], [-16, 0, 16]), { stiffness: 140, damping: 7 });

  useMotionValueEvent(scrollY, "change", (v) => setCompact(v > 24));

  return (
    <header className="fixed inset-x-0 top-0 z-40 overflow-x-clip px-3 pt-3 sm:px-6 sm:pt-4">
      <nav
        aria-label="Principal"
        className={`glass glass-dense relative mx-auto flex max-w-6xl items-center gap-2 rounded-full pr-2 pl-2.5 transition-[padding,background-color] duration-300 sm:pl-3 ${
          compact ? "bg-ink/50 py-1.5" : "py-2"
        }`}
      >
        <a href="#inicio" className="flex items-center gap-3 rounded-full pr-2" aria-label="Ir al inicio">
          <span className="pixel-corners grid size-10 shrink-0 place-items-center bg-claude font-pixel text-sm font-semibold text-ink">EC</span>
          {/* En md los 4 enlaces ocupan el ancho: solo queda sitio para el badge. */}
          <span className="hidden leading-tight sm:block md:hidden lg:block">
            <span className="block font-display text-base font-extrabold tracking-tight lg:text-[1.0625rem]">{profile.shortName}</span>
            <span className="hidden text-xs text-subtle lg:block">{profile.role}</span>
          </span>
        </a>

        <ul className="mx-auto hidden items-center gap-0.5 md:flex" onMouseLeave={() => setHovered(null)}>
          {LINKS.map(({ id, label }) => {
            const active = activeSection === id;
            const done = visited.includes(id);
            return (
              <li key={id} className="relative">
                <a
                  href={`#${id}`}
                  onMouseEnter={() => setHovered(id)}
                  onFocus={() => setHovered(id)}
                  onBlur={() => setHovered(null)}
                  aria-current={active ? "true" : undefined}
                  className={`relative z-10 flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${active ? "text-fg" : "text-muted hover:text-fg"}`}
                >
                  <span className={`font-pixel text-[0.8rem] leading-none transition-colors ${done ? "text-claude-light" : "text-stone"}`} aria-hidden="true">
                    {stationNumber(id)}
                  </span>
                  {label}
                </a>
                {hovered === id && <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-white/[0.06]" transition={SPRING} />}
                {active && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-full border border-claude/40 bg-claude/12" transition={SPRING} />}
              </li>
            );
          })}
        </ul>

        <div className="ml-auto flex items-center gap-1.5 md:ml-0">
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="hidden size-10 place-items-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-fg sm:grid"
            aria-label="GitHub de Eidan"
          >
            <GitHubIcon className="size-[1.125rem]" />
          </a>
          <a href={profile.cv} download className="btn btn-primary !min-h-10 !px-4 !text-sm">
            <Download className="size-4" aria-hidden="true" />
            <span>CV</span>
          </a>
          <button
            type="button"
            className="grid size-10 place-items-center rounded-full text-fg hover:bg-white/10 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Cerrar navegación" : "Abrir navegación"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>

        {/* Progreso de lectura: la vía es el tramo recto del borde inferior del pill (el radio mide la mitad del alto). */}
        <div className="pointer-events-none absolute inset-x-7 -bottom-px h-0.5" aria-hidden="true">
          <span className="absolute inset-0 rounded-full bg-white/10" />
          <motion.span className="absolute inset-0 origin-left rounded-full bg-gradient-to-r from-claude-light via-claude to-sky" style={{ scaleX: progress }} />
          <motion.div className="absolute top-0 left-0 w-full" style={{ x: riderX, opacity: riderOpacity }}>
            <motion.img
              src={RIDER_SRC}
              alt=""
              draggable={false}
              className="nav-rider absolute -top-[3px] left-0 block size-6 max-w-none -translate-x-1/2 select-none"
              style={{ rotate: reduce ? 0 : swing, transformOrigin: "50% 12%" }}
            />
          </motion.div>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-nav"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="glass glass-dense mx-auto mt-2 grid max-w-6xl gap-1 rounded-3xl p-2 md:hidden"
          >
            {LINKS.map(({ id, label, icon: Icon }) => {
              const done = visited.includes(id);
              return (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => setOpen(false)}
                    aria-current={activeSection === id ? "true" : undefined}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-muted hover:bg-white/10 hover:text-fg aria-[current=true]:bg-claude/12 aria-[current=true]:text-fg"
                  >
                    <span className={`font-pixel text-xs ${done ? "text-claude-light" : "text-stone"}`}>{stationNumber(id)}</span>
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                    {done && <Check className="ml-auto size-4 text-claude-light" aria-label="visitada" />}
                  </a>
                </li>
              );
            })}
            <li className="mt-1 border-t border-white/8 pt-1">
              <a href={profile.github} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-muted hover:bg-white/10 hover:text-fg">
                <GitHubIcon className="size-4" /> GitHub
              </a>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
