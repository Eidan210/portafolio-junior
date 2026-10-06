/**
 * Efectos efímeros de la ruta (huellas, estela, ráfagas, confeti) con pools de
 * nodos DOM y la Web Animations API: cero re-renders de React y cero nodos
 * nuevos por efecto. Cada pool recicla sus elementos en anillo.
 *
 * Las coordenadas son relativas al contenedor `root` (absoluto o fijo).
 */
const PALETTE = ["#d97757", "#eba487", "#e8e6dc", "#6a9bcc", "#788c5d"] as const;

type Pool<T extends HTMLElement> = { els: T[]; i: number };

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export class FxLayer {
  private readonly dots: Pool<HTMLSpanElement>;
  private readonly ghosts: Pool<HTMLImageElement>;
  private readonly reduced: boolean;

  constructor(root: HTMLElement, opts: { dots?: number; ghosts?: number; reduced?: boolean } = {}) {
    this.reduced = opts.reduced ?? false;
    this.dots = { els: [], i: 0 };
    this.ghosts = { els: [], i: 0 };
    for (let k = 0; k < (opts.dots ?? 72); k++) {
      const el = document.createElement("span");
      el.style.cssText = "position:absolute;left:0;top:0;width:6px;height:6px;opacity:0;pointer-events:none;will-change:transform,opacity";
      root.appendChild(el);
      this.dots.els.push(el);
    }
    for (let k = 0; k < (opts.ghosts ?? 8); k++) {
      const img = document.createElement("img");
      img.alt = "";
      img.draggable = false;
      img.style.cssText = "position:absolute;left:0;top:0;opacity:0;pointer-events:none;image-rendering:pixelated";
      root.appendChild(img);
      this.ghosts.els.push(img);
    }
  }

  private take<T extends HTMLElement>(pool: Pool<T>): T {
    const el = pool.els[pool.i % pool.els.length]!;
    pool.i += 1;
    el.getAnimations().forEach((a) => a.cancel());
    return el;
  }

  /** Huella pixel que se desvanece donde Clawd pisó. */
  footprint(x: number, y: number) {
    if (this.reduced) return;
    const el = this.take(this.dots);
    el.style.width = el.style.height = "6px";
    el.style.background = "#e8e6dc";
    const at = `translate(${x - 3}px, ${y - 3}px)`;
    el.animate(
      [
        { opacity: 0.55, transform: `${at} scale(1)` },
        { opacity: 0, transform: `${at} scale(0.4)` },
      ],
      { duration: 2400, easing: "ease-out", fill: "forwards" },
    );
  }

  /** Ráfaga radial de cuadrados (parada alcanzada, polvo al frenar). */
  burst(x: number, y: number, opts: { count?: number; spread?: number; size?: number; colors?: readonly string[]; upward?: boolean } = {}) {
    if (this.reduced) return;
    const { count = 10, spread = 60, size = 6, colors = PALETTE, upward = false } = opts;
    for (let k = 0; k < count; k++) {
      const el = this.take(this.dots);
      const angle = upward ? rand(-Math.PI * 0.95, -Math.PI * 0.05) : (k / count) * Math.PI * 2 + rand(-0.3, 0.3);
      const dist = rand(spread * 0.5, spread);
      el.style.width = el.style.height = `${size}px`;
      el.style.background = colors[k % colors.length]!;
      const from = `translate(${x - size / 2}px, ${y - size / 2}px)`;
      const to = `translate(${x - size / 2 + Math.cos(angle) * dist}px, ${y - size / 2 + Math.sin(angle) * dist}px)`;
      el.animate(
        [
          { opacity: 1, transform: `${from} scale(1)` },
          { opacity: 0, transform: `${to} scale(0.3)` },
        ],
        { duration: rand(450, 750), easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
      );
    }
  }

  /** Confeti pixel: sube en abanico y cae con gravedad aparente (3 keyframes). */
  confetti(x: number, y: number, count = 40) {
    if (this.reduced) return;
    for (let k = 0; k < count; k++) {
      const el = this.take(this.dots);
      const size = Math.random() < 0.5 ? 6 : 8;
      const vx = rand(-180, 180);
      const up = rand(120, 260);
      const fall = rand(140, 320);
      const spin = rand(-540, 540);
      el.style.width = el.style.height = `${size}px`;
      el.style.background = PALETTE[k % PALETTE.length]!;
      const base = (dx: number, dy: number, r: number) => `translate(${x + dx}px, ${y + dy}px) rotate(${r}deg)`;
      el.animate(
        [
          { opacity: 1, transform: base(0, 0, 0) },
          { opacity: 1, transform: base(vx * 0.55, -up, spin * 0.5), offset: 0.35 },
          { opacity: 0, transform: base(vx, fall - up, spin) },
        ],
        { duration: rand(1100, 1700), easing: "cubic-bezier(0.2, 0.6, 0.4, 1)", fill: "forwards" },
      );
    }
  }

  /** Copia translúcida del fotograma actual: estela cuando Clawd corre o salta. */
  ghost(x: number, y: number, size: number, src: string, rotate: number) {
    if (this.reduced || !src) return;
    const img = this.take(this.ghosts);
    img.src = src;
    img.style.width = img.style.height = `${size}px`;
    img.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
    img.animate([{ opacity: 0.32 }, { opacity: 0 }], { duration: 340, easing: "ease-out", fill: "forwards" });
  }

  destroy() {
    for (const el of [...this.dots.els, ...this.ghosts.els]) el.remove();
  }
}
