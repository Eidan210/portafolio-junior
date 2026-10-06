/**
 * Buddy = Clawd (set "color" de Icons8, self-hosted en /public/clawd).
 *
 * Cada estado de ánimo es una secuencia corta de fotogramas que se alternan
 * (agitar brazos, mirar a los lados, hablar…). Mientras camina por la ruta,
 * el fotograma lo decide la dirección (`walking`) y no el ánimo.
 *
 * Los acentos del set (puntos, "zz", "?") son negros sobre transparente: el
 * contorno claro de `.clawd-img` los hace legibles sobre el fondo oscuro.
 */
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useReducedMotionConfig } from "motion/react";
import type { BuddyMood } from "@/lib/types";

const FRAMES = [
  "clawd",
  "clawd-looking-left",
  "clawd-looking-right",
  "clawd-looking-up",
  "clawd-looking-down",
  "clawd-winking",
  "clawd-hands-up",
  "clawd-happy",
  "clawd-sparkles",
  "clawd-thinking",
  "clawd-surprised",
  "clawd-exclamation-mark",
  "clawd-sleeping",
  "clawd-coding",
  "clawd-in-love",
  "clawd-sunglasses",
  "clawd-dizzy",
  "clawd-sad",
] as const;

type Frame = (typeof FRAMES)[number];

/** Secuencia de fotogramas y milisegundos por fotograma de cada ánimo. */
const SEQUENCES: Record<BuddyMood, { frames: readonly Frame[]; ms: number }> = {
  idle: {
    frames: ["clawd", "clawd", "clawd", "clawd-looking-left", "clawd", "clawd-looking-right", "clawd", "clawd-winking"],
    ms: 900,
  },
  wave: { frames: ["clawd-hands-up", "clawd"], ms: 320 },
  talk: { frames: ["clawd", "clawd-happy"], ms: 240 },
  think: { frames: ["clawd-thinking", "clawd-thinking", "clawd-looking-up"], ms: 800 },
  happy: { frames: ["clawd-happy", "clawd-sparkles"], ms: 650 },
  surprised: { frames: ["clawd-surprised", "clawd-exclamation-mark"], ms: 520 },
  sleep: { frames: ["clawd-sleeping"], ms: 1000 },
  coding: { frames: ["clawd-coding", "clawd-coding", "clawd-looking-down"], ms: 700 },
  love: { frames: ["clawd-in-love", "clawd-happy"], ms: 700 },
  cool: { frames: ["clawd-sunglasses"], ms: 1000 },
  dizzy: { frames: ["clawd-dizzy"], ms: 1000 },
  sad: { frames: ["clawd-sad"], ms: 1000 },
};

const WALK_FRAME = {
  left: "clawd-looking-left",
  right: "clawd-looking-right",
  up: "clawd-looking-up",
  down: "clawd-looking-down",
} as const satisfies Record<string, Frame>;

/** Color del aura por ánimo: refuerza la expresión sin depender solo de ella. */
export const AURA: Record<BuddyMood, string> = {
  idle: "#d97757",
  talk: "#eba487",
  wave: "#eba487",
  happy: "#788c5d",
  think: "#6a9bcc",
  surprised: "#d4a27f",
  sleep: "#5e5d59",
  coding: "#6a9bcc",
  love: "#d97757",
  cool: "#6a9bcc",
  dizzy: "#d4a27f",
  sad: "#5e5d59",
};

const src = (f: Frame) => `${import.meta.env.BASE_URL}clawd/${f}.png`;

// Precarga una sola vez: el cambio de fotograma no debe parpadear esperando la red.
let preloaded = false;
function preload() {
  if (preloaded || typeof window === "undefined") return;
  preloaded = true;
  for (const f of FRAMES) {
    const img = new Image();
    img.src = src(f);
  }
}

export type Direction = "left" | "right" | "up" | "down";

type Props = {
  mood: BuddyMood;
  className?: string;
  /** Caminando por la ruta: el fotograma mira hacia la dirección de avance y da saltitos. */
  walking?: Direction | null;
  /** Quieto pero mirando hacia algo (el cursor): mismo fotograma direccional, sin saltitos. */
  look?: Direction | null;
  /** Sin aura ni sombra: para miniaturas dentro de botones. */
  bare?: boolean;
};

export function BuddyAvatar({ mood, className = "", walking = null, look = null, bare = false }: Props) {
  const reduce = useReducedMotionConfig();
  const [tick, setTick] = useState(0);
  const seq = SEQUENCES[mood];

  useEffect(preload, []);

  useEffect(() => {
    setTick(0);
    if (reduce || seq.frames.length < 2 || walking || look) return;
    const id = window.setInterval(() => setTick((t) => t + 1), seq.ms);
    return () => window.clearInterval(id);
  }, [seq, reduce, walking, look]);

  const facing = walking ?? look;
  const frame: Frame = facing ? WALK_FRAME[facing] : (seq.frames[tick % seq.frames.length] ?? "clawd");

  return (
    <span className={`relative inline-grid place-items-center ${className}`} aria-hidden="true">
      {!bare && (
        <>
          <span className="clawd-aura absolute inset-[-12%] rounded-full" style={{ "--aura": AURA[mood] } as CSSProperties} />
          <span className="clawd-shadow absolute bottom-[2%] left-1/2 h-[7%] w-[62%] -translate-x-1/2 rounded-[50%] bg-black/45 blur-[3px]" />
        </>
      )}
      <span className={`relative size-full ${walking ? "clawd-walk" : mood === "sleep" ? "clawd-breathe" : "clawd-bob"}`}>
        <img src={src(frame)} alt="" draggable={false} className="clawd-img size-full select-none" />
      </span>
    </span>
  );
}
