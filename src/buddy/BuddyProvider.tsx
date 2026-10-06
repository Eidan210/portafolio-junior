/**
 * Estado global de Buddy. Un único dueño para todo lo que la mascota hace:
 *
 *  - stage     "hero" (grande, en el hero) → "hud" (en su ruta).
 *  - routeMode "lanes": camina por carriles laterales (escritorio ≥ 1280 px con
 *              movimiento) · "track": barra de ruta inferior (móvil, tablet o
 *              movimiento reducido).
 *  - view      qué muestra la burbuja: texto, menú, FAQ, proyecto, tour…
 *  - mood      expresión derivada de la vista + "ambiente" de la sección activa.
 *  - visited   paradas de la ruta alcanzadas; compartido por ruta, menú y nav.
 *  - muted     silencia los comentarios automáticos; lo pedido por el usuario
 *              (clic en un botón) siempre se muestra.
 *  - minimized Buddy duerme en una píldora; no habla solo.
 *
 * Los componentes solo llaman acciones; el texto sale de `data/buddy-script`.
 */
import { MotionConfig } from "motion/react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useActiveSection, useMediaQuery } from "@/lib/hooks";
import { readPref, writePref } from "@/lib/storage";
import type { BuddyMood, SectionId } from "@/lib/types";
import { completion, idleQuips, sectionLines, tour } from "@/data/buddy-script";

export const SECTION_IDS: readonly SectionId[] = ["inicio", "sobre-mi", "stack", "proyectos", "contacto"];

export type BuddyAction = { label: string; run: () => void; primary?: boolean };

export type BuddyView =
  | { type: "text"; text: string; mood: BuddyMood; title?: string; auto?: boolean; actions?: readonly BuddyAction[] }
  | { type: "project"; projectId: string }
  | { type: "menu" }
  | { type: "faq" }
  | { type: "projects" }
  | { type: "contact" }
  | { type: "tour"; index: number };

type Stage = "hero" | "hud";
export type RouteMode = "lanes" | "track";
/** Rectángulo (viewport) del Clawd del hero en el momento de saltar a la ruta. */
export type LaunchRect = { x: number; y: number; w: number; h: number };

type BuddyContextValue = {
  stage: Stage;
  mood: BuddyMood;
  view: BuddyView | null;
  muted: boolean;
  minimized: boolean;
  routeMode: RouteMode;
  /** El sistema pide movimiento reducido (con independencia de lo que eligió el visitante). */
  systemReduced: boolean;
  /** Movimiento reducido efectivo: el del sistema, salvo que el visitante active el completo. */
  reducedMotion: boolean;
  setFullMotion: (v: boolean) => void;
  activeSection: SectionId | null;
  visited: readonly SectionId[];
  completed: boolean;
  /** Marca una parada como alcanzada. Devuelve `true` si es la primera vez. */
  visit: (id: SectionId) => boolean;
  say: (view: BuddyView) => void;
  close: () => void;
  toggleMenu: () => void;
  dock: (from?: LaunchRect | null) => void;
  /** Entrega (una sola vez) el rectángulo desde el que Clawd salta a la ruta. */
  consumeLaunch: () => LaunchRect | null;
  startTour: () => void;
  goTour: (index: number) => void;
  endTour: () => void;
  setMuted: (v: boolean) => void;
  setMinimized: (v: boolean) => void;
  scrollTo: (id: string) => void;
};

const BuddyContext = createContext<BuddyContextValue | null>(null);

export function useBuddy(): BuddyContextValue {
  const ctx = useContext(BuddyContext);
  if (!ctx) throw new Error("useBuddy debe usarse dentro de <BuddyProvider>");
  return ctx;
}

/** Tiempo que Buddy "mueve la boca": proporcional al texto, con techo. */
const talkTime = (chars: number) => Math.min(3600, 400 + chars * 22);

function viewMood(view: BuddyView): BuddyMood {
  switch (view.type) {
    case "text":
      return view.mood;
    case "tour":
      return tour[view.index]?.mood ?? "happy";
    case "faq":
    case "projects":
      return "think";
    case "contact":
      return "love";
    case "menu":
      return "happy";
    case "project":
      return "cool";
  }
}

