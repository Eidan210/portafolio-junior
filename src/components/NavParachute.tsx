/**
 * Salto en paracaídas de Clawd al final de la vía del nav. Al completar el
 * scroll, se suelta con un saltito y caída libre, despliega el paracaídas
 * pixel con rebote y desciende balanceándose suavemente hasta aterrizar sobre
 * el footer (o salir por abajo si no hay footer visible). Al tocar suelo, la
 * cúpula se desinfla, Clawd saluda brevemente y se marcha caminando fuera del
 * viewport por el borde lateral más cercano.
 */
import { useAnimate } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { PixelParachute } from "@/buddy/pixel-props";
import { buddyUiCopy, navCopy } from "@/data/ui";

const HANDS_UP_SRC = `${import.meta.env.BASE_URL}clawd/clawd-hands-up.png`;
const STANDING_SRC = `${import.meta.env.BASE_URL}clawd/clawd.png`;
const LOOKING_RIGHT_SRC = `${import.meta.env.BASE_URL}clawd/clawd-looking-right.png`;
const LOOKING_LEFT_SRC = `${import.meta.env.BASE_URL}clawd/clawd-looking-left.png`;

type NavParachuteProps = {
  /** Punto del viewport donde colgaba Clawd al soltarse: la caída arranca justo ahí. */
  from: { x: number; y: number };
  /** Se llama al salir del viewport; nunca tras desmontarse. */
  onDone: () => void;
};

