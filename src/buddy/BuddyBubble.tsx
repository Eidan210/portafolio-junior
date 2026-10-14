/**
 * Burbuja de diálogo con sus controles (silenciar, minimizar, cerrar). La usan
 * tanto el HUD de esquina como Clawd caminando por la ruta; solo cambia dónde
 * se ancla (`className`) y desde qué esquina crece (`origin`).
 */
import { AnimatePresence, animate, motion, useReducedMotionConfig } from "motion/react";
import { MessageCircle, MessageCircleOff, Minus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { buddyUiCopy } from "@/data/ui";
import { BuddyPanel } from "@/buddy/BuddyPanel";
import { useBuddy } from "@/buddy/BuddyProvider";

const iconBtn =
  "grid size-8 place-items-center rounded-full text-subtle transition-colors hover:bg-white/10 hover:text-fg";

type Props = { className?: string; origin: string };

export function BuddyBubble({ className = "", origin }: Props) {
  const { view, muted, minimized, close, setMuted, setMinimized } = useBuddy();
  const reduce = useReducedMotionConfig();
  const [holding, setHolding] = useState(false);
  const ref = useRef<HTMLElement>(null);

  // Los comentarios automáticos se retiran solos; hover o foco dentro de la burbuja pausan la cuenta.
  useEffect(() => {
    if (!view || view.type !== "text" || !view.auto || holding) return;
    const t = window.setTimeout(close, 6500 + view.text.length * 35);
    return () => window.clearTimeout(t);
  }, [view, holding, close]);

  // Cerrarla con el puntero o el foco dentro la desmonta sin que lleguen pointerleave ni blur: la pausa
  // quedaba activa y los siguientes comentarios automáticos (p. ej. "Ruta completada", que en móvil
  // flota sobre el formulario de contacto) ya no se retiraban solos.
  useEffect(() => {
    if (!view || minimized) setHolding(false);
  }, [view, minimized]);

  // Clawd cruzó de carril y la burbuja cambia de lado: reaparece con un fundido en vez de teletransportarse.
  const lastOrigin = useRef(origin);
  useEffect(() => {
    if (lastOrigin.current === origin) return;
    lastOrigin.current = origin;
    if (!reduce && ref.current) void animate(ref.current, { opacity: [0, 1] }, { duration: 0.24, ease: "easeOut" });
  }, [origin, reduce]);

  return (
    <AnimatePresence>
      {view && !minimized && (
        <motion.section
          ref={ref}
          key="bubble"
          aria-label={buddyUiCopy.messageAria}
          initial={{ opacity: 0, y: reduce ? 0 : 14, scale: reduce ? 1 : 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.94 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
          style={{ transformOrigin: origin }}
          onPointerEnter={() => setHolding(true)}
          onPointerLeave={() => setHolding(false)}
          onFocus={() => setHolding(true)}
          onBlur={(e) => {
            if (!ref.current?.contains(e.relatedTarget as Node | null)) setHolding(false);
          }}
          className={`glass buddy-bubble pointer-events-auto overflow-y-auto overscroll-contain rounded-3xl p-4 pt-3 ${className}`}
        >
          <header className="mb-1 flex items-center gap-1">
            <span className="mr-auto text-[0.7rem] font-semibold tracking-wider text-subtle uppercase">Buddy</span>
            <button
              type="button"
              className={iconBtn}
              aria-pressed={muted}
              aria-label={muted ? buddyUiCopy.unmuteAuto : buddyUiCopy.muteAuto}
              title={muted ? buddyUiCopy.unmuteAuto : buddyUiCopy.muteAuto}
              onClick={() => setMuted(!muted)}
            >
              {muted ? <MessageCircleOff className="size-4" aria-hidden="true" /> : <MessageCircle className="size-4" aria-hidden="true" />}
            </button>
            <button type="button" className={iconBtn} aria-label={buddyUiCopy.minimizeAria} title={buddyUiCopy.minimizeTitle} onClick={() => setMinimized(true)}>
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <button type="button" className={iconBtn} aria-label={buddyUiCopy.closeAria} title={buddyUiCopy.closeTitle} onClick={close}>
              <X className="size-4" aria-hidden="true" />
            </button>
          </header>
          <BuddyPanel view={view} />
        </motion.section>
      )}
    </AnimatePresence>
  );
}
