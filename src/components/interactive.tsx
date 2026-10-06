/**
 * Primitivas de micro-interacción. Todas animan solo `transform`/`opacity` y
 * se desactivan con `prefers-reduced-motion` o con puntero táctil.
 */
import { motion, useMotionValue, useReducedMotionConfig, useSpring, useTransform } from "motion/react";
import type { HTMLMotionProps } from "motion/react";
import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";
import { useFinePointer } from "@/lib/hooks";

const SPRING = { stiffness: 220, damping: 20, mass: 0.6 };

/** Escribe la posición del puntero como --mx/--my para el borde `.glow-border`. */
export function trackGlow(el: HTMLElement, e: ReactPointerEvent | PointerEvent) {
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - r.left}px`);
  el.style.setProperty("--my", `${e.clientY - r.top}px`);
  el.style.setProperty("--glow", "1");
}

type TiltProps = HTMLMotionProps<"div"> & { max?: number; children: ReactNode };

/** Tarjeta con inclinación 3D sutil y borde luminoso que sigue al cursor. */
export function TiltCard({ max = 6, className = "", children, ...rest }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionConfig();
  const fine = useFinePointer();
  const enabled = fine && !reduce;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), SPRING);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), SPRING);

  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    trackGlow(el, e);
    if (!enabled) return;
    const r = el.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };

  const onLeave = () => {
    ref.current?.style.setProperty("--glow", "0");
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={enabled ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className={`glass glow-border ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Atrae su contenido hacia el cursor mientras está encima; vuelve con un muelle al salir. */
export function Magnetic({ strength = 0.3, children }: { strength?: number; children: ReactNode }) {
  const reduce = useReducedMotionConfig();
  const fine = useFinePointer();
  const x = useSpring(0, SPRING);
  const y = useSpring(0, SPRING);

  if (reduce || !fine) return <span className="inline-flex">{children}</span>;

  return (
    <motion.span
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}

/** Aparición al entrar en viewport. Con movimiento reducido solo hace fade. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotionConfig();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/** Panel de vidrio estático con el mismo borde luminoso, sin tilt. */
export function GlowPanel({ className = "", children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`glass glow-border ${className}`}
      onPointerMove={(e) => trackGlow(e.currentTarget, e)}
      onPointerLeave={(e) => e.currentTarget.style.setProperty("--glow", "0")}
    >
      {children}
    </div>
  );
}
