/**
 * Bienvenida de Clawd en el hero. Cada visita estrena una de tres entradas
 * (rotan con localStorage):
 *
 *  - "assemble": se arma pixel a pixel desde partículas dispersas (PixelAssemble).
 *  - "drop":     cae del cielo estirado, aterriza aplastado con polvo y temblor.
 *  - "beam":     un haz con scanlines lo materializa de arriba abajo con parpadeo.
 *
 * Todas acaban en ráfaga pixel + saludo + burbuja. Al elegir tour o explorar,
 * se mide su rectángulo y se pasa a `dock`: la ruta lo hace saltar en arco
 * desde aquí. Si el visitante hace scroll sin elegir, se acopla sin salto.
 */
import { AnimatePresence, motion, useAnimate, useReducedMotionConfig } from "motion/react";
import { Compass, Route } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { welcome } from "@/data/buddy-script";
import { readPref, writePref } from "@/lib/storage";
import type { BuddyMood } from "@/lib/types";
import { BuddyAvatar } from "@/buddy/BuddyAvatar";
import { MotionToggle } from "@/buddy/BuddyPanel";
import { useBuddy } from "@/buddy/BuddyProvider";
import { PixelAssemble } from "@/buddy/PixelAssemble";
import { Typewriter } from "@/buddy/Typewriter";

type Entrance = "assemble" | "drop" | "beam";
const ENTRANCES: readonly Entrance[] = ["assemble", "drop", "beam"];

/** Siguiente entrada del ciclo: un visitante que vuelve ve otra distinta. */
function nextEntrance(): Entrance {
  const n = (readPref("buddy.entrance", -1) + 1) % ENTRANCES.length;
  writePref("buddy.entrance", n);
  return ENTRANCES[n] ?? "assemble";
}

const ASSEMBLE_FRAME = `${import.meta.env.BASE_URL}clawd/clawd-hands-up.png`;
const BURST_COLORS = ["#d97757", "#eba487", "#e8e6dc", "#6a9bcc", "#788c5d"] as const;

