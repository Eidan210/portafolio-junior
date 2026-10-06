/**
 * Guion de Buddy. Todo lo que la mascota dice vive aquí: los componentes solo
 * deciden cuándo hablar, nunca qué decir. Las frases se apoyan en datos de
 * `profile.ts`, `projects.ts` y `skills.ts`; no añaden hechos nuevos.
 */
import { techs } from "@/data/skills";
import type { BuddyMood, FaqEntry, SectionId } from "@/lib/types";

export const welcome = {
  title: "¡Hola! Soy Buddy 👋",
  body: "Soy el guía de este portafolio. Eidan es desarrollador de software junior: automatiza procesos con IA, construye en Python y JavaScript, y cuida los detalles. ¿Te lo enseño en un recorrido de un minuto?",
} as const;

type SectionLine = { mood: BuddyMood; lines: readonly string[] };

/** Comentarios al entrar en cada sección por scroll. Rotan para no repetirse. */
export const sectionLines: Record<SectionId, SectionLine> = {
  inicio: {
    mood: "wave",
    lines: ["De vuelta al inicio. Si quieres, puedo hacerte el tour guiado desde aquí."],
  },
  "sobre-mi": {
    mood: "talk",
    lines: [
      "Aquí está su forma de trabajar: diagnóstico antes que parche, y siempre el porqué de cada decisión.",
      "Un dato: aprobó 4 de 4 módulos de Campuslands al 100 %, cada uno con su repo y su historial de commits.",
    ],
  },
  stack: {
    mood: "coding",
    lines: [
      `Su inventario: ${techs.length} tecnologías. Pulsa cualquiera y te digo para qué la usa y en qué proyecto se ve.`,
      "Su fuerte es la automatización: n8n + Gemini orquestando Sheets, Gmail y Telegram.",
    ],
  },
  proyectos: {
    mood: "cool",
    lines: [
      "¡Mi parte favorita! Pulsa \"¿Qué dice Buddy?\" en cualquier tarjeta y te explico el reto técnico.",
      "Empieza por la Preselección con IA: es el proyecto más completo de punta a punta.",
    ],
  },
  contacto: {
    mood: "love",
    lines: [
      "¿Te convenció? Escríbele: está disponible para roles junior, pasantías y proyectos.",
    ],
  },
};

export type TourStep = { section: SectionId; mood: BuddyMood; text: string };

export const tour: readonly TourStep[] = [
  {
    section: "inicio",
    mood: "wave",
    text: "Empezamos. Eidan Carreño, de Floridablanca (Colombia): automatización con IA, Python y JavaScript.",
  },
  {
    section: "sobre-mi",
    mood: "talk",
    text: "Su filosofía: reproducir el fallo antes de tocar código, entregar en incrementos y documentar el porqué.",
  },
  {
    section: "stack",
    mood: "coding",
    text: "Cinco frentes: Frontend, Backend en Python, Bases de Datos, Automatización con IA y Herramientas de flujo.",
  },
  {
    section: "proyectos",
    mood: "cool",
    text: "Seis proyectos reales, cada uno con su repositorio. Pulsa \"¿Qué dice Buddy?\" en cualquiera y te lo desgloso.",
  },
  {
    section: "contacto",
    mood: "love",
    text: "¡Y eso es todo! Si encaja con tu equipo, aquí lo tienes a un clic. Yo me quedo en la esquina por si me necesitas.",
  },
];

export const faq: readonly FaqEntry[] = [
  {
    q: "¿Está disponible?",
    a: "Sí: busca roles junior, pasantías o proyectos. Está en Floridablanca, Santander (Colombia).",
  },
  {
    q: "¿Cuál es su fuerte?",
    a: "La automatización con IA: flujos en n8n donde Gemini evalúa documentos y el resultado se reparte entre Sheets, Gmail y Telegram, con un humano decidiendo al final.",
  },
  {
    q: "¿Qué está aprendiendo?",
    a: "Consolida bases de datos relacionales y testing automatizado, y cursa inglés C1 (ya tiene B2 certificado).",
  },
  {
    q: "¿Trabaja en equipo?",
    a: 'En el reto "Si yo fuera el CEO" fue mano derecha del líder: coordinó a 5 personas en un dossier y un pitch de 8 minutos.',
  },
];

export const skillsSummary =
  "En corto: JavaScript y Python como lenguajes base, PostgreSQL y SQL para datos, n8n + Gemini para automatizar, y Git con Conventional Commits para que todo quede trazable.";

/** Frases para cuando el visitante hace clic en Buddy repetidamente o se queda quieto. */
export const idleQuips: readonly string[] = [
  "Sigo aquí. Haz clic en mí si necesitas algo.",
  "¿Sabías que este portafolio respeta prefers-reduced-motion? Eidan cuida esos detalles.",
  "Psst… el proyecto de Mym Designsx tiene demo en vivo.",
];

/** Al completar las 5 paradas de la ruta. */
export const completion = {
  mood: "happy",
  title: "¡Ruta completada! 5/5",
  text: "Recorriste el portafolio de punta a punta. Si Eidan encaja con tu equipo, está a un mensaje de distancia.",
} as const satisfies { mood: BuddyMood; title: string; text: string };

/** "Sorpréndeme" del menú: datos curiosos sacados de profile.ts y projects.ts. */
export const surprises: readonly string[] = [
  "CampusTech v2.0 nació de reescribir su propia v1 monolítica en 5 módulos de responsabilidad única.",
  "La preselección con IA guarda 13 datos por candidato… y la decisión final siempre la toma una persona.",
  "El buscador de videojuegos pesa 9,7 KB en total. Sin librerías.",
  "Mym Designsx tiene demo en vivo: una tienda completa en JavaScript vanilla con n8n de backend.",
  "En el reto \"Si yo fuera el CEO\" coordinó a 5 personas y defendió un pitch de 8 minutos.",
  "Aprobó 4 de 4 módulos de Campuslands al 100 %, cada uno con su repo y su historial de commits.",
];

export const contactThanks = "¡Listo! Se abrió tu cliente de correo con el mensaje preparado: solo falta pulsar enviar.";
export const copiedEmail = "Email copiado al portapapeles. 📋";