function viewLength(view: BuddyView): number {
  if (view.type === "text") return view.text.length;
  if (view.type === "tour") return tour[view.index]?.text.length ?? 0;
  if (view.type === "project") return 160;
  return 0;
}

export function BuddyProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>("hero");
  const [view, setView] = useState<BuddyView | null>(null);
  const [talking, setTalking] = useState(false);
  const [ambient, setAmbient] = useState<BuddyMood | null>(null);
  const [muted, setMutedState] = useState(() => readPref("buddy.muted", false));
  const [minimized, setMinimizedState] = useState(() => readPref("buddy.minimized", false));
  const [visited, setVisited] = useState<readonly SectionId[]>([]);
  const activeSection = useActiveSection(SECTION_IDS);

  // Movimiento: se respeta prefers-reduced-motion por defecto, pero el visitante puede
  // optar explícitamente por las animaciones completas desde el menú de Buddy.
  const systemReduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [fullMotion, setFullMotionState] = useState(() => readPref("buddy.fullMotion", false));
  const reducedMotion = systemReduced && !fullMotion;
  const wide = useMediaQuery("(min-width: 1280px)");
  const routeMode: RouteMode = wide && !reducedMotion ? "lanes" : "track";
  const reducedRef = useRef(reducedMotion);
  reducedRef.current = reducedMotion;

  // Clases en <html>: `motion-ok` levanta el freno CSS global y `route-lanes` abre los carriles de `.shell`.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("motion-ok", !reducedMotion);
    root.classList.toggle("route-lanes", routeMode === "lanes");
  }, [reducedMotion, routeMode]);

  const setFullMotion = useCallback((v: boolean) => {
    setFullMotionState(v);
    writePref("buddy.fullMotion", v);
  }, []);

  // Refs espejo: los efectos de scroll/timers leen el valor vigente sin re-suscribirse.
  const viewRef = useRef(view);
  viewRef.current = view;
  const visitedRef = useRef(visited);
  visitedRef.current = visited;
  const talkTimer = useRef<number>(0);
  const ambientTimer = useRef<number>(0);
  const launchRef = useRef<LaunchRect | null>(null);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedRef.current ? "auto" : "smooth", block: "start" });
  }, []);

  const say = useCallback((next: BuddyView) => {
    setView(next);
    window.clearTimeout(talkTimer.current);
    const length = viewLength(next);
    if (length > 0) {
      setTalking(true);
      talkTimer.current = window.setTimeout(() => setTalking(false), talkTime(length));
    } else {
      setTalking(false);
    }
  }, []);

  const close = useCallback(() => {
    window.clearTimeout(talkTimer.current);
    setTalking(false);
    setView(null);
  }, []);

  const toggleMenu = useCallback(() => {
    if (viewRef.current?.type === "menu") close();
    else say({ type: "menu" });
  }, [close, say]);

  const dock = useCallback((from?: LaunchRect | null) => {
    launchRef.current = from ?? null;
    setStage("hud");
  }, []);

  const consumeLaunch = useCallback(() => {
    const r = launchRef.current;
    launchRef.current = null;
    return r;
  }, []);

  const visit = useCallback((id: SectionId) => {
    if (visitedRef.current.includes(id)) return false;
    const next = [...visitedRef.current, id];
    visitedRef.current = next; // dos visitas en el mismo frame no deben duplicarse
    setVisited(next);
    return true;
  }, []);

  const goTour = useCallback(
    (index: number) => {
      const step = tour[index];
      if (!step) return;
      say({ type: "tour", index });
      scrollTo(step.section);
    },
    [say, scrollTo],
  );

  const startTour = useCallback(() => {
    setMinimizedState(false);
    goTour(0);
  }, [goTour]);

  const endTour = useCallback(() => {
    close();
    setAmbient("happy");
  }, [close]);

  const setMuted = useCallback((v: boolean) => {
    setMutedState(v);
    writePref("buddy.muted", v);
  }, []);

  const setMinimized = useCallback(
    (v: boolean) => {
      setMinimizedState(v);
      writePref("buddy.minimized", v);
      if (v) close();
    },
    [close],
  );

  // Narración por scroll: pose de la sección siempre; texto solo si no está silenciado.
  const seen = useRef(new Map<SectionId, number>());
  const dockedIn = useRef<SectionId | null | undefined>(undefined);
  useEffect(() => {
    if (!activeSection || stage === "hero") return;
    // La sección donde Buddy se acopla no se narra: el visitante acaba de leer la bienvenida.
    if (dockedIn.current === undefined) {
      dockedIn.current = activeSection;
      return;
    }
    if (viewRef.current?.type === "tour") return;

    const script = sectionLines[activeSection];
    setAmbient(script.mood);
    window.clearTimeout(ambientTimer.current);
    ambientTimer.current = window.setTimeout(() => setAmbient(null), 3200);

    if (muted || minimized) return;
    const count = seen.current.get(activeSection) ?? 0;
    const line = script.lines[count];
    if (!line) return; // cada frase se dice una vez por visita

    // Debounce: con scroll rápido solo habla la sección donde el visitante se detiene.
    const t = window.setTimeout(() => {
      // Se valida al disparar, no al programar: en 650 ms pudo empezar un tour o abrirse el menú.
      const current = viewRef.current;
      if (current && !(current.type === "text" && current.auto)) return;
      seen.current.set(activeSection, count + 1);
      say({ type: "text", text: line, mood: script.mood, auto: true });
    }, 650);
    return () => window.clearTimeout(t);
  }, [activeSection, stage, muted, minimized, say]);

  // Ruta completada (5/5): una sola vez por visita. Lo pedido por el usuario no se pisa.
  const completed = visited.length === SECTION_IDS.length;
  useEffect(() => {
    if (!completed) return;
    setAmbient("happy");
    window.clearTimeout(ambientTimer.current);
    ambientTimer.current = window.setTimeout(() => setAmbient(null), 2600);
    if (muted || minimized) return;
    const t = window.setTimeout(() => {
      const current = viewRef.current;
      if (current && !(current.type === "text" && current.auto)) return;
      say({ ...completion, type: "text", auto: true, actions: [{ label: "Escribirle", run: () => scrollTo("contacto") }] });
    }, 900);
    return () => window.clearTimeout(t);
    // Solo al completar: cambios posteriores de muted/minimized no deben repetir el mensaje.
  }, [completed]);

  // Visitante inactivo 40 s: una frase suelta, como mucho una vez por cada quip.
  const quipIndex = useRef(0);
  useEffect(() => {
    if (stage === "hero" || muted || minimized) return;
    let timer = 0;
    const arm = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        const quip = idleQuips[quipIndex.current];
        if (!quip || viewRef.current) return;
        quipIndex.current += 1;
        say({ type: "text", text: quip, mood: "idle", auto: true });
      }, 40_000);
    };
    arm();
    const events = ["pointermove", "scroll", "keydown"] as const;
    events.forEach((e) => window.addEventListener(e, arm, { passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, arm));
    };
  }, [stage, muted, minimized, say]);

  // Escape cierra la burbuja desde cualquier punto de la página.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && viewRef.current) close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(
    () => () => {
      window.clearTimeout(talkTimer.current);
      window.clearTimeout(ambientTimer.current);
    },
    [],
  );

  const mood: BuddyMood = minimized ? "sleep" : talking ? "talk" : view ? viewMood(view) : (ambient ?? "idle");

  const value = useMemo<BuddyContextValue>(
    () => ({
      stage,
      mood,
      view,
      muted,
      minimized,
      routeMode,
      systemReduced,
      reducedMotion,
      setFullMotion,
      activeSection,
      visited,
      completed,
      visit,
      say,
      close,
      toggleMenu,
      dock,
      consumeLaunch,
      startTour,
      goTour,
      endTour,
      setMuted,
      setMinimized,
      scrollTo,
    }),
    [
      stage,
      mood,
      view,
      muted,
      minimized,
      routeMode,
      systemReduced,
      reducedMotion,
      setFullMotion,
      activeSection,
      visited,
      completed,
      visit,
      say,
      close,
      toggleMenu,
      dock,
      consumeLaunch,
      startTour,
      goTour,
      endTour,
      setMuted,
      setMinimized,
      scrollTo,
    ],
  );

  return (
    <BuddyContext.Provider value={value}>
      {/* Motion sigue la preferencia efectiva, no solo la del sistema. */}
      <MotionConfig reducedMotion={reducedMotion ? "always" : "never"}>{children}</MotionConfig>
    </BuddyContext.Provider>
  );
}
