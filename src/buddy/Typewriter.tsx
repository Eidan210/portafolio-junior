import { useEffect, useState } from "react";
import { useReducedMotionConfig } from "motion/react";

/**
 * Texto que se escribe solo. Es puramente visual (`aria-hidden`): el texto
 * completo se anuncia una sola vez en la región viva del HUD, así el lector de
 * pantalla no lee cada fotograma parcial.
 */
export function Typewriter({ text, speed = 18 }: { text: string; speed?: number }) {
  const reduce = useReducedMotionConfig();
  const [count, setCount] = useState(reduce ? text.length : 0);

  useEffect(() => {
    if (reduce) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const id = window.setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          window.clearInterval(id);
          return c;
        }
        // Avanza por palabras cortas para que el ritmo se sienta natural.
        return Math.min(text.length, c + (text[c] === " " ? 2 : 1));
      });
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed, reduce]);

  const done = count >= text.length;
  // Ambas capas comparten celda de grid: el texto invisible reserva la altura
  // final y la burbuja no "salta" mientras se escribe.
  return (
    <span aria-hidden="true" className="grid">
      <span className="invisible [grid-area:1/1]">{text}</span>
      <span className="[grid-area:1/1]">
        {text.slice(0, count)}
        {!done && <span className="typing-caret" />}
      </span>
    </span>
  );
}
