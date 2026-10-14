/**
 * Guiño oculto: con el código Konami (↑↑↓↓←→←→BA), Buddy se pone las gafas de
 * sol y cae confeti pixel por toda la pantalla. Con movimiento reducido solo
 * habla Buddy.
 */
import { motion, useReducedMotionConfig } from "motion/react";
import { useState } from "react";
import { konamiLine } from "@/data/buddy-script";
import { useBuddyActions } from "@/buddy/BuddyProvider";
import { useKonami } from "@/lib/konami";

const COLORS = ["#d97757", "#eba487", "#e8e6dc", "#6a9bcc", "#788c5d", "#faf9f5"] as const;
const PIECES = 56;
const LIFE_MS = 2800;

type Piece = { x: number; delay: number; duration: number; drift: number; spin: number; size: number; color: string };

function makePieces(): Piece[] {
  return Array.from({ length: PIECES }, (_, i) => ({
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1.6 + Math.random() * 0.9,
    drift: (Math.random() - 0.5) * 120,
    spin: (Math.random() - 0.5) * 720,
    size: 6 + Math.round(Math.random() * 6),
    color: COLORS[i % COLORS.length]!,
  }));
}

export function KonamiEgg() {
  const { say } = useBuddyActions();
  const reduce = useReducedMotionConfig();
  // Cada activación es una tanda nueva (key distinta) que se retira sola.
  const [burst, setBurst] = useState<{ id: number; pieces: Piece[] } | null>(null);

  useKonami(() => {
    say({ type: "text", text: konamiLine, mood: "cool", auto: true });
    if (reduce) return;
    const id = Date.now();
    setBurst({ id, pieces: makePieces() });
    window.setTimeout(() => setBurst((b) => (b?.id === id ? null : b)), LIFE_MS + 600);
  });

  if (!burst) return null;
  return (
    <div key={burst.id} className="pointer-events-none fixed inset-0 z-[60] overflow-hidden" aria-hidden="true">
      {burst.pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-0 block"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, background: p.color }}
          initial={{ y: -24, x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", x: p.drift, rotate: p.spin, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: [0.25, 0.1, 0.45, 1] }}
        />
      ))}
    </div>
  );
}
