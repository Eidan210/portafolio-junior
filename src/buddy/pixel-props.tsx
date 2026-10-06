/**
 * Props en pixel art: la chispa coleccionable de cada parada, la bandera de
 * meta y el paracaídas de la entrada (SVG con `crispEdges`, nítidos a cualquier
 * tamaño), y la ráfaga con la que Clawd aparece en el hero y en la intro.
 */
import { motion } from "motion/react";

const BURST_COLORS = ["#d97757", "#eba487", "#e8e6dc", "#6a9bcc", "#788c5d"] as const;

/** Ráfaga de cuadrados pixel + marco que gira y se expande. Pensada para un Clawd de ~240 px: escalar el contenedor para otros tamaños. */
export function PixelBurst() {
  const rays = 14;
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
      <motion.span
        className="absolute size-40 border-2 border-claude/70"
        style={{ clipPath: "var(--pixel-corners)" }}
        initial={{ scale: 0.3, opacity: 0.9, rotate: 0 }}
        animate={{ scale: 2, opacity: 0, rotate: 45 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {Array.from({ length: rays }, (_, i) => {
        const angle = (i / rays) * Math.PI * 2;
        const dist = i % 2 ? 150 : 115;
        return (
          <motion.span
            key={i}
            className="absolute size-2.5"
            style={{ background: BURST_COLORS[i % BURST_COLORS.length] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1.2 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </div>
  );
}

/** Chispa de 4 puntas (eco de las "sparkles" de Clawd): el coleccionable de cada parada. */
export function PixelSpark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 9 9" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="4" y="0" width="1" height="9" fill="#eba487" />
      <rect x="0" y="4" width="9" height="1" fill="#eba487" />
      <rect x="3" y="3" width="3" height="3" fill="#d97757" />
      <rect x="4" y="4" width="1" height="1" fill="#faf9f5" />
    </svg>
  );
}

/** Filas de la cúpula del paracaídas: [primera, última] columna en una rejilla de 26. */
const CANOPY: ReadonlyArray<readonly [number, number]> = [
  [9, 16],
  [6, 19],
  [4, 21],
  [3, 22],
  [2, 23],
  [1, 24],
  [1, 24],
  [0, 25],
];

/**
 * Paracaídas de gajos naranja/arena (entrada "parachute"). El viewBox es 26×15
 * y las cuerdas acaban en (3, 15) y (23, 15): con el SVG a 1.3× el ancho de
 * Clawd y centrado, caen justo en sus manos levantadas. Cuerdas cortas: la
 * cúpula sube solo 0.63× el alto de Clawd y cabe en pantalla.
 */
export function PixelParachute({ className = "" }: { className?: string }) {
  const cells = [];
  for (let y = 0; y < CANOPY.length; y++) {
    const [from, to] = CANOPY[y]!;
    for (let x = from; x <= to; x++) {
      if (y === CANOPY.length - 1 && Math.floor(x / 3) % 2) continue; // borde festoneado
      const orange = Math.floor(x / 4) % 2 === 0;
      const lit = y < 2; // brillo en la parte alta de la cúpula
      cells.push(<rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={orange ? (lit ? "#eba487" : "#d97757") : lit ? "#faf9f5" : "#e8e6dc"} />);
    }
  }
  return (
    <svg viewBox="0 0 26 15" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <g stroke="#e8e6dc" strokeOpacity="0.75" strokeWidth="0.35">
        <line x1="1.5" y1="7.5" x2="3" y2="15" />
        <line x1="8.5" y1="7.5" x2="3.4" y2="15" />
        <line x1="17.5" y1="7.5" x2="22.6" y2="15" />
        <line x1="24.5" y1="7.5" x2="23" y2="15" />
      </g>
      {cells}
    </svg>
  );
}

/** Bandera a cuadros sobre un mástil: la meta al final de la ruta. */
export function PixelFlag({ className = "h-12 w-9", waving = false }: { className?: string; waving?: boolean }) {
  const cells = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      cells.push(<rect key={`${r}-${c}`} x={3 + c * 2.5} y={1 + r * 2.5} width="2.5" height="2.5" fill={(r + c) % 2 ? "#d97757" : "#faf9f5"} />);
    }
  }
  return (
    <svg viewBox="0 0 14 20" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="1.5" y="0.5" width="1.5" height="19.5" fill="#b0aea5" />
      <g className={waving ? "flag-wave flag-wave-fast" : "flag-wave"}>{cells}</g>
    </svg>
  );
}