/** Ráfaga de cuadrados pixel al terminar la entrada. */
function Burst() {
  const rays = 14;
  return (
    <div className="pointer-events-none absolute inset-0 grid place-items-center" aria-hidden="true">
      <motion.span
        className="absolute size-40 border-2 border-claude/70"
        style={{ clipPath: "var(--pixel-corners)" }}
        initial={{ scale: 0.3, opacity: 0.9, rotate: 0 }}
        animate={{ scale: 2, opacity: 0, rotate: 45 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      {Array.from({ length: rays }, (_, i) => {
        const angle = (i / rays) * Math.PI * 2;
        const dist = i % 2 ? 150 : 115;
        return (
          <motion.span
            key={i}
            className="absolute size-2.5"
            style={{ background: BURST_COLORS[i % BURST_COLORS.length] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1.2 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist, opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        );
      })}
    </div>
  );
}

/** Polvo pixel que levanta al aterrizar (entrada "drop"). */
function Dust() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-[6%] flex justify-center" aria-hidden="true">
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

export function HeroBuddy() {
  const { dock, startTour, say, routeMode } = useBuddy();
  const reduce = useReducedMotionConfig();
  const [entrance] = useState(nextEntrance);
  const [landed, setLanded] = useState(false);
  const [dust, setDust] = useState(false);
  const [mood, setMood] = useState<BuddyMood>(entrance === "drop" ? "surprised" : "idle");
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const bodyRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const [assembleSize, setAssembleSize] = useState(0);

  const land = useCallback(() => setLanded(true), []);

  // Secuencias "drop" y "beam". En layout effect: el primer keyframe se aplica antes del primer paint.
  useLayoutEffect(() => {
    if (reduce) {
      setLanded(true);
      return;
    }
    if (entrance === "assemble") {
      setAssembleSize(avatarRef.current?.offsetWidth ?? 240);
      return;
    }
    const body = bodyRef.current;
    if (!body) return;
    let cancelled = false;
    void (async () => {
      if (entrance === "drop") {
        await animate(body, { y: [-window.innerHeight, 0], scaleY: [1.35, 0.68], scaleX: [0.8, 1.3] }, { duration: 0.62, ease: "easeIn", delay: 0.15 });
        if (cancelled) return;
        setDust(true);
        if (scope.current) void animate(scope.current, { x: [0, -7, 7, -4, 3, 0] }, { duration: 0.35 });
        await animate(body, { y: [0, -56, 0], scaleY: [0.68, 1.12, 1], scaleX: [1.3, 0.94, 1] }, { duration: 0.55, ease: "easeOut" });
      } else {
        await animate(".hero-beam", { scaleY: [0, 1], opacity: [0, 1] }, { duration: 0.35, ease: "easeOut", delay: 0.15 });
        if (cancelled) return;
        await animate(body, { clipPath: ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)"], opacity: [0.3, 1, 0.45, 1, 0.75, 1] }, { duration: 0.85, ease: "linear" });
        if (cancelled) return;
        void animate(".hero-beam", { scaleY: [1, 0], opacity: [1, 0] }, { duration: 0.4, ease: "easeIn" });
      }
      if (!cancelled) setLanded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [entrance, reduce, animate, scope]);

  // Saluda, habla mientras se escribe la bienvenida y se queda contento.
  useEffect(() => {
    if (!landed) return;
    setMood("wave");
    const t1 = window.setTimeout(() => setMood("talk"), 1400);
    const t2 = window.setTimeout(() => setMood("happy"), 1400 + welcome.body.length * 20);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [landed]);

  // Si el escenario sale de pantalla sin que el visitante elija, Buddy se acopla a su ruta.
  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry && !entry.isIntersecting) dock(null);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [dock, scope]);

  const choose = (tour: boolean) => {
    const r = avatarRef.current?.getBoundingClientRect();
    dock(r ? { x: r.left, y: r.top, w: r.width, h: r.height } : null);
    // Espera al salto en arco antes de hablar desde la ruta.
    window.setTimeout(
      () => {
        if (tour) startTour();
        else
          say({
            type: "text",
            text:
              routeMode === "lanes"
                ? "¡Perfecto! Haz scroll y te acompaño por la ruta: recoge las 5 chispas. Haz clic en mí cuando quieras."
                : "¡Perfecto! Te sigo por la barra de abajo: cada parada es una sección. Tócame cuando quieras.",
            mood: "happy",
            auto: true,
          });
      },
      reduce ? 0 : 1150,
    );
  };

  const hiddenUntilLanded = entrance === "assemble" && !landed && !reduce;
  const preStyle =
    reduce || landed ? undefined : entrance === "beam" ? { clipPath: "inset(0% 0% 100% 0%)" } : entrance === "drop" ? { transform: "translateY(-120vh)" } : undefined;

  return (
    <div ref={scope} className="relative flex w-full flex-col items-center gap-5">
      <div ref={avatarRef} className="relative grid size-40 place-items-center sm:size-60">
        {entrance === "beam" && !reduce && (
          <span
            className="hero-beam pointer-events-none absolute bottom-[4%] left-1/2 h-[220%] w-[70%] origin-top -translate-x-1/2 opacity-0"
            style={{
              background:
                "repeating-linear-gradient(0deg, rgb(250 249 245 / 0.14) 0 2px, transparent 2px 6px), linear-gradient(180deg, transparent, rgb(235 164 135 / 0.55) 70%, rgb(217 119 87 / 0.7))",
              clipPath: "polygon(30% 0, 70% 0, 100% 100%, 0 100%)",
            }}
            aria-hidden="true"
          />
        )}
        {hiddenUntilLanded && assembleSize > 0 && <PixelAssemble src={ASSEMBLE_FRAME} size={assembleSize} onDone={land} />}

        <div ref={bodyRef} className="relative size-full" style={preStyle}>
          <motion.div
            className="size-full"
            initial={false}
            animate={hiddenUntilLanded ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
            transition={entrance === "assemble" ? { type: "spring", stiffness: 300, damping: 12 } : { duration: 0 }}
          >
            <BuddyAvatar mood={mood} className="size-full" />
          </motion.div>
        </div>

        {landed && !reduce && <Burst />}
        {dust && <Dust />}
      </div>

      <AnimatePresence>
        {landed && (
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: reduce ? 0 : 0.25, type: "spring", stiffness: 260, damping: 24 }}
            className="glass buddy-bubble relative w-full max-w-sm rounded-3xl p-5 text-left"
            role="region"
            aria-label="Bienvenida de Buddy"
          >
            {/* Pico de la burbuja apuntando a Buddy. */}
            <span className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rotate-45 border-t border-l border-white/10 bg-[rgb(40_38_34)]" aria-hidden="true" />
            <p className="mb-1.5 font-display text-lg font-bold">{welcome.title}</p>
            <p className="sr-only">{welcome.body}</p>
            <p className="text-sm leading-relaxed text-muted">
              <Typewriter text={welcome.body} speed={20} />
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className="btn btn-primary !min-h-10 !px-4 !text-sm" onClick={() => choose(true)}>
                <Route className="size-4" aria-hidden="true" /> Tour guiado
              </button>
              <button type="button" className="btn btn-ghost !min-h-10 !px-4 !text-sm" onClick={() => choose(false)}>
                <Compass className="size-4" aria-hidden="true" /> Explorar libremente
              </button>
            </div>
            <MotionToggle className="-mx-3 mt-3 !px-3" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
