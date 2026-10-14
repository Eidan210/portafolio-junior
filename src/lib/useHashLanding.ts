/**
 * Enlaces a una sección (`…/#proyectos`, también la recarga al cambiar de
 * idioma): el navegador intenta el salto antes de que React pinte las
 * secciones y la página se queda arriba. Tras el primer render se salta a la
 * sección, y se corrige al terminar la carga y las fuentes (pueden mover el
 * layout), salvo que el visitante ya haya movido la página por su cuenta.
 */
import { useEffect } from "react";
import { jumpTo, scrollTopFor, watchScrollIntent } from "@/lib/scroll";

export function useHashLanding(): void {
  useEffect(() => {
    const raw = window.location.hash.slice(1);
    let id = raw;
    try {
      id = decodeURIComponent(raw);
    } catch {
      // Un hash mal escapado (`#%`) lanzaría URIError en el montaje y dejaría la página en blanco.
    }
    if (!id || id === "inicio") return;
    let userMoved = false;
    let active = true;
    const stopWatching = watchScrollIntent(() => {
      userMoved = true;
    });
    const land = () => {
      const el = document.getElementById(id);
      if (active && el && !userMoved) jumpTo(scrollTopFor(el));
    };
    const frame = requestAnimationFrame(land);
    window.addEventListener("load", land, { once: true });
    void document.fonts?.ready.then(land);
    return () => {
      active = false;
      cancelAnimationFrame(frame);
      window.removeEventListener("load", land);
      stopWatching();
    };
  }, []);
}
