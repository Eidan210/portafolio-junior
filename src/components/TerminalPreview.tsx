/**
 * Vista previa de un proyecto de consola: reproduce una sesión real del
 * programa (salida capturada al ejecutarlo) como si se tecleara en una
 * terminal. Lo que escribe el usuario aparece letra a letra; la salida, línea
 * a línea, y la terminal "scrollea" desde abajo. Solo corre mientras está en
 * pantalla, se repite tras una pausa y, con movimiento reducido, muestra la
 * sesión completa y quieta.
 */
import { useInView, useReducedMotionConfig } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { TerminalSession } from "@/lib/types";

/** Ritmo de la sesión, en ms: pensar antes de teclear, cada letra, cada línea de salida y la pausa final. */
const PACE = { think: 420, key: 80, enter: 280, line: 70, rest: 4500 } as const;

export function TerminalPreview({ session }: { session: TerminalSession }) {
  const reduce = useReducedMotionConfig();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  // Líneas ya completas y letras tecleadas de la línea en curso.
  const [line, setLine] = useState(0);
  const [typed, setTyped] = useState(0);
  const total = session.lines.length;

  useEffect(() => {
    if (reduce || !inView) return;
    if (line >= total) {
      const t = window.setTimeout(() => {
        setLine(0);
        setTyped(0);
      }, PACE.rest);
      return () => window.clearTimeout(t);
    }
    const input = session.lines[line]?.input ?? "";
    if (typed < input.length) {
      const t = window.setTimeout(() => setTyped((n) => n + 1), typed === 0 ? PACE.think : PACE.key);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      setLine((n) => n + 1);
      setTyped(0);
    }, input ? PACE.enter : PACE.line);
    return () => window.clearTimeout(t);
  }, [reduce, inView, line, typed, total, session.lines]);

  const done = reduce ? session.lines : session.lines.slice(0, line);
  const current = reduce ? undefined : session.lines[line];

  return (
    <div ref={ref} className="flex h-full flex-col bg-[#161514] font-mono text-[0.66rem] leading-[1.45] text-sand sm:text-[0.7rem]" aria-hidden="true">
      {/* Barra de ventana: título a la derecha, el badge de la tarjeta ocupa la esquina izquierda. */}
      <p className="shrink-0 border-b border-white/8 px-3 py-1.5 text-right text-[0.62rem] text-subtle">{session.title}</p>
      <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden px-3 pb-2.5">
        {done.map((l, i) => (
          <p key={i} className="min-h-[1.45em] whitespace-pre-wrap">
            {l.out}
            {l.input && <span className="text-sky-light">{l.input}</span>}
          </p>
        ))}
        {current && (
          <p className="min-h-[1.45em] whitespace-pre-wrap">
            {current.out}
            <span className="text-sky-light">{(current.input ?? "").slice(0, typed)}</span>
            <span className="typing-caret" />
          </p>
        )}
      </div>
    </div>
  );
}
