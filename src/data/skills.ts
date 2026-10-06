/**
 * Stack técnico. Fuente: lista de tecnologías del portafolio original de Eidan
 * (`Portafolio Eidan/index.html`, sección "Stack técnico"), adaptada a este
 * portafolio: cada tecnología declara para qué se usa y su evidencia se cruza
 * con `projects.ts` (`match`), así no se duplica ni se desincroniza.
 *
 * Las notas de GitHub salen del snapshot `Portafolio v3/data/github.json`
 * (2026-09-23): 24 repos públicos, 269 contribuciones, 8 repos de sitios
 * HTML/CSS. Java no tiene repositorio público y se dice tal cual.
 */
import { projects } from "@/data/projects";
import type { Project, Tech, TechCategory } from "@/lib/types";

export const categories: readonly { id: TechCategory; label: string; tag: string }[] = [
  { id: "lenguajes", label: "Lenguajes & Frontend", tag: "Lenguaje" },
  { id: "datos", label: "Datos & APIs", tag: "Datos" },
  { id: "automatizacion", label: "Automatización & IA", tag: "IA" },
  { id: "workflow", label: "Workflow", tag: "Workflow" },
];

export const techs: readonly Tech[] = [
  {
    id: "python",
    name: "Python",
    icon: "python",
    category: "lenguajes",
    role: "Aplicaciones modulares de responsabilidad única",
    brand: "#4B8BBE",
    match: ["Python"],
    capacities: ["Estructuras de datos: listas y diccionarios", "Validación y errores con try / except"],
  },
  {
    id: "javascript",
    name: "JavaScript",
    icon: "javascript",
    category: "lenguajes",
    role: "Interactividad, DOM y consumo de APIs",
    brand: "#F0DB4F",
    match: ["JavaScript", "JavaScript ES6+"],
    capacities: ["Módulos ES6+ y async/await", "Render dinámico del DOM sin frameworks"],
  },
  {
    id: "java",
    name: "Java",
    icon: "java",
    category: "lenguajes",
    role: "Programación orientada a objetos",
    brand: "#E8544A",
    note: "Sin repositorio público todavía",
  },
  {
    id: "html5",
    name: "HTML5",
    icon: "html5",
    category: "lenguajes",
    role: "Estructura semántica y accesible",
    brand: "#F06529",
    match: ["HTML5"],
    note: "+8 sitios HTML/CSS en GitHub",
  },
  {
    id: "css3",
    name: "CSS3",
    icon: "css3",
    category: "lenguajes",
    role: "Layout con Flexbox y Grid, y sistemas visuales",
    brand: "#4C93FF",
    match: ["CSS3"],
    note: "+8 sitios HTML/CSS en GitHub",
    capacities: ["Diseño responsive mobile-first", "Animaciones con transform y opacity"],
  },
  {
    id: "sql",
    name: "SQL",
    icon: "sql",
    category: "datos",
    role: "Consultas y modelado relacional",
    brand: "#E0AF68",
    match: ["PostgreSQL"],
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    icon: "postgresql",
    category: "datos",
    role: "Base de datos relacional detrás de flujos n8n",
    brand: "#7FA9DB",
    match: ["PostgreSQL"],
  },
  {
    id: "api",
    name: "APIs REST",
    icon: "api",
    category: "datos",
    role: "Integración vía Fetch con control de errores",
    brand: "#9ECE6A",
    match: ["APIs REST"],
    capacities: ["Validar el estado HTTP, no solo la petición"],
  },
  {
    id: "json",
    name: "JSON",
    icon: "json",
    category: "datos",
    role: "Persistencia local e intercambio de datos",
    brand: "#C3CAD9",
    match: ["JSON"],
  },
  {
    id: "n8n",
    name: "n8n",
    icon: "n8n",
    category: "automatizacion",
    role: "Orquestación de flujos multi-servicio",
    brand: "#EA4B71",
    match: ["n8n"],
    capacities: ["Sheets, Gmail y Telegram en un mismo flujo"],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    icon: "gemini",
    category: "automatizacion",
    role: "IA que evalúa documentos dentro del flujo",
    brand: "#9B8AFB",
    match: ["Google Gemini"],
    capacities: ["Human-in-the-loop: la IA propone, la persona decide"],
  },
  {
    id: "git",
    name: "Git",
    icon: "git",
    category: "workflow",
    role: "Ramas, commits atómicos e historial limpio",
    brand: "#F05033",
    note: "Conventional Commits",
  },
  {
    id: "github",
    name: "GitHub",
    icon: "github",
    category: "workflow",
    role: "Publicación y revisión",
    brand: "#E4E7EE",
    note: "24 repos públicos · 269 contribuciones",
  },
  {
    id: "vscode",
    name: "VS Code",
    icon: "vscode",
    category: "workflow",
    role: "Entorno de desarrollo diario",
    brand: "#3B9EEA",
    note: "Herramienta de cada día",
  },
];

/** Capacidades transversales (antes repartidas en tarjetas sueltas del portafolio original). */
export const capacities = [
  "Manipulación del DOM",
  "Diseño responsive mobile-first",
  "Estructuras de datos",
  "Validación y manejo de errores",
  "Algoritmia",
  "Arquitectura modular",
] as const;

/** En consolidación: se declara aparte para no venderlo como dominio. */
export const learning = ["Bases de datos relacionales", "Testing automatizado", "Inglés C1"] as const;

/** Proyectos destacados donde se usó la tecnología: es su evidencia. */
export function projectsFor(tech: Tech): Project[] {
  const keys = new Set((tech.match ?? []).map((m) => m.toLowerCase()));
  return projects.filter((p) => p.stack.some((s) => keys.has(s.toLowerCase())));
}
