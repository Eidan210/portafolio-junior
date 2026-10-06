/**
 * Bienvenida de Clawd en el hero.
 *
 * La entrada la pinta `ClawdEntrance` (cinco coreografías que rotan por visita).
 * En escritorio ocurre a pantalla completa dentro de `IntroStage` y aquí solo
 * se recibe a Clawd cuando vuela a su hueco; en móvil y tablet, en el hueco.
 *
 * Todas acaban en ráfaga pixel + saludo + burbuja. Al elegir tour o explorar,
 * se mide su rectángulo y se pasa a `dock`: la ruta lo hace saltar en arco
 * desde aquí. Si el visitante hace scroll sin elegir, se acopla sin salto.
 */
import { AnimatePresence, motion, useAnimate, useReducedMotionConfig } from "motion/react";
import { Compass, Route } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { welcome } from "@/data/buddy-script";
import type { BuddyMood } from "@/lib/types";
import { BuddyAvatar } from "@/buddy/BuddyAvatar";
import { MotionToggle } from "@/buddy/BuddyPanel";
import { useBuddy } from "@/buddy/BuddyProvider";
import { ClawdEntrance, nextEntrance } from "@/buddy/ClawdEntrance";
import type { EntranceKind } from "@/buddy/ClawdEntrance";
import { IntroStage } from "@/buddy/IntroStage";
import { PixelBurst } from "@/buddy/pixel-props";
import { Typewriter } from "@/buddy/Typewriter";

export function HeroBuddy() {
  const { dock, startTour, say, routeMode, intro, setIntro } = useBuddy();
  const reduce = useReducedMotionConfig();
  // Con la intro de escritorio la entrada ocurre allí (y no consume el turno del ciclo de móvil).
  const [withIntro] = useState(() => intro === "play");
  const [kind] = useState<EntranceKind | null>(() => (withIntro ? null : nextEntrance("buddy.entrance")));
  const [landed, setLanded] = useState(false);
  const [mood, setMood] = useState<BuddyMood>("idle");
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const avatarRef = useRef<HTMLDivElement>(null);

  const land = useCallback(() => setLanded(true), []);
  const shake = useCallback(() => {
    if (scope.current) void animate(scope.current, { x: [0, -7, 7, -4, 3, 0] }, { duration: 0.35 });
  }, [animate, scope]);
  const revealHero = useCallback(() => setIntro("reveal"), [setIntro]);
  const endIntro = useCallback(() => {
    setLanded(true);
    setIntro("done");
  }, [setIntro]);

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

  return (
    <div ref={scope} className="relative flex w-full flex-col items-center gap-5">
      {withIntro && intro !== "done" && <IntroStage target={avatarRef} onReveal={revealHero} onDone={endIntro} />}
      <div ref={avatarRef} className="relative grid size-40 place-items-center sm:size-60">
        {kind ? (
          <ClawdEntrance kind={kind} mood={mood} onLanded={land} onImpact={shake} />
        ) : (
          // Escritorio: el Clawd de la intro vuela hasta este rectángulo y el relevo es instantáneo.
          <div className={`size-full ${landed ? "" : "opacity-0"}`}>
            <BuddyAvatar mood={mood} className="size-full" />
          </div>
        )}
        {landed && !reduce && <PixelBurst />}
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
            <span className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rotate-45 border-t border-l border-white/10 bg-[rgb(42_40_37)]" aria-hidden="true" />
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
