/**
 * Clawd hecho de pixeles. Lee el PNG del fotograma a 32×32 en un canvas fuera
 * de pantalla (mismo origen, sin taint) y genera una partícula por celda opaca
 * con su color real. Dos coreografías:
 *
 *  - "scatter": las partículas convergen desde posiciones dispersas, llegan
 *               grandes y se encogen hasta su celda (entrada "assemble").
 *  - "rain":    bloques estilo Tetris que caen en columna con gravedad y un
 *               rebote, fila a fila de los pies a la cabeza (entrada "rain").
 *
 * Al terminar avisa con `onDone` y el padre muestra la imagen real. Con
 * `fullscreen` (intro de escritorio) el lienzo cubre el viewport: en
 * "scatter" llegan desde cualquier punto y en "rain" caen desde fuera de la
 * pantalla.
 */
import { useEffect, useRef } from "react";

const GRID = 32;
/** Duración del vuelo de cada partícula y retardo máximo, por coreografía y escala. */
const TIMING = {
  scatter: { local: [620, 380], screen: [760, 340] },
  rain: { local: [480, 20], screen: [620, 24] },
} as const;
/** En "rain": fracción del vuelo que es caída; el resto es el rebote. */
const FALL = 0.78;

export type AssembleMode = "scatter" | "rain";

type Particle = { tx: number; ty: number; sx: number; sy: number; color: string; delay: number };

type Props = {
  src: string;
  size: number;
  onDone: () => void;
  mode?: AssembleMode;
  /** Lienzo a pantalla completa; `x`/`y` es la esquina superior izquierda de Clawd en el viewport. */
  fullscreen?: { x: number; y: number };
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function PixelAssemble({ src, size, onDone, mode = "scatter", fullscreen }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const screen = fullscreen !== undefined;
  const atX = fullscreen?.x ?? 0;
  const atY = fullscreen?.y ?? 0;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const pad = size * 0.9;
    const w = screen ? window.innerWidth : size + pad * 2;
    const h = screen ? window.innerHeight : size + pad * 2;
    // Origen de la cuadrícula de destino dentro del lienzo.
    const ox = screen ? atX : pad;
    const oy = screen ? atY : pad;
    const [flight, spread] = TIMING[mode][screen ? "screen" : "local"];
    // A pantalla completa basta 1x: el lienzo escala con `pixelated` y los cuadrados siguen nítidos.
    const dpr = screen ? 1 : Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    let raf = 0;
    let cancelled = false;
    const img = new Image();
    img.onerror = () => !cancelled && onDone();
    img.onload = () => {
      if (cancelled) return;
      const off = document.createElement("canvas");
      off.width = off.height = GRID;
      const octx = off.getContext("2d");
      if (!octx) return onDone();
      octx.imageSmoothingEnabled = false;
      octx.drawImage(img, 0, 0, GRID, GRID);
      const data = octx.getImageData(0, 0, GRID, GRID).data;
      const cell = size / GRID;
      const parts: Particle[] = [];
      for (let r = 0; r < GRID; r++) {
        for (let c = 0; c < GRID; c++) {
          const i = (r * GRID + c) * 4;
          if ((data[i + 3] ?? 0) < 128) continue;
          const tx = ox + c * cell;
          const ty = oy + r * cell;
          let sx = tx;
          let sy: number;
          let delay: number;
          if (mode === "rain") {
            // Cae en su propia columna desde arriba; las filas de abajo salen primero.
            sy = screen ? -rand(0.02, 0.5) * h : ty - rand(size * 0.7, size * 1.3);
            delay = (GRID - 1 - r) * spread + rand(0, spread * 1.5);
          } else if (screen) {
            sx = rand(-0.05, 1.05) * w;
            sy = rand(-0.05, 1.05) * h;
            delay = rand(0, spread);
          } else {
            const angle = rand(0, Math.PI * 2);
            const dist = rand(size * 0.55, size * 1.35);
            sx = tx + Math.cos(angle) * dist;
            sy = ty + Math.sin(angle) * dist;
            delay = rand(0, spread);
          }
          parts.push({ tx, ty, sx, sy, color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`, delay });
        }
      }

      const start = performance.now();
      const frame = (now: number) => {
        ctx.clearRect(0, 0, w, h);
        let done = true;
        for (const p of parts) {
          const t = Math.min(1, Math.max(0, (now - start - p.delay) / flight));
          if (t < 1) done = false;
          ctx.fillStyle = p.color;
          if (mode === "rain") {
            // Gravedad (cuadrática) hasta la celda y un rebote corto al encajar.
            const fall = Math.min(1, t / FALL);
            const bounce = t > FALL ? Math.sin((Math.PI * (t - FALL)) / (1 - FALL)) * cell * 1.4 : 0;
            ctx.globalAlpha = Math.min(1, t * 4);
            ctx.fillRect(Math.round(p.tx), Math.round(p.sy + (p.ty - p.sy) * fall * fall - bounce), Math.ceil(cell), Math.ceil(cell));
            continue;
          }
          const e = 1 - Math.pow(1 - t, 3);
          const s = cell * (2.4 - 1.4 * e); // llegan grandes y se encogen hasta su celda
          ctx.globalAlpha = Math.min(1, t * 2.5);
          ctx.fillRect(
            Math.round(p.sx + (p.tx - p.sx) * e - (s - cell) / 2),
            Math.round(p.sy + (p.ty - p.sy) * e - (s - cell) / 2),
            Math.ceil(s),
            Math.ceil(s),
          );
        }
        if (done) return onDone();
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };
    img.src = src;
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [src, size, onDone, mode, screen, atX, atY]);

  return (
    <canvas
      ref={ref}
      className={
        screen
          ? "pointer-events-none fixed inset-0 [image-rendering:pixelated]"
          : "pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      }
      aria-hidden="true"
    />
  );
}
