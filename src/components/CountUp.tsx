/**
 * Número de una métrica que sube desde 0 la primera vez que entra en
 * pantalla. Se muestra el valor final hasta que la tarjeta está a punto de
 * entrar (entonces baja a 0, fuera de vista) y cuenta al aparecer: si el
 * observador nunca se dispara (pestaña en segundo plano, capturas, robots),
 * queda el valor real y nunca un 0. Lo que no es un número limpio se muestra
 * tal cual, igual que con movimiento reducido; el lector de pantalla oye
 * siempre el valor final.
 */
import { animate, useInView, useReducedMotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatMetric, parseMetric } from "@/lib/count";

export function CountUp({ value }: { value: string }) {
  const reduce = useReducedMotionConfig();
  const ref = useRef<HTMLSpanElement>(null);
  // Se arma un 25 % antes de entrar (baja a 0 sin que se vea) y cuenta ya dentro.
  const armed = useInView(ref, { once: true, margin: "0px 0px 25% 0px" });
  const visible = useInView(ref, { once: true, margin: "-10% 0px" });
  const [metric] = useState(() => parseMetric(value));
  const [shown, setShown] = useState(value);
  const counted = useRef(false);

  useEffect(() => {
    if (!metric || reduce || counted.current) return;
    if (visible) {
      counted.current = true;
      const controls = animate(0, metric.value, {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setShown(formatMetric(v, metric)),
      });
      return () => controls.stop();
    }
    if (armed) setShown(formatMetric(0, metric));
  }, [metric, reduce, armed, visible]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {reduce || !metric ? value : shown}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
