/**
 * Clawd recorriendo la página por los carriles laterales (escritorio ≥ 1280 px).
 *
 * Geometría (`route-geometry`): un tramo por sección alternando carril, con
 * onda, zigzag o saltos, y cruces en arco por el hueco entre secciones.
 *
 * Movimiento: el scroll fija un objetivo (el punto de la ruta a la altura del
 * 72 % del viewport) y Clawd avanza hacia él *a lo largo del camino*: corre
 * lejos, camina cerca, da una voltereta en cada cruce y nunca se queda parado
 * en mitad de uno (al soltar el scroll se recoloca en el extremo más cercano).
 * El bucle rAF escribe `transform` directamente; React solo se entera cuando
 * cambia la dirección, el lado de la burbuja o el ánimo.
 *
 * Guiado (tour y botones de Buddy): se invierte la relación. Clawd camina a su
 * ritmo hasta el destino y la cámara (el scroll) le sigue con un muelle, así la
 * página baja suave y al paso de Clawd; los cruces los salta de una voltereta.
 *
 * Diversión: huellas al caminar, estela al correr, una chispa coleccionable por
 * parada (con ráfaga y salto al recogerla), polvo al frenar, mareo tras un
 * viaje largo, travesuras en reposo, mira hacia el cursor y bandera de meta
 * con confeti al final.
 */
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { MessageCircleOff } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { BuddyAvatar } from "@/buddy/BuddyAvatar";
import type { Direction } from "@/buddy/BuddyAvatar";
import { BuddyBubble } from "@/buddy/BuddyBubble";
import { SECTION_IDS, useBuddy } from "@/buddy/BuddyProvider";
import { FxLayer } from "@/buddy/fx";
import { PixelFlag, PixelSpark } from "@/buddy/pixel-props";
import { anchorYAt, buildRoute, effortAt, lengthAtEffort, lengthAtY, sampleAt } from "@/buddy/route-geometry";
import type { Route, RouteSample, SectionBox, Side } from "@/buddy/route-geometry";
import { STATION_LABELS, stationNumber } from "@/buddy/stations";
import { animateScroll, cancelScrollAnimation, easeInOutSine, jumpTo, watchScrollIntent } from "@/lib/scroll";
import type { BuddyMood } from "@/lib/types";

/** Altura del viewport (fracción) donde Clawd "quiere" estar. */
const ANCHOR = 0.72;
/** Recorrido de un solo viaje a partir del cual llega mareado. */
const DIZZY_AFTER = 2600;
/** Últimos px de scroll en los que el ancla se estira para alcanzar la meta (ver `anchorPy`). */
const BOTTOM_RAMP = 400;
/** Rigidez (rad/s) del muelle con el que la cámara del guiado sigue a Clawd: ~0.12 s de retardo. */
const CAMERA_STIFFNESS = 16;
/** Polvo al frenar tras un viaje largo. */
const DUST = { count: 8, spread: 36, size: 5, colors: ["#e8e6dc", "#b0aea5"], upward: true } as const;

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

type Geo = { route: Route; width: number; height: number; size: number; mainTop: number; maxScroll: number };

