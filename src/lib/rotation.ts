/**
 * Rotación por visita: las entradas de Clawd y los saludos de la intro
 * avanzan un paso en cada carga de página, guardando el índice en
 * `localStorage`, para que quien vuelve vea otra variante.
 *
 * Cada clave se elige una sola vez por carga. StrictMode (desarrollo) invoca
 * dos veces los inicializadores de `useState`, y sin esta memoria la rotación
 * avanzaba de dos en dos: en escritorio solo se veía la mitad de las entradas.
 *
 * Sin imports de Vite ni alias `@/`: `node --test` carga el módulo tal cual.
 */

/** Dónde se guarda el último índice; sustituible en los tests. */
export type IndexStore = {
  read(key: string): unknown;
  write(key: string, value: number): void;
};

/** Devuelve el índice que toca para `key` en una lista de `length` variantes. */
export type Rotation = (key: string, length: number, forced?: number | null) => number;

export function createRotation(store: IndexStore): Rotation {
  const chosen = new Map<string, number>();
  return (key, length, forced) => {
    const picked = chosen.get(key);
    if (picked !== undefined) return picked;
    let index: number;
    if (forced != null && Number.isInteger(forced) && forced >= 0 && forced < length) {
      // Forzada por URL (`?entrada=`): se muestra sin consumir un paso del ciclo.
      index = forced;
    } else {
      const prev = store.read(key);
      // Un valor corrupto o de una lista más larga no rompe el ciclo: vuelve a empezar o se ajusta.
      const base = typeof prev === "number" && Number.isInteger(prev) && prev >= 0 ? prev : -1;
      index = length > 0 ? (base + 1) % length : 0;
      store.write(key, index);
    }
    chosen.set(key, index);
    return index;
  };
}
