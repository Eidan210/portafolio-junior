import { useLayoutEffect, useRef } from "react";
import { useReducedMotionConfig } from "motion/react";

/**
 * Texto que se escribe solo. Es puramente visual (`aria-hidden`): el texto
 * completo se anuncia una sola vez en la región viva del HUD, así el lector de
 * pantalla no lee cada fotograma parcial. Las letras las escribe este
 * componente en el DOM, no React: teclear no provoca un render cada 18 ms.
 */
export function Typewriter({ text, speed = 18 }: { text: string; speed?: number }) {
  const reduce = useReducedMotionConfig();
  const typedRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);

  // Layout effect: el estado inicial (vacío, o completo con movimiento reducido) queda escrito antes de pintar.
  useLayoutEffect(() => {
    const typed = typedRef.current;
    const caret = caretRef.current;
    if (!typed || !caret) return;
    const show = (count: number) => {
      typed.textContent = text.slice(0, count);
      // `hidden` no basta: el CSS del cursor fija `display: inline-block`.
      caret.style.display = count >= text.length ? "none" : "";
    };
    if (reduce) return show(text.length);
    let count = 0;
    show(0);
    const id = window.setInterval(() => {
      // Avanza por palabras cortas para que el ritmo se sienta natural.
      count = Math.min(text.length, count + (text[count] === " " ? 2 : 1));
      show(count);
      if (count >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, reduce]);

  // Ambas capas comparten celda de grid: el texto invisible reserva la altura
  // final y la burbuja no "salta" mientras se escribe.
  return (
    <span aria-hidden="true" className="grid">
      <span className="invisible [grid-area:1/1]">{text}</span>
      <span className="[grid-area:1/1]">
        <span ref={typedRef} />
        <span ref={caretRef} className="typing-caret" />
      </span>
    </span>
  );
}
