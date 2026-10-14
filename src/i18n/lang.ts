/**
 * Idioma del sitio (es | en). Se decide una vez al cargar la página: `?lang=`
 * en la URL (enlace compartible), luego la preferencia guardada y por último el
 * idioma del navegador (español → es; cualquier otro → en). Los módulos de
 * `src/data` eligen su versión al importarse con `pick`, y cambiar de idioma
 * recarga la página: ningún componente necesita estado de idioma.
 *
 * Sin alias `@/` ni APIs de Vite: lo importan módulos que `node --test` carga
 * tal cual. En Node no hay `window` y el idioma es siempre español.
 */
export type Lang = "es" | "en";

const PREF = "portafolio.lang";
const SKIP_INTRO = "portafolio.skip-intro";

const isLang = (v: unknown): v is Lang => v === "es" || v === "en";

/** Regla de detección, pura para poder testearla. */
export function detectLang(env: { search?: string; saved?: string | null; languages?: readonly string[] }): Lang {
  const fromUrl = new URLSearchParams(env.search ?? "").get("lang");
  if (isLang(fromUrl)) return fromUrl;
  if (isLang(env.saved)) return env.saved;
  const first = env.languages?.find(Boolean) ?? "es";
  return first.toLowerCase().startsWith("es") ? "es" : "en";
}

function readSaved(): string | null {
  try {
    return window.localStorage.getItem(PREF);
  } catch {
    return null;
  }
}

/** Idioma de esta carga de página. */
export const lang: Lang =
  typeof window === "undefined"
    ? "es"
    : detectLang({
        search: window.location.search,
        saved: readSaved(),
        languages: navigator.languages?.length ? navigator.languages : [navigator.language],
      });

/** La versión del idioma activo. */
export function pick<T>(versions: { es: T; en: T }): T {
  return versions[lang];
}

/**
 * Tras cambiar de idioma la intro de escritorio no se repite. Se lee una sola
 * vez por carga (a nivel de módulo): con StrictMode, un inicializador de estado
 * que lo consumiera se ejecutaría dos veces.
 */
export const skipIntro: boolean =
  typeof window !== "undefined" &&
  (() => {
    try {
      const skip = window.sessionStorage.getItem(SKIP_INTRO) === "1";
      window.sessionStorage.removeItem(SKIP_INTRO);
      return skip;
    } catch {
      return false;
    }
  })();

/** Cambia de idioma: guarda la preferencia y recarga en la misma sección con `?lang=`. */
export function switchLang(next: Lang, section?: string | null): void {
  if (next === lang) return;
  try {
    window.localStorage.setItem(PREF, next);
    window.sessionStorage.setItem(SKIP_INTRO, "1");
  } catch {
    /* sin almacenamiento: el idioma viaja igual en la URL */
  }
  const url = new URL(window.location.href);
  url.searchParams.set("lang", next);
  if (section) url.hash = section;
  window.location.assign(url);
}
