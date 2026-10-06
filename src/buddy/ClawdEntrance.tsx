/**
 * Entradas de Clawd. Cinco coreografías sirven a dos escalas y una sexta solo
 * existe a pantalla completa:
 *
 *  - "assemble":  se arma con sus propios pixeles desde posiciones dispersas.
 *  - "drop":      cae del cielo estirado, aterriza aplastado con polvo y temblor.
 *  - "beam":      un haz con scanlines lo materializa de arriba abajo con parpadeo.
 *  - "rain":      lluvia de bloques estilo Tetris, de los pies a la cabeza.
 *  - "parachute": baja en paracaídas balanceándose y lo suelta al aterrizar.
 *  - "warp":      salto al hiperespacio: estrellas que salen disparadas del
 *                 centro y Clawd llegando en espiral desde el fondo (solo intro).
 *
 * Con `screen` es la intro de escritorio (Clawd gigante, la coreografía usa
 * toda la pantalla); sin él ocurre en el hueco del hero. Ocupa el tamaño de su
 * contenedor y, tras aterrizar, se queda como el Clawd normal con el ánimo que
 * le pase el padre. Rotan por visita y por plataforma (`nextEntrance`).
 */
import { animate, motion, useReducedMotionConfig } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { readPref, writePref } from "@/lib/storage";
import type { BuddyMood } from "@/lib/types";
import { BuddyAvatar } from "@/buddy/BuddyAvatar";
import { PixelAssemble } from "@/buddy/PixelAssemble";
import { PixelParachute } from "@/buddy/pixel-props";

export type EntranceKind = "assemble" | "drop" | "beam" | "rain" | "parachute" | "warp";
/** Intro de escritorio (pantalla completa) y hueco del hero (móvil y tablet). */
const SCREEN_KINDS: readonly EntranceKind[] = ["assemble", "drop", "beam", "rain", "parachute", "warp"];
const SLOT_KINDS: readonly EntranceKind[] = ["assemble", "drop", "beam", "rain", "parachute"];

/** `?entrada=…` fuerza una concreta (sin avanzar la rotación): para verlas una a una. */
const BY_SLUG: Readonly<Record<string, EntranceKind>> = {
  ensamblado: "assemble",
  caida: "drop",
  teletransporte: "beam",
  lluvia: "rain",
  paracaidas: "parachute",
  hiperespacio: "warp",
};

/** Siguiente entrada del ciclo de esta plataforma: un visitante que vuelve ve otra distinta. */
export function nextEntrance(key: "buddy.intro" | "buddy.entrance"): EntranceKind {
  const kinds = key === "buddy.intro" ? SCREEN_KINDS : SLOT_KINDS;
  const forced = BY_SLUG[new URLSearchParams(window.location.search).get("entrada") ?? ""];
  if (forced && kinds.includes(forced)) return forced;
  const n = (readPref(key, -1) + 1) % kinds.length;
  writePref(key, n);
  return kinds[n] ?? "assemble";
}

const FRAME = `${import.meta.env.BASE_URL}clawd/clawd-hands-up.png`;
const BEAM_BG =
  "repeating-linear-gradient(0deg, rgb(250 249 245 / 0.14) 0 2px, transparent 2px 6px), linear-gradient(180deg, transparent, rgb(235 164 135 / 0.55) 70%, rgb(217 119 87 / 0.7))";
/** Pose mientras dura la coreografía; al aterrizar manda el ánimo del padre. */
const ENTRANCE_MOOD: Record<EntranceKind, BuddyMood> = {
  assemble: "idle",
  drop: "surprised",
  beam: "idle",
  rain: "idle",
  parachute: "hang",
  warp: "cool",
};
/** Primer paint, antes de que arranque la secuencia: Clawd todavía fuera de escena. */
const PRE: Partial<Record<EntranceKind, CSSProperties>> = {
  drop: { transform: "translateY(-120vh)" },
  beam: { clipPath: "inset(0% 0% 100% 0%)" },
  parachute: { transform: "translateY(-120vh)" },
  warp: { transform: "scale(0.03)", opacity: 0 },
};
const WARP_MS = 1150;
const STAR_COLORS = ["#faf9f5", "#e8e6dc", "#e8e6dc", "#eba487", "#d97757", "#9cc0e4"] as const;

/**
 * Salto al hiperespacio: estrellas pixel que nacen junto a (cx, cy) y salen
 * disparadas hacia los bordes cada vez más rápido. Cada frame pinta el tramo
 * recorrido, así la estela crece con la velocidad. Se apaga al final.
 */
