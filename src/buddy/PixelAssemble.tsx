/**
 * Entrada "ensamblado": Clawd se arma pixel a pixel. Lee el PNG del fotograma
 * a 32×32 en un canvas fuera de pantalla (mismo origen, sin taint), genera una
 * partícula por celda opaca con su color real y las hace converger desde
 * posiciones dispersas con un retardo aleatorio. Al terminar avisa con
 * `onDone` y el componente padre muestra la imagen real.
 */
import { useEffect, useRef } from "react";

const GRID = 32;
const FLIGHT_MS = 620;
const MAX_DELAY_MS = 380;

type Particle = { tx: number; ty: number; sx: number; sy: number; color: string; delay: number };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function PixelAssemble({ src, size, onDone }: { src: string; size: number; onDone: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const pad = size * 0.9;
    const box = size + pad * 2;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(box * dpr);
    canvas.height = Math.round(box * dpr);
    canvas.style.width = canvas.style.height = `${box}px`;
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
          const tx = pad + c * cell;
          const ty = pad + r * cell;
          const angle = rand(0, Math.PI * 2);
          const dist = rand(size * 0.55, size * 1.35);
          parts.push({
            tx,
            ty,
            sx: tx + Math.cos(angle) * dist,
            sy: ty + Math.sin(angle) * dist,
            color: `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`,
            delay: rand(0, MAX_DELAY_MS),
          });
        }
      }

      const start = performance.now();
      const frame = (now: number) => {
        ctx.clearRect(0, 0, box, box);
        let done = true;
        for (const p of parts) {
          const t = Math.min(1, Math.max(0, (now - start - p.delay) / FLIGHT_MS));
          if (t < 1) done = false;
          const e = 1 - Math.pow(1 - t, 3);
          const s = cell * (2.4 - 1.4 * e); // llegan grandes y se encogen hasta su celda
          ctx.globalAlpha = Math.min(1, t * 2.5);
          ctx.fillStyle = p.color;
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
  }, [src, size, onDone]);

  return <canvas ref={ref} className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />;
}
