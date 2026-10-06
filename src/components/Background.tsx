/**
 * Fondo: base Anthropic Dark + orbes de la paleta que derivan (CSS, solo
 * transform) + puntos de rejilla pixel + canvas animado + grano + viñeta.
 * Es `fixed` detrás de todo; el body ya pinta el color base.
 *
 * La opacidad del orbe naranja (0.28) es el techo medido para el contraste de
 * texto en globals.css: no la subas sin volver a medir.
 */
import { useBuddy } from "@/buddy/BuddyProvider";
import { PixelField } from "@/components/PixelField";

const ORBS = [
  { className: "left-[-12%] top-[-14%] size-[58vmax]", color: "#d97757", delay: "0s", opacity: 0.28 },
  { className: "right-[-16%] top-[12%] size-[48vmax]", color: "#6a9bcc", delay: "-9s", opacity: 0.2 },
  { className: "left-[18%] bottom-[-28%] size-[50vmax]", color: "#788c5d", delay: "-16s", opacity: 0.18 },
  { className: "right-[12%] bottom-[2%] size-[30vmax]", color: "#d4a27f", delay: "-22s", opacity: 0.14 },
];

export function Background() {
  const { reducedMotion } = useBuddy();
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {ORBS.map((orb) => (
        <div
          key={orb.color}
          className={`orb ${orb.className}`}
          style={{
            background: `radial-gradient(circle at center, ${orb.color}, transparent 65%)`,
            animationDelay: orb.delay,
            opacity: orb.opacity,
          }}
        />
      ))}
      {/* Rejilla de puntos: la "cuadrícula de pixeles" sobre la que vive Clawd. */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "radial-gradient(rgb(232 230 220 / 0.55) 1px, transparent 1.5px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse at 50% 35%, #000 25%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 35%, #000 25%, transparent 75%)",
        }}
      />
      <PixelField reduced={reducedMotion} />
      <div className="grain" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(20_20_19/0.8))]" />
    </div>
  );
}
