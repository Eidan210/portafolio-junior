import { useEffect, useState, useSyncExternalStore } from "react";
import type { SectionId } from "@/lib/types";

/** Media query reactiva, segura en el primer render. */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Puntero fino con hover real: los efectos de tilt y magnetismo solo tienen sentido ahí. */
export const useFinePointer = () => useMediaQuery("(hover: hover) and (pointer: fine)");

/**
 * Sección dominante en pantalla. Una franja horizontal en el 40 % superior del
 * viewport decide cuál está "activa": evita que dos secciones cortas compitan.
 */
export function useActiveSection(ids: readonly SectionId[]): SectionId | null {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as SectionId);
        }
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}
