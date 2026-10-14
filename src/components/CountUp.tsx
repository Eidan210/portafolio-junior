/**
 * Número de una métrica que sube desde 0 la primera vez que entra en
 * pantalla. Se muestra el valor final hasta que la tarjeta está a punto de
 * entrar (entonces baja a 0, fuera de vista) y cuenta al aparecer: si el
 * observador nunca se dispara (pestaña en segundo plano, capturas, robots),
 * queda el valor real y nunca un 0. Lo que no es un número limpio se muestra
 * tal cual, igual que con movimiento reducido; el lector de pantalla oye
 * siempre el valor final.
 *
 * El texto visible lo escribe este componente en el DOM, no React: contar no
 * provoca un render por frame (con varias métricas a la vez eran decenas de
 * commits por segundo mientras se hacía scroll).
 */
import { animate, useInView, useReducedMotionConfig } from "motion/react";
import { useLayoutEffect, useRef, useState } from "react";
import { formatMetric, parseMetric } from "@/lib/count";

export function CountUp({ value }: { value: string }) {
  const reduce = useReducedMotionConfig();
  const ref = useRef<HTMLSpanElement>(null);
  // Se arma un 25 % antes de entrar (baja a 0 sin que se vea) y cuenta ya dentro.
  const armed = useInView(ref, { once: true, margin: "0px 0px 25% 0px" });
  const visible = useInView(ref, { once: true, margin: "-10% 0px" });
  const [metric] = useState(() => parseMetric(value));
  const counted = useRef(false);

  // Layout effect: el texto queda escrito antes de pintar, sin parpadeo de un span vacío.
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const show = (text: string) => {
      el.textContent = text;
    };
    if (!metric || reduce || counted.current) return show(value);
    if (visible) {
      counted.current = true;
      const controls = animate(0, metric.value, {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => show(formatMetric(v, metric)),
        onComplete: () => show(value),
      });
      // Cortada a medias (cambio de preferencia de movimiento, desmontaje): queda el valor real, nunca uno intermedio.
      return () => {
        controls.stop();
        show(value);
      };
    }
    show(armed ? formatMetric(0, metric) : value);
  }, [metric, reduce, armed, visible, value]);

  return (
    <>
      <span ref={ref} aria-hidden="true" />
      <span className="sr-only">{value}</span>
    </>
  );
}