export function NavParachute({ from, onDone }: NavParachuteProps) {
  const [scope, animate] = useAnimate();
  const onDoneRef = useRef(onDone);
  const [riderSrc, setRiderSrc] = useState(HANDS_UP_SRC);
  const [showGreeting, setShowGreeting] = useState(false);

  useLayoutEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    let mounted = true;
    let greetingInterval: number | null = null;
    let greetingTimeout: number | null = null;
    let hopAnimation: ReturnType<typeof animate> | null = null;

    const sequence = async () => {
      try {
        const groupEl = scope.current?.querySelector(".parachute-group") as HTMLElement | null;
        const initialGroupTop = groupEl ? groupEl.getBoundingClientRect().top : 0;

        // (a) Suelta: saltito de ~6 px hacia arriba y caída libre de ~36 px en ~0.35 s
        await animate(".parachute-group", { y: -6 }, { duration: 0.1, ease: "easeOut" });
        if (!mounted) return;
        await animate(".parachute-group", { y: 36 }, { duration: 0.25, ease: "easeIn" });
        if (!mounted) return;

        // (b) Despliegue de la cúpula con resorte elástico y tirón del cuerpo hacia arriba (~8 px)
        await Promise.all([
          animate(
            ".parachute-canopy",
            { scaleY: [0, 1], scaleX: [0.3, 1], opacity: [0, 1] },
            { type: "spring", bounce: 0.45, duration: 0.4 },
          ),
          animate(".parachute-group", { y: 28 }, { type: "spring", stiffness: 320, damping: 18 }),
        ]);
        if (!mounted) return;

        // (c) Destino: medir en el viewport la línea de suelo (el borde visible del footer).
        // Centro horizontal donde tocará suelo: el de la suelta más la deriva de -48 px.
        const groupRect = groupEl?.getBoundingClientRect();
        const landingX = groupRect ? groupRect.left + groupRect.width / 2 - 48 : window.innerWidth / 2;

        /** Borde superior de un elemento visible en pantalla (no se usa `offsetParent`: es `null` en los `fixed`). */
        const visibleTop = (el: Element | null, needsX = false): number | undefined => {
          if (!el) return undefined;
          const r = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          if (r.width === 0 || r.height === 0 || style.visibility === "hidden" || Number(style.opacity) === 0) return undefined;
          if (r.top < 0 || r.top > window.innerHeight) return undefined;
          if (needsX && (landingX < r.left || landingX > r.right)) return undefined;
          return r.top;
        };
        /**
         * Línea de suelo en el viewport, o `undefined` si no hay suelo en pantalla (Clawd sale por abajo).
         * En móvil y tablet la barra de ruta y la burbuja de Buddy flotan sobre el footer: Clawd se posa
         * encima de lo primero que encuentre (la burbuja, solo si está bajo su trayectoria).
         */
        const measureGround = (): number | undefined => {
          const footer = document.querySelector("[data-landing]") ?? document.querySelector("footer");
          if (!footer) return undefined;
          const routeTrackTop = visibleTop(document.querySelector("[data-route-track]"));
          const bubbleTop = visibleTop(document.querySelector(`[data-route-track] [aria-label="${buddyUiCopy.messageAria}"]`), true);
          const ground = Math.min(
            footer.getBoundingClientRect().top,
            routeTrackTop !== undefined ? routeTrackTop - 12 : Infinity,
            bubbleTop !== undefined ? bubbleTop - 2 : Infinity,
          );
          return ground < window.innerHeight - 8 ? ground : undefined;
        };
        const groundLine = measureGround();

        // Sin suelo en pantalla: caída fuera de pantalla
        if (groundLine === undefined) {
          const fallbackTargetY = window.innerHeight + 80;
          await Promise.all([
            animate(".parachute-group", { y: fallbackTargetY }, { duration: 4.5, ease: "linear" }),
            animate(".parachute-group", { x: -48 }, { duration: 4.5, ease: "easeInOut" }),
            animate(".parachute-group", { scale: 1.3 }, { duration: 4.5, ease: "easeOut" }),
            animate(
              ".parachute-group",
              { rotate: [0, -10, 9, -7, 6, -4, 3, -2, 0] },
              { duration: 4.5, ease: "easeInOut" },
            ),
          ]);
          if (!mounted) return;
          onDoneRef.current();
          return;
        }

        // Precisión del aterrizaje:
        // El grupo escala 1 → 1.3 con transformOrigin "50% -63%".
        // El borde inferior escalado queda a -0.63*s + (s + 0.63*s) * 1.3 px del top sin escalar, con s el
        // lado real de Clawd (`size-6` escala con la fuente raíz; offsetHeight no incluye transformaciones).
        const clawdSize = groupEl?.offsetHeight || 24;
        const ORIGIN_Y_OFFSET = -0.63 * clawdSize;
        const SCALE = 1.3;
        const scaledBottomOffset =
          ORIGIN_Y_OFFSET + (clawdSize - ORIGIN_Y_OFFSET) * SCALE;
        const targetFor = (ground: number) => ground - initialGroupTop - scaledBottomOffset;
        const landingTargetY = targetFor(groundLine);
        // Ventana muy baja: el suelo quedaría por encima de donde se abrió la cúpula y Clawd "subiría".
        if (landingTargetY < 60) {
          await animate(".parachute-group", { y: window.innerHeight + 80, x: -48, scale: 1.3 }, { duration: 3, ease: "linear" });
          if (!mounted) return;
          onDoneRef.current();
          return;
        }

        // Descenso hacia el suelo con vaivén amortiguado y rotación terminando en 0
        const currentDistance = window.innerHeight + 80 - 28;
        const baseSpeed = currentDistance / 4.5;
        const landingDistance = Math.max(0, landingTargetY - 28);
        const descentDuration = Math.max(1.6, landingDistance / baseSpeed);

        await Promise.all([
          animate(".parachute-group", { y: landingTargetY }, { duration: descentDuration, ease: "linear" }),
          animate(".parachute-group", { x: -48 }, { duration: descentDuration, ease: "easeInOut" }),
          animate(".parachute-group", { scale: 1.3 }, { duration: descentDuration, ease: "easeOut" }),
          animate(
            ".parachute-group",
            { rotate: [0, -10, 9, -7, 6, -4, 3, -2, 0] },
            { duration: descentDuration, ease: "easeInOut" },
          ),
        ]);
        if (!mounted) return;

        // (c') El descenso dura segundos: si entretanto hubo scroll, cambió el tamaño de la ventana o la
        // burbuja de Buddy apareció o se fue, el suelo se movió. Se vuelve a medir: sin suelo en pantalla
        // Clawd sigue cayendo; si bajó, baja con él; si subió poco, se ajusta. Si subió mucho (la burbuja
        // apareció por encima), no asciende con la cúpula abierta: aterriza donde iba, en su capa superior.
        const finalGround = measureGround();
        let finalTargetY = landingTargetY;
        if (finalGround === undefined) finalTargetY = window.innerHeight + 80;
        else if (targetFor(finalGround) > landingTargetY - 48) finalTargetY = targetFor(finalGround);
        if (Math.abs(finalTargetY - landingTargetY) > 2) {
          const correction = Math.min(3, Math.max(0.25, Math.abs(finalTargetY - landingTargetY) / baseSpeed));
          await animate(".parachute-group", { y: finalTargetY }, { duration: correction, ease: finalGround === undefined ? "linear" : "easeOut" });
          if (!mounted) return;
        }
        if (finalGround === undefined) {
          onDoneRef.current();
          return;
        }

        // (d) Toque de suelo: aplastamiento breve y desinflado de la cúpula
        await Promise.all([
          animate(
            ".nav-rider-body",
            { scaleY: [1, 0.8, 1.05, 1], scaleX: [1, 1.15, 0.97, 1] },
            { duration: 0.35, ease: "easeOut" },
          ),
          animate(
            ".parachute-canopy",
            { scaleY: 0.25, rotate: 75, x: 10, opacity: 0 },
            { duration: 0.6, ease: "easeOut" },
          ),
        ]);
        if (!mounted) return;

        // (e) Saludo: durante ~1.2 s alterna la imagen cada ~300 ms con globo "¡Hola!"
        setShowGreeting(true);
        await new Promise<void>((resolve) => {
          let isHandsUp = false;
          setRiderSrc(STANDING_SRC);

          greetingInterval = window.setInterval(() => {
            if (!mounted) return;
            isHandsUp = !isHandsUp;
            setRiderSrc(isHandsUp ? HANDS_UP_SRC : STANDING_SRC);
          }, 300);

          greetingTimeout = window.setTimeout(() => {
            if (greetingInterval !== null) {
              window.clearInterval(greetingInterval);
              greetingInterval = null;
            }
            greetingTimeout = null;
            resolve();
          }, 1200);
        });
        if (!mounted) return;
        setShowGreeting(false);

        // (f) Salida caminando hacia el borde lateral más cercano
        const riderEl = scope.current?.querySelector(".parachute-group") as HTMLElement | null;
        const currentRect = riderEl?.getBoundingClientRect();
        const currentCenterX = currentRect
          ? currentRect.left + currentRect.width / 2
          : window.innerWidth / 2;
        const exitLeft = currentCenterX < window.innerWidth / 2;

        setRiderSrc(exitLeft ? LOOKING_LEFT_SRC : LOOKING_RIGHT_SRC);

        let targetX: number;
        if (currentRect) {
          if (exitLeft) {
            targetX = -48 - (currentRect.right + 40);
          } else {
            targetX = -48 + (window.innerWidth - currentRect.left + 40);
          }
        } else {
          targetX = exitLeft ? -48 - window.innerWidth : -48 + window.innerWidth;
        }

        // Saltitos: y relativo [0, -3, 0] en bucle cada ~0.3 s
        hopAnimation = animate(
          ".nav-rider-body",
          { y: [0, -3, 0] },
          { duration: 0.3, repeat: Infinity, ease: "easeInOut" },
        );

        // Unos 2.2 s hasta quedar fuera del viewport, con opacity → 0 en el último 20 %
        await Promise.all([
          animate(".parachute-group", { x: targetX }, { duration: 2.2, ease: "linear" }),
          animate(
            ".parachute-group",
            { opacity: [1, 1, 0] },
            { duration: 2.2, times: [0, 0.8, 1], ease: "linear" },
          ),
        ]);

        hopAnimation.stop();
        hopAnimation = null;

        if (!mounted) return;
        onDoneRef.current();
      } catch {
        // Interrupción limpia si el componente se desmonta antes de finalizar
      }
    };

    void sequence();

    return () => {
      mounted = false;
      if (greetingInterval !== null) {
        window.clearInterval(greetingInterval);
      }
      if (greetingTimeout !== null) {
        window.clearTimeout(greetingTimeout);
      }
      hopAnimation?.stop();
    };
  }, [animate]);

  // Capa propia sobre <body>: dentro del header (z-40) la tapaban la barra de ruta y la burbuja de
  // Buddy en móvil (también z-40, pero después en el DOM). z-[55] queda sobre ellas y la píldora
  // minimizada (z-50), y bajo el confeti (z-60) y la intro (z-70).
  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[55] overflow-hidden" aria-hidden="true">
      <div ref={scope} className="absolute" style={{ left: from.x, top: from.y }}>
        <div
          className="parachute-group absolute -top-[3px] left-0 size-6 -translate-x-1/2"
          style={{ transformOrigin: "50% -63%" }}
        >
          <div
            className="parachute-canopy pointer-events-none absolute bottom-[88%] -left-[15%] aspect-[26/15] w-[130%]"
            style={{ opacity: 0, transformOrigin: "50% 100%" }}
          >
            <PixelParachute className="size-full" />
          </div>
          <div
            className="nav-rider-body relative block size-full"
            style={{ transformOrigin: "50% 100%" }}
          >
            {showGreeting && (
              <span
                className="pixel-corners font-pixel pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#e8e6dc] px-1.5 py-0.5 text-[9px] text-[#141413] shadow-sm select-none"
              >
                {navCopy.parachuteGreeting}
              </span>
            )}
            <img
              src={riderSrc}
              alt=""
              draggable={false}
              className="nav-rider block size-full select-none"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
