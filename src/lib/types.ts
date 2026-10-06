/**
 * Contratos de datos. `src/data/` los implementa; los componentes solo
 * consumen estos tipos, nunca literales de contenido.
 */

export type Metric = { value: string; label: string };

export type Project = {
  /** Clave estable (slug) usada por Buddy y por el selector de proyectos. */
  id: string;
  title: string;
  /** Nombre real del repositorio en GitHub. */
  repo: string;
  summary: string;
  stack: readonly string[];
  metrics: readonly Metric[];
  repoUrl: string;
  /** Demo desplegada; si falta, la tarjeta no muestra ese CTA. */
  demoUrl?: string;
  /** Captura en /public/proyectos. Sin imagen se dibuja una vista previa generativa. */
  image?: string;
  /** Etiqueta corta del badge. */
  category: string;
  /** Lo que Buddy cuenta al pulsar "¿Qué dice Buddy?". */
  buddy: ProjectBreakdown;
};

export type ProjectBreakdown = {
  challenge: string;
  architecture: string;
  takeaway: string;
};

export type TechIconId =
  | "python"
  | "javascript"
  | "java"
  | "html5"
  | "css3"
  | "sql"
  | "postgresql"
  | "api"
  | "json"
  | "n8n"
  | "gemini"
  | "git"
  | "github"
  | "vscode";

export type TechCategory = "lenguajes" | "datos" | "automatizacion" | "workflow";

export type Tech = {
  id: string;
  name: string;
  icon: TechIconId;
  category: TechCategory;
  /** Para qué la uso, en una línea. */
  role: string;
  /** Color de marca: logo y brillo al pasar el cursor. Ajustado para fondo oscuro. */
  brand: string;
  /** Nombres en `Project.stack` que cuentan como uso real (evidencia). */
  match?: readonly string[];
  /** Evidencia fuera de los proyectos destacados, o su ausencia dicha con honestidad. */
  note?: string;
  /** Capacidades concretas que acompañan a la tecnología. */
  capacities?: readonly string[];
};

export type Principle = { area: string; claim: string; detail: string };

export type Milestone = { period: string; title: string; org: string; detail: string };

export type SectionId = "inicio" | "sobre-mi" | "stack" | "proyectos" | "contacto";

/** Estados de ánimo de Buddy. Cada uno se mapea a una secuencia de fotogramas de Clawd. */
export type BuddyMood =
  | "idle"
  | "wave"
  | "talk"
  | "think"
  | "happy"
  | "surprised"
  | "sleep"
  | "coding"
  | "love"
  | "cool"
  | "dizzy"
  | "sad";

export type FaqEntry = { q: string; a: string };
