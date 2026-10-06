/**
 * Perfil personal. Fuente: CV `CV-Eidan-Carreno.pdf` y `Portafolio v3/data`
 * (verificado 2026-09-23). Sin LinkedIn: confirmado por Eidan, se omite a
 * propósito — el CTA del hero no lo muestra.
 */
import type { CodeEntry, Milestone, Principle } from "@/lib/types";

export const profile = {
  name: "Eidan Alexander Carreño",
  shortName: "Eidan Carreño",
  firstName: "Eidan",
  role: "Desarrollador de Software Junior",
  headline: "Software que funciona,",
  headlineAccent: "detalles que se notan.",
  tagline: "Automatización con IA, Python y JavaScript",
  location: "Floridablanca, Santander — Colombia",
  email: "eidanalexander210@gmail.com",
  githubUser: "Eidan210",
  github: "https://github.com/Eidan210",
  // Misma ruta que el sitio anterior: los enlaces ya compartidos al CV siguen funcionando.
  cv: "./cv/CV-Eidan-Carreno.pdf",
  availability: "Disponible para roles Junior · Pasantías · Proyectos",
  valueProp:
    "Construyo automatizaciones con IA sobre n8n, aplicaciones modulares en Python y aplicaciones web que consumen APIs REST. Prefiero lo nativo antes que una dependencia, y el porqué antes que el cómo.",
  bio: [
    "Mi perfil se construyó dentro de Campuslands, un programa intensivo donde cada módulo se aprueba entregando software que funciona, no teoría. Cuatro de cuatro módulos aprobados al 100 %, cada uno con su repositorio y su historial de commits.",
    "Trabajo con Python, JavaScript, HTML, CSS y SQL, y me muevo con soltura entre bases de datos, APIs y automatización de flujos. Me interesa el detalle: el error que nadie encuentra, el contraste que no pasa AA, la entrega que sí llega a tiempo.",
  ],
  objective:
    "Seguir creciendo como desarrollador, entrar en proyectos que me obliguen a aprender y aportar mientras consolido bases de datos relacionales, metodologías ágiles y testing automatizado.",
} as const;

/**
 * Ficha del hero escrita como objeto TypeScript (`ProfileCode`), visible cuando
 * Buddy salta a su ruta. Mismos datos que el CV; valores cortos para que cada
 * línea quepa en 360 px sin scroll horizontal.
 */
export const profileCode: readonly CodeEntry[] = [
  { key: "rol", label: "Rol", value: "Dev Junior" },
  { key: "base", label: "Ubicación", value: "Floridablanca, CO" },
  { key: "campuslands", label: "Módulos de Campuslands", value: "4/4 al 100 %" },
  { key: "repos", label: "Repositorios públicos", value: 24, comment: "públicos" },
  { key: "contribuciones", label: "Contribuciones en el último año", value: 269, comment: "último año" },
  { key: "ingles", label: "Inglés", value: "B2 → C1" },
  { key: "disponible", label: "Disponible", value: true, live: true },
];

/** Filosofía de trabajo: qué hago, no qué adjetivo soy. */
export const principles: readonly Principle[] = [
  {
    area: "Resolución sistemática",
    claim: "Diagnóstico antes que parche",
    detail:
      "No toco una línea hasta reproducir el fallo. Aíslo la causa real, corrijo el origen —no el síntoma— y compruebo que el caso que rompía ahora pasa.",
  },
  {
    area: "Agile / Scrum",
    claim: "Entrego en incrementos",
    detail:
      "Divido el trabajo en sprints y backlog, priorizando entregas parciales publicables. Commits atómicos antes que un volcado al final del sprint.",
  },
  {
    area: "Documentación",
    claim: "Escribo el porqué",
    detail:
      "README que explica la decisión tomada, no solo cómo se instala. Conventional Commits para que el historial se lea como un changelog.",
  },
  {
    area: "Ownership",
    claim: "Reviso lo que ya funciona",
    detail:
      "Una versión que funciona no es el final: CampusTech v2.0 nació de reescribir mi propia v1 monolítica en módulos de responsabilidad única.",
  },
];

export const timeline: readonly Milestone[] = [
  {
    period: "2026 — Actualidad",
    title: "Formación práctica en Desarrollo de Software",
    org: "Campuslands · Floridablanca",
    detail: "Cuatro de cuatro módulos aprobados al 100 %: algoritmia, frontend, backend con Python y Git.",
  },
  {
    period: "2026",
    title: 'Reto "Si yo fuera el CEO"',
    org: "Campuslands",
    detail: "Mano derecha del líder: coordinación de 5 personas, dossier de propuesta y pitch de 8 minutos ante jurado.",
  },
  {
    period: "2025",
    title: "Certificado B2 en Inglés",
    org: "Celai Institute",
    detail: "Actualmente cursando nivel C1. Leo documentación técnica en inglés a diario.",
  },
  {
    period: "2023 — 2025",
    title: "Técnico en Sistemas Teleinformáticos",
    org: "SENA",
    detail: "Fundamentos de redes, sistemas y soporte teleinformático.",
  },
];
