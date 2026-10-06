/**
 * Ruta de Clawd en pantallas sin carriles (móvil, tablet o movimiento reducido):
 * una barra fija inferior con las 5 paradas. Clawd camina por ella según el
 * avance de lectura (sección actual + fracción recorrida), recoge la chispa de
 * cada parada y celebra al completar la ruta. Tocar una parada lleva a su
 * sección; tocar a Clawd abre el menú.
 *
 * Mismo patrón que RouteBuddy: rAF escribe `transform`, React solo se entera
 * de los cambios de dirección. Con movimiento reducido salta sin caminar.
 */
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { Check, MessageCircleOff } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { BuddyAvatar } from "@/buddy/BuddyAvatar";
import type { Direction } from "@/buddy/BuddyAvatar";
import { BuddyBubble } from "@/buddy/BuddyBubble";
import { SECTION_IDS, useBuddy } from "@/buddy/BuddyProvider";
import { FxLayer } from "@/buddy/fx";
import { PixelSpark } from "@/buddy/pixel-props";
import { STATION_LABELS, stationNumber } from "@/buddy/stations";
import type { BuddyMood } from "@/lib/types";

const SIZE = 46;
/** Altura del viewport (fracción) que marca "dónde está leyendo" el visitante. */
const ANCHOR = 0.4;
const LAST = SECTION_IDS.length - 1;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function TrackLayer() {
  const { mood, view, muted, toggleMenu, visit, visited, completed, scrollTo, reducedMotion, consumeLaunch } = useBuddy();
  const lineRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const fxRootRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<FxLayer | null>(null);
  const [actor, animate] = useAnimate<HTMLButtonElement>();
  const [walk, setWalk] = useState<Direction | null>(null);
  const [override, setOverride] = useState<BuddyMood | null>(null);
  const [typing, setTyping] = useState(false);
  const overrideTimer = useRef(0);
  const busy = useRef(false);

  const flash = useCallback((m: BuddyMood, ms: number) => {
    setOverride(m);
    window.clearTimeout(overrideTimer.current);
    overrideTimer.current = window.setTimeout(() => setOverride(null), ms);
  }, []);

  // Con el teclado del móvil abierto, la barra estorba: se esconde mientras haya un campo enfocado.
  useEffect(() => {
    const isField = (t: EventTarget | null) => t instanceof HTMLElement && t.matches("input, textarea, select");
    const onIn = (e: FocusEvent) => isField(e.target) && setTyping(true);
    const onOut = (e: FocusEvent) => isField(e.target) && setTyping(false);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  useEffect(() => {
    const line = lineRef.current;
    const walker = walkerRef.current;
    const fill = fillRef.current;
    const fxRoot = fxRootRef.current;
    const el = actor.current;
    if (!line || !walker || !fill || !fxRoot || !el) return;
    const fx = new FxLayer(fxRoot, { dots: 48, ghosts: 0, reduced: reducedMotion });
    fxRef.current = fx;

    let tops: number[] = [];
    let docHeight = 0;
    let width = 0;
    const measure = () => {
      tops = SECTION_IDS.map((id) => {
        const s = document.getElementById(id);
        return s ? s.getBoundingClientRect().top + window.scrollY : 0;
      });
      docHeight = document.documentElement.scrollHeight;
      width = line.clientWidth;
    };

    // Progreso 0..1: sección actual + fracción recorrida de ella. Cada parada está en i / LAST.
    const progress = () => {
      const anchor = window.scrollY + window.innerHeight * ANCHOR;
      const starts = tops.map((t, i) => (i === 0 ? window.innerHeight * ANCHOR : t));
      let i = 0;
      while (i < LAST && anchor >= starts[i + 1]!) i++;
      if (i === LAST) return 1;
      const end = starts[i + 1] ?? docHeight;
      return clamp01((i + clamp01((anchor - starts[i]!) / Math.max(1, end - starts[i]!))) / LAST);
    };

    let cur = 0;
    let target = 0;
    let raf = 0;
    let running = false;
    let last = 0;
    let lastWalk: Direction | null = null;
    const reached = new Set<number>();

    const place = () => {
      walker.style.transform = `translate3d(${cur * width - SIZE / 2}px, 0, 0)`;
      fill.style.transform = `scaleX(${cur})`;
    };

    const check = (silent: boolean) => {
      SECTION_IDS.forEach((id, i) => {
        if (reached.has(i) || cur * LAST < i - 0.02) return;
        reached.add(i);
        if (visit(id) && !silent) {
          fx.burst((i / LAST) * width, -26, { count: 10, spread: 40, size: 5 });
          flash("happy", 1200);
          if (!busy.current && !reducedMotion) {
            busy.current = true;
            void animate(el, { y: [0, -18, 0] }, { duration: 0.45, ease: "easeOut" }).then(() => {
              busy.current = false;
            });
          }
        }
      });
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      const diffPx = (target - cur) * width;
      if (reducedMotion || Math.abs(diffPx) < 0.4) {
        cur = target;
        place();
        check(false);
        if (lastWalk) {
          lastWalk = null;
          setWalk(null);
        }
        running = false;
        last = 0;
        return;
      }
      const stepPx = Math.sign(diffPx) * Math.min(Math.abs(diffPx), Math.max(70, Math.abs(diffPx) * 3) * dt);
      cur += stepPx / Math.max(1, width);
      place();
      check(false);
      const dir: Direction = stepPx >= 0 ? "right" : "left";
      if (dir !== lastWalk) {
        lastWalk = dir;
        setWalk(dir);
      }
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      target = progress();
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    const onResize = () => {
      measure();
      cur = target = progress();
      place();
    };

    measure();
    cur = target = progress();
    place();
    check(true);

    // Entrada: salto en arco desde el Clawd del hero, o aparición con rebote.
    const launch = consumeLaunch();
    if (reducedMotion) el.style.opacity = "1";
    else if (launch) {
      const r = walker.getBoundingClientRect();
      const dx = launch.x + launch.w / 2 - (r.left + SIZE / 2);
      const dy = launch.y + launch.h / 2 - (r.top + SIZE / 2);
      busy.current = true;
      flash("wave", 1200);
      void animate(
        el,
        { x: [dx, dx * 0.5, 0], y: [dy, Math.min(dy, 0) - 120, 0], rotate: [0, -200, -360], scale: [launch.w / SIZE, 1.3, 1], opacity: [1, 1, 1] },
        { duration: 1, ease: [0.3, 0, 0.2, 1] },
      ).then(() => {
        busy.current = false;
      });
    } else {
      void animate(el, { y: [40, 0], scale: [0.4, 1], opacity: [0, 1] }, { type: "spring", stiffness: 260, damping: 14 });
    }

    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", onResize);
      fx.destroy();
      fxRef.current = null;
    };
  }, [actor, animate, consumeLaunch, visit, flash, reducedMotion]);

  // Ruta completada: confeti desde Clawd.
  useEffect(() => {
    if (!completed) return;
    const r = walkerRef.current;
    const lineW = lineRef.current?.clientWidth ?? 0;
    if (r) fxRef.current?.confetti(lineW, -20, 36);
  }, [completed]);

  useEffect(() => () => window.clearTimeout(overrideTimer.current), []);

  const menuOpen = view?.type === "menu";

  return (
    <div className={`pointer-events-none fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-40 transition-transform duration-300 ${typing ? "translate-y-[150%]" : ""}`}>
      <BuddyBubble origin="bottom center" className="absolute right-0 bottom-[calc(100%+0.75rem)] left-0 mx-auto max-h-[min(72dvh,34rem)] max-w-md rounded-b-md" />

      <nav aria-label="Ruta de Buddy" className="glass glass-dense pointer-events-auto relative mx-auto h-[4.75rem] max-w-md rounded-2xl px-8">
        <div ref={lineRef} className="absolute inset-x-8 bottom-4">
          <span className="absolute inset-x-0 -top-px border-t-2 border-dashed border-white/20" aria-hidden="true" />
          <div ref={fillRef} className="absolute inset-x-0 -top-px h-0.5 origin-left bg-claude" style={{ transform: "scaleX(0)" }} aria-hidden="true" />
          <div ref={fxRootRef} className="absolute inset-0 overflow-visible" aria-hidden="true" />

          {SECTION_IDS.map((id, i) => {
            const done = visited.includes(id);
            return (
              <div key={id} className="absolute top-0" style={{ left: `${(i / LAST) * 100}%` }}>
                <AnimatePresence>
                  {!done && (
                    <motion.span
                      key="spark"
                      className="absolute -top-9 left-0 -translate-x-1/2"
                      exit={{ scale: 2, opacity: 0, y: -14 }}
                      transition={{ duration: 0.4 }}
                      aria-hidden="true"
                    >
                      <span className="route-spark block">
                        <PixelSpark className="size-4" />
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => scrollTo(id)}
                  aria-label={`Ir a ${STATION_LABELS[id]} (parada ${i + 1} de ${SECTION_IDS.length}${done ? ", visitada" : ""})`}
                  className="absolute top-0 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center"
                >
                  <span className={`track-stop grid size-7 place-items-center font-pixel text-[0.75rem] leading-none ${done ? "is-done" : ""}`}>
                    {done ? <Check className="size-3" aria-hidden="true" /> : stationNumber(id)}
                  </span>
                </button>
              </div>
            );
          })}

          <div ref={walkerRef} className="absolute bottom-0 left-0 will-change-transform" style={{ width: SIZE, height: SIZE }}>
            <button
              ref={actor}
              type="button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Cerrar menú de Buddy" : "Abrir menú de Buddy"}
              className="pointer-events-auto relative size-full opacity-0"
            >
              <BuddyAvatar mood={override ?? mood} walking={walk} className="size-full" bare />
              {muted && (
                <span className="absolute -top-1 -left-1 grid size-4 place-items-center rounded-full border border-white/15 bg-ink-2 text-subtle" title="Comentarios silenciados">
                  <MessageCircleOff className="size-2.5" aria-hidden="true" />
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export function RouteTrack() {
  const { routeMode, stage, minimized } = useBuddy();
  if (routeMode !== "track" || stage !== "hud" || minimized) return null;
  return <TrackLayer />;
}