function WarpField({ cx, cy }: { cx: number; cy: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const w = (canvas.width = window.innerWidth);
    const h = (canvas.height = window.innerHeight);
    const far = Math.hypot(w, h) / 2;
    const stars = Array.from({ length: 170 }, (_, i) => ({
      angle: Math.random() * Math.PI * 2,
      dist: Math.random() * far * 0.35,
      pace: 0.55 + Math.random() * 0.9,
      color: STAR_COLORS[i % STAR_COLORS.length]!,
    }));
    ctx.lineCap = "square";
    const start = performance.now();
    let last = start;
    let raf = 0;
    const frame = (now: number) => {
      const t = Math.min(1, (now - start) / WARP_MS);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const speed = 260 + 3400 * t * t; // px/s: acelera hasta el salto
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = t < 0.75 ? 1 : (1 - t) / 0.25;
      for (const s of stars) {
        const from = s.dist;
        // Perspectiva: cuanto más lejos del centro, más rápido parece ir.
        s.dist += speed * s.pace * dt * (0.25 + s.dist / far);
        if (s.dist > far * 1.1) s.dist = Math.random() * 24;
        const cos = Math.cos(s.angle);
        const sin = Math.sin(s.angle);
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2 + (s.dist / far) * 3;
        ctx.beginPath();
        ctx.moveTo(cx + cos * from, cy + sin * from);
        ctx.lineTo(cx + cos * s.dist, cy + sin * s.dist);
        ctx.stroke();
      }
      if (t < 1) raf = requestAnimationFrame(frame);
      else ctx.clearRect(0, 0, w, h);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [cx, cy]);

  return <canvas ref={ref} className="pointer-events-none fixed inset-0" />;
}

type Controls = ReturnType<typeof animate>;

type Props = {
  kind: EntranceKind;
  /** Intro de escritorio: Clawd gigante y efectos a escala de pantalla. */
  screen?: boolean;
  /** Ánimo tras aterrizar. */
  mood: BuddyMood;
  /** Aterrizar ya, sin terminar la coreografía (la intro se saltó). */
  finish?: boolean;
  onLanded: () => void;
  /** Golpe al aterrizar de la caída: el padre decide qué tiembla. */
  onImpact?: () => void;
};

/** Polvo pixel que levanta al aterrizar (caída). Diseñado para un Clawd de ~240 px. */
function Dust({ scale }: { scale: number }) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[6%] flex justify-center" style={{ transform: `scale(${scale})`, transformOrigin: "50% 100%" }}>
      {Array.from({ length: 10 }, (_, i) => {
        const dir = i % 2 ? 1 : -1;
        const spread = 40 + (i >> 1) * 22;
        return (
          <motion.span
            key={i}
            className="absolute size-2 bg-sand"
            initial={{ x: 0, y: 0, opacity: 0.85, scale: 1 }}
            animate={{ x: dir * spread, y: -10 - (i % 3) * 8, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export function ClawdEntrance({ kind, screen = false, mood, finish = false, onLanded, onImpact }: Props) {
  const reduce = useReducedMotionConfig();
  const rootRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null); // cae, se balancea o se recorta
  const squashRef = useRef<HTMLDivElement>(null); // estira y aplasta desde los pies
  const beamRef = useRef<HTMLSpanElement>(null);
  const chuteRef = useRef<HTMLDivElement>(null);
  const running = useRef<Controls[]>([]);
  const landedRef = useRef(false);
  const [landed, setLanded] = useState(false);
  const [size, setSize] = useState(0);
  const [origin, setOrigin] = useState<{ x: number; y: number } | undefined>(undefined);
  const [warpAt, setWarpAt] = useState<{ x: number; y: number } | null>(null);
  const [dust, setDust] = useState(false);
  // Espejo de los callbacks: la coreografía no debe reiniciarse si el padre los recrea.
  const handlers = useRef({ onLanded, onImpact });
  handlers.current = { onLanded, onImpact };
  const pixels = kind === "assemble" || kind === "rain";

  const land = useCallback(() => {
    if (landedRef.current) return;
    landedRef.current = true;
    setLanded(true);
    handlers.current.onLanded();
  }, []);

  // En layout effect: el primer keyframe se aplica antes del primer paint.
  useLayoutEffect(() => {
    const root = rootRef.current;
    const group = groupRef.current;
    const squash = squashRef.current;
    // Ya aterrizó: activar "Animaciones completas" después no debe repetir la entrada.
    if (!root || !group || !squash || landedRef.current) return;
    if (reduce) {
      land();
      return;
    }
    const s = root.offsetWidth;
    setSize(s);
    if (pixels) {
      if (screen) {
        const r = root.getBoundingClientRect();
        setOrigin({ x: r.left, y: r.top });
      }
      return; // PixelAssemble avisa con onDone
    }

    let cancelled = false;
    const track = (c: Controls) => {
      running.current.push(c);
      return c;
    };
    const k = s / 240;
    const h = window.innerHeight;
    if (kind === "warp") {
      const r = root.getBoundingClientRect();
      setWarpAt({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    const run = async () => {
      if (kind === "drop") {
        await Promise.all([
          track(animate(group, { y: [-h, 0] }, { duration: 0.62, ease: "easeIn", delay: 0.15 })),
          track(animate(squash, { scaleY: [1.35, 0.68], scaleX: [0.8, 1.3] }, { duration: 0.62, ease: "easeIn", delay: 0.15 })),
        ]);
        if (cancelled) return;
        setDust(true);
        handlers.current.onImpact?.();
        await Promise.all([
          track(animate(group, { y: [0, -56 * k, 0] }, { duration: 0.55, ease: "easeOut" })),
          track(animate(squash, { scaleY: [0.68, 1.12, 1], scaleX: [1.3, 0.94, 1] }, { duration: 0.55, ease: "easeOut" })),
        ]);
      } else if (kind === "beam") {
        const beam = beamRef.current;
        if (beam) await track(animate(beam, { scaleY: [0, 1], opacity: [0, 1] }, { duration: 0.35, ease: "easeOut", delay: 0.15 }));
        if (cancelled) return;
        await track(
          animate(group, { clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"], opacity: [0.3, 1, 0.45, 1, 0.75, 1] }, { duration: 0.85, ease: "linear" }),
        );
        if (cancelled) return;
        if (beam) track(animate(beam, { scaleY: [1, 0], opacity: [1, 0] }, { duration: 0.4, ease: "easeIn" }));
      } else if (kind === "warp") {
        // Llega en espiral desde el fondo, acelerando, y se pasa un poco antes de frenar.
        await track(
          animate(
            group,
            { scale: [0.03, 1.18, 1], rotate: [-540, -20, 0], opacity: [0, 1, 1] },
            { duration: WARP_MS / 1000, times: [0, 0.84, 1], ease: ["easeIn", "easeOut"] },
          ),
        );
      } else {
        // Paracaídas: desciende frenando, con vaivén de péndulo colgado de la cúpula.
        await Promise.all([
          track(animate(group, { y: [-h, 0] }, { duration: 1.7, ease: [0.22, 0.61, 0.36, 1] })),
          track(animate(group, { rotate: [-12, 9, -6, 4, -1, 0], x: [-0.12 * s, 0.1 * s, -0.06 * s, 0.03 * s, 0, 0] }, { duration: 1.7, ease: "easeInOut" })),
        ]);
        if (cancelled) return;
        const chute = chuteRef.current;
        if (chute) track(animate(chute, { x: [0, 0.6 * s], y: [0, -1.1 * s], rotate: [0, 28], opacity: [1, 0] }, { duration: 0.75, ease: "easeIn" }));
        await track(animate(squash, { scaleY: [1, 0.84, 1.06, 1], scaleX: [1, 1.12, 0.96, 1] }, { duration: 0.45 }));
      }
    };
    void run().then(() => !cancelled && land());
    return () => {
      cancelled = true;
      running.current.forEach((c) => c.stop());
      running.current = [];
    };
  }, [kind, screen, reduce, pixels, land]);

  // Intro saltada: todo a su estado final y aterrizar ya.
  useLayoutEffect(() => {
    if (!finish || landedRef.current) return;
    running.current.forEach((c) => c.stop());
    running.current = [];
    if (groupRef.current) animate(groupRef.current, { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }, { duration: 0 });
    if (squashRef.current) animate(squashRef.current, { scaleX: 1, scaleY: 1 }, { duration: 0 });
    for (const prop of [beamRef.current, chuteRef.current]) if (prop) animate(prop, { opacity: 0 }, { duration: 0 });
    land();
  }, [finish, land]);

  return (
    <div ref={rootRef} className="relative size-full" aria-hidden="true">
      {kind === "beam" && !reduce && (
        <span
          ref={beamRef}
          className="pointer-events-none absolute bottom-[4%] left-1/2 w-[70%] origin-top -translate-x-1/2 opacity-0"
          style={{ height: screen ? "100vh" : "220%", background: BEAM_BG, clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)" }}
        />
      )}
      {pixels && !landed && size > 0 && (!screen || origin) && (
        <PixelAssemble src={FRAME} size={size} mode={kind === "rain" ? "rain" : "scatter"} fullscreen={origin} onDone={land} />
      )}
      {warpAt && !landed && <WarpField cx={warpAt.x} cy={warpAt.y} />}

      <div
        ref={groupRef}
        className="relative size-full"
        // El vaivén del paracaídas pivota en la cúpula, no en Clawd.
        style={{ transformOrigin: kind === "parachute" ? "50% -63%" : undefined, ...(landed ? undefined : PRE[kind]) }}
      >
        {kind === "parachute" && !reduce && (
          // Las cuerdas acaban a la altura de las manos levantadas (12 % superior del PNG).
          <div ref={chuteRef} className="pointer-events-none absolute bottom-[88%] -left-[15%] aspect-[26/15] w-[130%]">
            <PixelParachute className="size-full" />
          </div>
        )}
        <div ref={squashRef} className="size-full origin-bottom">
          <motion.div
            className="size-full"
            initial={false}
            animate={pixels && !landed && !reduce ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
            transition={pixels ? { type: "spring", stiffness: 300, damping: 12 } : { duration: 0 }}
          >
            <BuddyAvatar mood={landed ? mood : ENTRANCE_MOOD[kind]} className="size-full" />
          </motion.div>
        </div>
      </div>

      {dust && <Dust scale={size / 240} />}
    </div>
  );
}