function RouteLayer() {
  const { mood, view, muted, toggleMenu, visit, visited, consumeLaunch, registerGuide } = useBuddy();
  const layerRef = useRef<HTMLDivElement>(null);
  const walkerRef = useRef<HTMLDivElement>(null);
  const rotorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const fxRootRef = useRef<HTMLDivElement>(null);
  const [actor, animate] = useAnimate<HTMLButtonElement>();
  const [geo, setGeo] = useState<Geo | null>(null);
  const [walk, setWalk] = useState<Direction | null>(null);
  const [look, setLook] = useState<Direction | null>(null);
  const [side, setSide] = useState<Side>("right");
  const [override, setOverride] = useState<BuddyMood | null>(null);
  const [finished, setFinished] = useState(false);

  // Espejos para el bucle (no re-suscribirlo en cada render).
  const viewRef = useRef(view);
  viewRef.current = view;
  const busy = useRef(false); // salto de entrada / celebración / travesura en curso
  const entered = useRef(false);
  const endDone = useRef(false);
  const overrideTimer = useRef(0);

  const flash = useCallback((m: BuddyMood, ms: number) => {
    setOverride(m);
    window.clearTimeout(overrideTimer.current);
    overrideTimer.current = window.setTimeout(() => setOverride(null), ms);
  }, []);

  // Geometría: se reconstruye si cambia el tamaño de <main> (imágenes, fuentes, filtros, viewport).
  useLayoutEffect(() => {
    const main = layerRef.current?.parentElement;
    if (!main) return;
    let frame = 0;
    const build = () => {
      const mainRect = main.getBoundingClientRect();
      const boxes: SectionBox[] = [];
      let contentLeft = Infinity;
      let contentRight = -Infinity;
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        boxes.push({ id, top: r.top - mainRect.top, bottom: r.bottom - mainRect.top });
        contentLeft = Math.min(contentLeft, r.left - mainRect.left);
        contentRight = Math.max(contentRight, r.right - mainRect.left);
      }
      const laneWidth = contentLeft;
      // Clawd y la amplitud del camino escalan con el carril: más ancho, más grande y más juguetón.
      const size = clamp(laneWidth * 0.74, 112, 168);
      const amp = clamp((laneWidth - size) / 2 - 4, 6, 56);
      const route = buildRoute(boxes, { left: contentLeft / 2, right: contentRight + (mainRect.width - contentRight) / 2, amp }, window.innerHeight * ANCHOR);
      const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      setGeo(route ? { route, width: mainRect.width, height: mainRect.height, size, mainTop: mainRect.top + window.scrollY, maxScroll } : null);
    };
    build();
    const rebuild = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(build);
    };
    const ro = new ResizeObserver(rebuild);
    ro.observe(main);
    window.addEventListener("resize", rebuild);
    void document.fonts?.ready.then(rebuild);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", rebuild);
    };
  }, []);

  // Bucle de caminata + efectos.
  useEffect(() => {
    const walker = walkerRef.current;
    const rotor = rotorRef.current;
    const fxRoot = fxRootRef.current;
    const el = actor.current;
    if (!geo || !walker || !rotor || !fxRoot || !el) return;
    const { route, size, mainTop, maxScroll } = geo;
    const fx = new FxLayer(fxRoot);
    const reached = new Set<number>();

    // Altura de ruta que corresponde a un scroll. Con viewports altos el ancla del final de la
    // página se queda por debajo de la meta (en 1864×983 faltaban 22 px: ni bandera ni confeti),
    // así que en los últimos BOTTOM_RAMP px de scroll se estira hasta alcanzarla.
    const vhAnchor = window.innerHeight * ANCHOR;
    const shortfall = Math.max(0, route.ymax[route.ymax.length - 1]! - (maxScroll - mainTop + vhAnchor));
    const anchorPy = (scroll: number) =>
      scroll - mainTop + vhAnchor + shortfall * clamp((scroll - (maxScroll - BOTTOM_RAMP)) / BOTTOM_RAMP, 0, 1);
    const targetLen = () => lengthAtY(route, anchorPy(window.scrollY));
    let cur = targetLen();
    let target = cur;
    let p = sampleAt(route, cur);
    let raf = 0;
    let running = false;
    let guiding = false;
    let last = 0;
    let trip = 0;
    let foot = 0;
    let footSide = 1;
    let ghostClock = 0;
    let lastWalk: Direction | null = null;
    let lastSide: Side | null = null;

    const hop = (scale = 1) => {
      if (busy.current) return;
      busy.current = true;
      void animate(el, { y: [0, -size * 0.42 * scale, 0], rotate: [0, -8, 0] }, { duration: 0.55, ease: "easeOut" }).then(() => {
        busy.current = false;
      });
    };

    const place = () => {
      p = sampleAt(route, cur);
      walker.style.transform = `translate3d(${p.x - size / 2}px, ${p.y - size}px, 0)`;
      rotor.style.transform = p.flip ? `rotate(${p.flip}deg)` : "";
      const left = `${1 - cur / route.total}`;
      if (trailRef.current) trailRef.current.style.strokeDashoffset = left;
      if (glowRef.current) glowRef.current.style.strokeDashoffset = left;
      const sd: Side = p.x > geo.width / 2 ? "right" : "left";
      if (sd !== lastSide) {
        lastSide = sd;
        setSide(sd);
      }
    };

    const checkStations = (silent: boolean) => {
      route.stations.forEach((st, i) => {
        if (reached.has(i) || cur + 10 < st.len) return;
        reached.add(i);
        if (visit(st.id) && !silent) {
          fx.burst(st.x, st.y - size * 0.6, { count: 14, spread: 80 });
          flash("happy", 1400);
          hop();
        }
      });
      if (!silent && !endDone.current && cur >= route.total - 6) {
        endDone.current = true;
        setFinished(true);
        fx.confetti(route.end.x, route.end.y - size * 0.5, 56);
        flash("wave", 1800);
        hop(1.3);
      }
    };

    /** Tras un paso de `step` px: fotograma según la dirección, huellas al caminar y estela al correr o cruzar. */
    const stride = (prev: RouteSample, step: number, dt: number) => {
      const dx = p.x - prev.x;
      const dy = p.y - prev.y;
      const dir: Direction = p.cross || Math.abs(dx) > Math.abs(dy) ? (dx >= 0 ? "right" : "left") : dy >= 0 ? "down" : "up";
      if (dir !== lastWalk) {
        lastWalk = dir;
        setWalk(dir);
      }
      if (!p.cross) {
        foot += Math.abs(step);
        if (foot > 30) {
          foot = 0;
          footSide = -footSide;
          fx.footprint(p.x + footSide * 10, p.y - 2);
        }
      }
      ghostClock += dt;
      if ((p.cross || Math.abs(step) / dt > 650) && ghostClock > 0.06) {
        ghostClock = 0;
        fx.ghost(p.x - size / 2, p.y - size, size, el.querySelector("img")?.src ?? "", p.flip);
      }
    };

    const halt = () => {
      if (!lastWalk) return;
      lastWalk = null;
      setWalk(null);
    };

    const tick = (now: number) => {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60;
      last = now;
      const diff = target - cur;
      if (Math.abs(diff) < 0.6) {
        cur = target;
        place();
        checkStations(false);
        halt();
        if (trip > 900) fx.burst(p.x, p.y - 4, DUST);
        if (trip > DIZZY_AFTER) flash("dizzy", 1500);
        trip = 0;
        running = false;
        last = 0;
        return;
      }
      // Aproximación exponencial con suelo: lejos corre, cerca camina y frena suave.
      const step = Math.sign(diff) * Math.min(Math.abs(diff), Math.max(140, Math.abs(diff) * 2.6) * dt);
      const prev = p;
      cur += step;
      trip += Math.abs(step);
      place();
      checkStations(false);
      stride(prev, step, dt);
      raf = requestAnimationFrame(tick);
    };

    const kick = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };

    // Guiado: Clawd recorre la ruta hasta el destino con easing y la cámara busca el scroll
    // que le deja en el ancla (inversa de `targetLen`). La cámara le sigue a él, no al revés.
    let guideRaf = 0;
    let stopIntent = () => {};
    const stopGuide = () => {
      if (!guiding) return;
      guiding = false;
      cancelAnimationFrame(guideRaf);
      stopIntent();
      halt();
    };

    const guide = (top: number) => {
      stopGuide();
      cancelScrollAnimation();
      cancelAnimationFrame(raf);
      running = false;
      last = 0;
      trip = 0;
      const camera = (l: number) => anchorYAt(route, l) + mainTop - vhAnchor;
      const from = cur;
      const to = lengthAtY(route, anchorPy(top));
      if (Math.abs(to - from) < 2) {
        animateScroll(top);
        return;
      }
      // El tiempo se reparte por esfuerzo (los cruces pesan poco): ritmo de paseo en los carriles
      // y voltereta rápida al cruzar, sin que la cámara se quede parada esperándole.
      const w0 = effortAt(route, from);
      const w1 = effortAt(route, to);
      // Desfases de cámara en origen y destino (Clawd recolocado tras un cruce, redondeo de la
      // malla): se reparten a lo largo del viaje para arrancar y terminar exactamente donde toca.
      const off0 = window.scrollY - camera(from);
      const off1 = top - camera(to);
      const duration = clamp(600 + Math.abs(w1 - w0) * 0.75, 1100, 2600);
      const start = performance.now();
      let prevNow = start;
      let walking = true;
      let camY = window.scrollY;
      let camV = 0;
      guiding = true;
      const frame = (now: number) => {
        const dt = clamp((now - prevNow) / 1000, 1 / 240, 0.1);
        prevNow = now;
        const t = Math.min(1, (now - start) / duration);
        const e = easeInOutSine(t);
        if (walking) {
          const prev = p;
          const step = lengthAtEffort(route, w0 + (w1 - w0) * e) - cur;
          cur += step;
          place();
          checkStations(false);
          stride(prev, step, dt);
          if (t >= 1) {
            walking = false;
            halt();
            fx.burst(p.x, p.y - 4, DUST);
          }
        }
        // La cámara va tras Clawd con un muelle críticamente amortiguado (solución exacta por
        // frame): sin él frenaría en seco al empezar cada cruce, donde Clawd avanza en horizontal.
        const goal = camera(cur) + off0 * (1 - e) + off1 * e;
        const y = camY - goal;
        const b = camV + CAMERA_STIFFNESS * y;
        const decay = Math.exp(-CAMERA_STIFFNESS * dt);
        camY = goal + (y + b * dt) * decay;
        camV = (camV - CAMERA_STIFFNESS * b * dt) * decay;
        jumpTo(camY);
        if (walking || Math.abs(camY - top) > 0.5 || Math.abs(camV) > 5) {
          guideRaf = requestAnimationFrame(frame);
          return;
        }
        jumpTo(top);
        stopGuide();
        target = cur;
      };
      // Si el visitante toma el control (rueda, toque, tecla, clic), Clawd vuelve a seguir su scroll.
      stopIntent = watchScrollIntent(() => {
        stopGuide();
        target = targetLen();
        kick();
      });
      guideRaf = requestAnimationFrame(frame);
    };
    registerGuide(guide);

    let settle = 0;
    const onScroll = () => {
      if (guiding) return; // el scroll lo está moviendo el propio guiado
      target = targetLen();
      kick();
      // Al soltar el scroll, nunca quedarse en mitad de un cruce: al extremo más cercano.
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        for (const [a, b] of route.crossings) {
          if (target > a + 2 && target < b - 2) {
            target = target - a < b - target ? a : b;
            kick();
            break;
          }
        }
      }, 220);
    };

    // Al volver a la pestaña, Clawd ya está donde toca (no caminar lo que no se vio).
    const onVisibility = () => {
      if (document.hidden) {
        stopGuide();
        return;
      }
      cur = target = targetLen();
      place();
    };

    // Mira hacia el cursor cuando está quieto y el puntero pasa cerca.
    let pointer: { x: number; y: number } | null = null;
    let lookFrame = 0;
    let lastLook: Direction | null = null;
    const updateLook = () => {
      lookFrame = 0;
      let dirLook: Direction | null = null;
      if (pointer && !running && !guiding) {
        const r = walker.getBoundingClientRect();
        const dx = pointer.x - (r.left + size / 2);
        const dy = pointer.y - (r.top + size / 2);
        const dist = Math.hypot(dx, dy);
        if (dist < 300 && dist > size * 0.35) dirLook = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
      }
      if (dirLook !== lastLook) {
        lastLook = dirLook;
        setLook(dirLook);
      }
    };
    const onPointer = (e: PointerEvent) => {
      pointer = { x: e.clientX, y: e.clientY };
      if (!lookFrame) lookFrame = requestAnimationFrame(updateLook);
    };

    // Travesuras en reposo cada 9–15 s: saltito, giro, meneo o estiramiento sorprendido.
    let nextAntic = performance.now() + rand(7000, 11000);
    const antics = window.setInterval(() => {
      if (running || guiding || busy.current || viewRef.current || document.hidden || performance.now() < nextAntic) return;
      nextAntic = performance.now() + rand(9000, 15000);
      busy.current = true;
      const done = () => {
        busy.current = false;
      };
      const kind = Math.floor(Math.random() * 4);
      if (kind === 0) void animate(el, { y: [0, -size * 0.35, 0, -size * 0.14, 0] }, { duration: 0.9 }).then(done);
      else if (kind === 1) void animate(el, { rotate: [0, 360] }, { duration: 0.7, ease: "easeInOut" }).then(done);
      else if (kind === 2) void animate(el, { rotate: [0, -10, 10, -6, 6, 0] }, { duration: 0.7 }).then(done);
      else {
        flash("surprised", 900);
        void animate(el, { scaleY: [1, 0.8, 1.12, 1], scaleX: [1, 1.16, 0.92, 1] }, { duration: 0.6 }).then(done);
      }
    }, 1000);

    place();
    checkStations(true);

    // Entrada (solo la primera vez): salto en arco desde el hero con voltereta, o caída con rebote.
    if (!entered.current) {
      entered.current = true;
      busy.current = true;
      const launch = consumeLaunch();
      if (launch) {
        const wr = walker.getBoundingClientRect();
        const dx = launch.x + launch.w / 2 - (wr.left + size / 2);
        const dy = launch.y + launch.h / 2 - (wr.top + size / 2);
        flash("wave", 1300);
        void animate(
          el,
          { x: [dx, dx * 0.45, 0], y: [dy, Math.min(dy, 0) - 180, 0], rotate: [0, -200, -360], scale: [launch.w / size, 1.15, 1], opacity: [1, 1, 1] },
          { duration: 1.1, ease: [0.3, 0, 0.2, 1] },
        ).then(() => {
          busy.current = false;
          fx.burst(p.x, p.y - 6, { count: 10, spread: 46, upward: true });
        });
      } else {
        void animate(el, { y: [-320, 0], scale: [0.5, 1], opacity: [0, 1] }, { type: "spring", stiffness: 170, damping: 12 }).then(() => {
          busy.current = false;
        });
      }
    } else {
      el.style.opacity = "1";
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      registerGuide(null);
      stopGuide();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(lookFrame);
      window.clearTimeout(settle);
      window.clearInterval(antics);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
      fx.destroy();
    };
  }, [geo, actor, animate, consumeLaunch, visit, flash, registerGuide]);

  useEffect(() => () => window.clearTimeout(overrideTimer.current), []);

  const onActorClick = () => {
    toggleMenu();
    const el = actor.current;
    if (el && !busy.current) void animate(el, { scaleY: [1, 0.78, 1.1, 1], scaleX: [1, 1.18, 0.94, 1] }, { duration: 0.45 });
  };

  const menuOpen = view?.type === "menu";
  const shownMood = override ?? mood;
  const size = geo?.size ?? 136;

  return (
    <div ref={layerRef} className="pointer-events-none absolute inset-0 z-30">
      {geo && (
        <>
          <svg width={geo.width} height={geo.height} className="absolute inset-0 overflow-visible" aria-hidden="true">
            <defs>
              <linearGradient id="route-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={geo.height}>
                <stop offset="0" stopColor="#eba487" />
                <stop offset="0.55" stopColor="#d97757" />
                <stop offset="1" stopColor="#6a9bcc" />
              </linearGradient>
            </defs>
            <path d={geo.route.d} fill="none" stroke="rgb(232 230 220 / 0.2)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 10" className="route-dash" />
            {/* Tramo recorrido: halo ancho y tenue + trazo nítido, ambos recortados con pathLength=1. */}
            <path ref={glowRef} d={geo.route.d} fill="none" stroke="url(#route-grad)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.16" pathLength={1} strokeDasharray="1 1" strokeDashoffset="1" />
            <path ref={trailRef} d={geo.route.d} fill="none" stroke="url(#route-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" pathLength={1} strokeDasharray="1 1" strokeDashoffset="1" />
          </svg>

          {geo.route.stations.map((st) => {
            const done = visited.includes(st.id);
            return (
              <div key={st.id} className="absolute" style={{ left: st.x, top: st.y }} aria-hidden="true">
                <span className={`route-dot absolute -translate-x-1/2 -translate-y-1/2 ${done ? "is-done" : ""}`} />
                <span className={`station-label absolute top-3 left-0 -translate-x-1/2 ${done ? "is-done" : ""}`}>
                  {done ? "✓ " : ""}
                  {stationNumber(st.id)} · {STATION_LABELS[st.id]}
                </span>
                <AnimatePresence>
                  {!done && (
                    <motion.span
                      key="spark"
                      className="absolute left-0 -translate-x-1/2"
                      style={{ top: -size * 0.62 }}
                      exit={{ scale: 2.2, opacity: 0, y: -26, rotate: 90 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    >
                      <span className="route-spark block">
                        <PixelSpark className="size-7" />
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {/* Meta: bandera al lado exterior del carril final. */}
          <div
            className="absolute"
            style={{ left: geo.route.end.x + (geo.route.end.x > geo.width / 2 ? size * 0.34 : -size * 0.34 - 36), top: geo.route.end.y - 58 }}
            aria-hidden="true"
          >
            <PixelFlag className="h-14 w-10" waving={finished} />
            <span className="station-label absolute top-full left-1/2 mt-1 -translate-x-1/2 whitespace-nowrap">Meta</span>
          </div>
        </>
      )}

      <div ref={fxRootRef} className="absolute inset-0 overflow-visible" aria-hidden="true" />

      <div ref={walkerRef} className="absolute top-0 left-0 will-change-transform" style={{ width: size, height: size }}>
        <BuddyBubble
          origin={side === "right" ? "bottom right" : "bottom left"}
          className={`absolute bottom-[30%] max-h-[calc(72dvh-9rem)] w-[min(25rem,44vw)] ${side === "right" ? "right-[86%] rounded-br-md" : "left-[86%] rounded-bl-md"}`}
        />
        <div ref={rotorRef} className="size-full" style={{ transformOrigin: "50% 55%" }}>
          <button
            ref={actor}
            type="button"
            onClick={onActorClick}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Cerrar menú de Buddy" : "Abrir menú de Buddy"}
            className="pointer-events-auto relative size-full cursor-pointer opacity-0"
          >
            <span className="block size-full transition-transform duration-200 hover:scale-105">
              <BuddyAvatar mood={shownMood} walking={walk} look={look} className="size-full" />
            </span>
            {muted && (
              <span className="absolute top-2 left-2 grid size-6 place-items-center rounded-full border border-white/15 bg-ink-2 text-subtle" title="Comentarios silenciados">
                <MessageCircleOff className="size-3.5" aria-hidden="true" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function RouteBuddy() {
  const { routeMode, stage, minimized } = useBuddy();
  if (routeMode !== "lanes" || stage !== "hud" || minimized) return null;
  return <RouteLayer />;
}
