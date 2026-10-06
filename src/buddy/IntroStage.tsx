/**
 * Intro de escritorio a pantalla completa. Telón de tinta → Clawd gigante entra
 * con una de las cinco coreografías de `ClawdEntrance` (rotan por visita) →
 * saluda con un globo "¡HOLA!" → el telón cae y Clawd se encoge y vuela en
 * arco, con voltereta, hasta su hueco del hero (`target`), donde el Clawd real
 * toma el relevo.
 *
 * Cualquier tecla, clic o rueda salta directo al vuelo. Mientras dura, el
 * scroll se anula con preventDefault y no con `overflow: hidden`: quitar la
 * barra de scroll movería el hero justo cuando Clawd apunta a él.
 */
import { AnimatePresence, animate, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import { intro } from "@/data/buddy-script";
import { ClawdEntrance, nextEntrance } from "@/buddy/ClawdEntrance";
import { PixelBurst } from "@/buddy/pixel-props";

type Phase = "enter" | "greet" | "fly";

/** Tiempo que Clawd saluda antes de volar. */
const GREET_MS = 1300;
/** Teclas que desplazan la página: se anulan mientras dura la intro. */
const SCROLL_KEYS = new Set([" ", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End"]);

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Lado de Clawd: múltiplo de 16 (el PNG son 16×16 celdas) para que el pixel art quede nítido. */
function stageSize() {
  return clamp(Math.floor(Math.min(window.innerHeight * 0.44, window.innerWidth * 0.3) / 16) * 16, 256, 448);
}

type Props = {
  /** Hueco de Clawd en el hero: destino del vuelo. */
  target: RefObject<HTMLElement | null>;
  /** Empieza el vuelo: el hero puede mostrar su contenido. */
  onReveal: () => void;
  /** Clawd llegó a su hueco: el hero muestra al Clawd real y la intro se desmonta. */
  onDone: () => void;
};

export function IntroStage({ target, onReveal, onDone }: Props) {
  const [kind] = useState(() => nextEntrance("buddy.intro"));
  const [size] = useState(stageSize);
  const [at] = useState(() => {
    // Con paracaídas Clawd aterriza algo más abajo: la cúpula (0.63× su alto) tiene que caber encima.
    const y = Math.max(window.innerHeight * 0.44 - size / 2, kind === "parachute" ? size * 0.63 + 24 : 0);
    return { x: Math.round((window.innerWidth - size) / 2), y: Math.round(y) };
  });
  const [phase, setPhase] = useState<Phase>("enter");
  const fast = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const clawdRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  // Espejo de los callbacks: el vuelo no debe reiniciarse si el padre los recrea.
  const handlers = useRef({ onReveal, onDone });
  handlers.current = { onReveal, onDone };

  const toGreet = useCallback(() => setPhase((p) => (p === "enter" ? "greet" : p)), []);
  const skip = useCallback(() => {
    fast.current = true;
    setPhase("fly");
  }, []);
  // Aterrizaje de la caída: tiembla la pantalla entera.
  const shake = useCallback(() => {
    if (stageRef.current) void animate(stageRef.current, { x: [0, -16, 14, -9, 5, 0], y: [0, 7, -5, 3, 0] }, { duration: 0.45 });
  }, []);

  useEffect(() => {
    if (phase !== "greet") return;
    const t = window.setTimeout(() => setPhase("fly"), GREET_MS);
    return () => window.clearTimeout(t);
  }, [phase]);

  // Saltar con cualquier gesto; el scroll queda anulado hasta que Clawd aterriza.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      skip();
    };
    const onTouchMove = (e: TouchEvent) => e.preventDefault();
    const onKey = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
      skip();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", skip);
    };
  }, [skip]);

  // Vuelo: cae el telón y Clawd viaja en arco hasta el rectángulo de su hueco en el hero.
  useEffect(() => {
    if (phase !== "fly") return;
    const el = clawdRef.current;
    const slot = target.current;
    if (!el || !slot) {
      handlers.current.onDone();
      return;
    }
    handlers.current.onReveal();
    const r = slot.getBoundingClientRect();
    const k = r.width / size;
    const dx = r.left + r.width / 2 - (at.x + size / 2);
    const dy = r.top + r.height / 2 - (at.y + size / 2);
    const duration = fast.current ? 0.6 : 0.95;
    const fade = backdropRef.current ? animate(backdropRef.current, { opacity: 0 }, { duration: duration * 0.75, ease: "easeOut" }) : null;
    const flight = animate(
      el,
      { x: [0, dx * 0.45, dx], y: [0, Math.min(0, dy) - 140, dy], scale: [1, (1 + k) / 2, k], rotate: [0, -200, -360] },
      { duration, ease: [0.3, 0, 0.2, 1] },
    );
    let alive = true;
    void flight.then(() => alive && handlers.current.onDone());
    return () => {
      alive = false;
      fade?.stop();
      flight.stop();
    };
  }, [phase, at, size, target]);

  return createPortal(
    <div ref={stageRef} className="fixed inset-0 z-[70] overflow-hidden select-none">
      <div ref={backdropRef} className="intro-backdrop absolute inset-0" aria-hidden="true" />

      <div ref={clawdRef} className="absolute" style={{ left: at.x, top: at.y, width: size, height: size }} aria-hidden="true">
        <ClawdEntrance kind={kind} screen mood="wave" finish={phase === "fly"} onLanded={toGreet} onImpact={shake} />
        {phase === "greet" && (
          <div className="absolute inset-0" style={{ transform: `scale(${size / 240})` }}>
            <PixelBurst />
          </div>
        )}
      </div>

      <AnimatePresence>
        {phase === "greet" && (
          <motion.div
            key="hola"
            className="absolute origin-bottom-left -translate-y-full"
            // A la derecha de la mano levantada (el brazo llega al borde del PNG), con la cola hacia ella.
            style={{ left: at.x + size + 10, top: at.y + size * 0.24 }}
            initial={{ opacity: 0, scale: 0.3, rotate: -12 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.18 } }}
            transition={{ type: "spring", stiffness: 420, damping: 16 }}
            aria-hidden="true"
          >
            <p className="pixel-corners bg-sand px-6 pt-4 pb-3 font-pixel text-5xl leading-none whitespace-nowrap text-ink xl:text-6xl">
              {[...intro.hello].map((ch, i) => (
                <motion.span key={i} className="inline-block" initial={{ y: 14 }} animate={{ y: [14, -10, 0] }} transition={{ delay: 0.1 + i * 0.07, duration: 0.42 }}>
                  {ch}
                </motion.span>
              ))}
            </p>
            {/* Cola escalonada del globo, apuntando a Clawd. */}
            <span className="absolute -bottom-3 left-5 size-3 bg-sand" />
            <span className="absolute -bottom-6 left-2 size-3 bg-sand" />
          </motion.div>
        )}
        {phase === "greet" && (
          <motion.p
            key="line"
            className="absolute inset-x-0 text-center font-display text-2xl font-semibold text-fg"
            style={{ top: at.y + size + 28 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            aria-hidden="true"
          >
            {intro.line}
          </motion.p>
        )}
      </AnimatePresence>

      {phase !== "fly" && (
        <button type="button" onClick={skip} className="btn btn-ghost absolute right-6 bottom-6 !min-h-10 !px-4 !text-sm">
          {intro.skip}
          <kbd className="font-pixel text-xs text-subtle">Esc</kbd>
        </button>
      )}
    </div>,
    document.body,
  );
}
