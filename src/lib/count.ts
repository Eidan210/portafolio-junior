/**
 * Métricas que cuentan desde 0 al aparecer ("25", "65 %", "9,7 KB"). Aquí
 * solo el análisis y el formato, puros: `node --test` los carga tal cual. Lo
 * que no es un número limpio ("v2.0") no se anima y se muestra como está.
 */

export type CountableMetric = {
  value: number;
  decimals: number;
  /** Separador decimal del original: los datos usan coma ("9,7 KB"). */
  separator: "," | "." | "";
  /** Lo que sigue al número, con su espacio ("65 %", "111 KB"). */
  suffix: string;
};

const METRIC_RE = /^(\d+)(?:([.,])(\d+))?(\s?(?:%|KB|MB))?$/;

export function parseMetric(raw: string): CountableMetric | null {
  const m = METRIC_RE.exec(raw.trim());
  if (!m) return null;
  const [, int = "", sep, frac = "", suffix = ""] = m;
  return {
    value: Number(`${int}.${frac || "0"}`),
    decimals: frac.length,
    separator: sep === "," || sep === "." ? sep : "",
    suffix,
  };
}

/** Formatea un valor intermedio con los decimales y el separador del original. */
export function formatMetric(n: number, metric: CountableMetric): string {
  const fixed = n.toFixed(metric.decimals);
  return `${metric.separator === "," ? fixed.replace(".", ",") : fixed}${metric.suffix}`;
}
