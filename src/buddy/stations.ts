/**
 * Paradas de la ruta = secciones de la página. Una sola fuente para la ruta de
 * carriles, la barra móvil, el menú de Buddy y la navegación.
 */
import { SECTION_IDS } from "@/buddy/BuddyProvider";
import type { SectionId } from "@/lib/types";

export const STATION_LABELS: Record<SectionId, string> = {
  inicio: "Inicio",
  "sobre-mi": "Sobre mí",
  stack: "Stack",
  proyectos: "Proyectos",
  contacto: "Contacto",
};

/** "01", "02"…: el número de parada tal como se ve en la ruta. */
export const stationNumber = (id: SectionId) => String(SECTION_IDS.indexOf(id) + 1).padStart(2, "0");
