/**
 * Fondo animado en pixel art, a juego con Clawd. Un único canvas fijo pinta:
 *
 *  - brasas: cuadrados de 2–4 px que suben despacio con vaivén y titilan,
 *  - estrellas de 4 puntas (las "sparkles" de Clawd) que crecen y se apagan,
 *  - cometas pixel ocasionales con estela,
 *  - una cuadrícula que se enciende bajo el cursor y se apaga con inercia.
 *
 * Todo en la paleta de Anthropic. El scroll desplaza las brasas con parallax.
 * Coste: ~200 fillRect por frame; se pausa con la pestaña oculta y con
 * movimiento reducido pinta un único frame estático.
 */
import { useEffect, useRef } from "react";

const COLORS = ["#d97757", "#d97757", "#eba487", "#e8e6dc", "#6a9bcc", "#788c5d"] as const;
const CELL = 22;
const DPR_CAP = 1.5;

type Ember = { x: number; y: number; s: number; speed: number; sway: number; phase: number; color: string; alpha: number; depth: number };
type Star = { x: number; y: number; phase: number; period: number; color: string; unit: number };
type Comet = { x: number; y: number; vx: number; vy: number; life: number; color: string };

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)]!;

export function PixelField({ reduced }: { reduced: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let energy = new Float32Array(0);
    const active = new Set<number>();
    let embers: Ember[] = [];
    let stars: Star[] = [];
    let comets: Comet[] = [];
    let nextComet = performance.now() + rand(3000, 6000);
    let raf = 0;
    let last = performance.now();
    let pointer: { x: number; y: number } | null = null;

    const resize = () => {
      const dpr = Math.min(DPR_CAP, window.devicePixelRatio || 1);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;

      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      energy = new Float32Array(cols * rows);
      active.clear();

      const count = Math.min(170, Math.round((w * h) / 11000));
      embers = Array.from({ length: count }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        s: pick([2, 2, 2, 3, 3, 4]),
        speed: rand(6, 22),
        sway: rand(4, 16),
        phase: rand(0, Math.PI * 2),
        color: pick(COLORS),
        alpha: rand(0.18, 0.6),
        depth: rand(0.05, 0.35),
      }));
      stars = Array.from({ length: Math.min(18, Math.round((w * h) / 90000)) }, () => ({
        x: Math.round(rand(20, w - 20)),
        y: Math.round(rand(20, h - 20)),
        phase: rand(0, Math.PI * 2),
        period: rand(2.4, 5.5),
        color: pick(["#e8e6dc", "#eba487", "#d97757"] as const),
        unit: pick([2, 2, 3]),
      }));
    };

    // Estrella de 4 puntas en pixel art: centro + brazos que crecen y menguan.
    const drawStar = (st: Star, t: number) => {
      const k = (Math.sin((t / st.period) * Math.PI * 2 + st.phase) + 1) / 2; // 0..1
      const arm = Math.round(k * 3);
      if (arm === 0) return;
      const u = st.unit;
      ctx.globalAlpha = 0.25 + k * 0.6;
      ctx.fillStyle = st.color;
      ctx.fillRect(st.x - u / 2, st.y - u / 2, u, u);
      for (let i = 1; i <= arm; i++) {
        const a = 1 - (i - 1) / 3;
        ctx.globalAlpha = (0.25 + k * 0.6) * a;
        ctx.fillRect(st.x - u / 2, st.y - u / 2 - i * u, u, u);
        ctx.fillRect(st.x - u / 2, st.y - u / 2 + i * u, u, u);
        ctx.fillRect(st.x - u / 2 - i * u, st.y - u / 2, u, u);
        ctx.fillRect(st.x - u / 2 + i * u, st.y - u / 2, u, u);
      }
    };

    const draw = (now: number, animate: boolean) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = now / 1000;
      const scroll = window.scrollY;
      ctx.clearRect(0, 0, w, h);

      // Cuadrícula reactiva: cada celda guarda energía que decae; solo se recorren las activas.
      if (animate && pointer) {
        const pc = Math.floor(pointer.x / CELL);
        const pr = Math.floor(pointer.y / CELL);
        for (let r = pr - 4; r <= pr + 4; r++) {
          for (let c = pc - 4; c <= pc + 4; c++) {
            if (r < 0 || c < 0 || r >= rows || c >= cols) continue;
            const dx = (c + 0.5) * CELL - pointer.x;
            const dy = (r + 0.5) * CELL - pointer.y;
            const e = 1 - Math.hypot(dx, dy) / (CELL * 4.2);
            if (e <= 0) continue;
            const i = r * cols + c;
            if (e > energy[i]!) energy[i] = e;
            active.add(i);
          }
        }
      }
      if (active.size) {
        ctx.fillStyle = "#d97757";
        const decay = Math.pow(0.12, dt); // ~88 % de pérdida por segundo
        for (const i of active) {
          const e = energy[i]! * decay;
          if (e < 0.02) {
            energy[i] = 0;
            active.delete(i);
            continue;
          }
          energy[i] = e;
          ctx.globalAlpha = e * 0.22;
          const c = i % cols;
          const r = (i - c) / cols;
          ctx.fillRect(c * CELL + 3, r * CELL + 3, CELL - 6, CELL - 6);
        }
      }

      // Brasas con parallax de scroll; envuelven verticalmente.
      for (const e of embers) {
        if (animate) e.y -= e.speed * dt;
        const span = h + 20;
        const y = ((((e.y - scroll * e.depth) % span) + span) % span) - 10;
        const x = e.x + Math.sin(t * 0.6 + e.phase) * e.sway;
        ctx.globalAlpha = e.alpha * (0.65 + 0.35 * Math.sin(t * 1.7 + e.phase));
        ctx.fillStyle = e.color;
        ctx.fillRect(Math.round(x), Math.round(y), e.s, e.s);
      }

      for (const st of stars) drawStar(st, animate ? t : 1.3);

      // Cometa pixel: cabeza de 4 px y estela de cuadrados que se desvanecen.
      if (animate && now > nextComet) {
        const fromLeft = Math.random() < 0.5;
        comets.push({
          x: fromLeft ? rand(-40, w * 0.3) : rand(w * 0.7, w + 40),
          y: rand(-40, h * 0.35),
          vx: (fromLeft ? 1 : -1) * rand(260, 380),
          vy: rand(120, 200),
          life: 0,
          color: pick(["#eba487", "#e8e6dc", "#6a9bcc"] as const),
        });
        nextComet = now + rand(5500, 11000);
      }
      comets = comets.filter((c) => c.x > -80 && c.x < w + 80 && c.y < h + 80);
      for (const c of comets) {
        c.x += c.vx * dt;
        c.y += c.vy * dt;
        c.life += dt;
        ctx.fillStyle = c.color;
        for (let i = 0; i < 12; i++) {
          ctx.globalAlpha = Math.max(0, 0.75 - i * 0.065) * Math.min(1, c.life * 3);
          const size = i < 2 ? 4 : 3;
          ctx.fillRect(Math.round(c.x - c.vx * 0.012 * i), Math.round(c.y - c.vy * 0.012 * i), size, size);
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      draw(now, true);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      last = performance.now();
      if (reduced) draw(last, false);
      else raf = requestAnimationFrame(loop);
    };

    const onResize = () => {
      resize();
      if (reduced) draw(performance.now(), false);
    };
    const onPointer = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      pointer = null;
    };
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else start();
    };
    // Con movimiento reducido el frame estático solo se repinta si cambia el scroll (parallax).
    const onScroll = () => {
      if (reduced) draw(performance.now(), false);
    };

    resize();
    start();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  return <canvas ref={ref} className="absolute inset-0" aria-hidden="true" />;
}
