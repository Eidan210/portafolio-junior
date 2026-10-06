/**
 * Scroll programático con duración y easing propios. El `scroll-behavior: smooth`
 * nativo es rápido y no se puede sincronizar con Clawd; este sí, y cualquier
 * gesto del visitante (rueda, toque, tecla, clic) cancela la animación en curso.
 */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

/** Destino de scroll de un elemento: respeta su `scroll-margin-top` (el hueco del nav fijo). */
export function scrollTopFor(el: Element): number {
  const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return clamp(el.getBoundingClientRect().top + window.scrollY - margin, 0, maxScroll());
}

/** Salto sin animación: ignora el `scroll-behavior: smooth` global de <html>. */
export function jumpTo(top: number) {
  window.scrollTo({ top, behavior: "instant" });
}

const INTENT_EVENTS = ["wheel", "touchstart", "pointerdown", "keydown"] as const;

/** Avisa una sola vez si el visitante intenta mover la página. Devuelve la función para dejar de escuchar. */
export function watchScrollIntent(onIntent: () => void): () => void {
  const stop = () => INTENT_EVENTS.forEach((e) => window.removeEventListener(e, handle, true));
  function handle() {
    stop();
    onIntent();
  }
  INTENT_EVENTS.forEach((e) => window.addEventListener(e, handle, { capture: true, passive: true }));
  return stop;
}

let cancelCurrent: (() => void) | null = null;

/** Cancela el scroll animado en curso, si lo hay. */
export function cancelScrollAnimation() {
  cancelCurrent?.();
}

/**
 * Lleva la ventana hasta `top` con easing in-out y una duración proporcional a
 * la distancia. Una sola animación a la vez: empezar otra cancela la anterior.
 */
export function animateScroll(top: number) {
  cancelScrollAnimation();
  const from = window.scrollY;
  const to = clamp(top, 0, maxScroll());
  const dist = Math.abs(to - from);
  if (dist < 1) return;
  const duration = clamp(450 + dist * 0.6, 800, 1800);
  const start = performance.now();
  let raf = 0;
  let stopIntent = () => {};
  const cancel = () => {
    cancelAnimationFrame(raf);
    stopIntent();
    if (cancelCurrent === cancel) cancelCurrent = null;
  };
  const frame = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    jumpTo(from + (to - from) * easeInOutSine(t));
    if (t < 1) raf = requestAnimationFrame(frame);
    else cancel();
  };
  stopIntent = watchScrollIntent(cancel);
  raf = requestAnimationFrame(frame);
  cancelCurrent = cancel;
}
