/**
 * Acceso a localStorage tolerante a fallos: en modo privado, con cookies
 * bloqueadas o en iframes sandbox el accesor puede lanzar. Las preferencias
 * son una comodidad, nunca un requisito para renderizar.
 */
export function readPref<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
}

export function writePref<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* sin persistencia: la preferencia vive solo en esta visita */
  }
}
