/**
 * Capa fija de Buddy, común a los dos modos de ruta:
 *  - región viva `sr-only` que anuncia cada mensaje una sola vez,
 *  - píldora de "Buddy dormido" cuando está minimizado,
 *  - la barra de ruta inferior en modo "track" (móvil, tablet, movimiento reducido).
 * En modo "lanes", Clawd y su burbuja los dibuja `RouteBuddy` dentro de <main>.
 */
import { motion } from "motion/react";
import { BuddyAvatar } from "@/buddy/BuddyAvatar";
import { viewToSpeech } from "@/buddy/BuddyPanel";
import { useBuddy } from "@/buddy/BuddyProvider";
import { RouteTrack } from "@/buddy/RouteTrack";

export function BuddyHUD() {
  const { stage, view, minimized, setMinimized } = useBuddy();
  if (stage !== "hud") return null;

  return (
    <>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {minimized ? "" : viewToSpeech(view)}
      </p>

      {minimized ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setMinimized(false)}
          className="glass glass-dense fixed right-3 bottom-3 z-50 flex items-center gap-2 rounded-full py-1 pr-4 pl-1 text-sm font-semibold text-fg sm:right-6 sm:bottom-6"
          aria-label="Despertar a Buddy"
        >
          <BuddyAvatar mood="sleep" bare className="size-10" />
          Buddy
        </motion.button>
      ) : (
        <RouteTrack />
      )}
    </>
  );
}
