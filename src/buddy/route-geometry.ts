/**
 * Geometría pura de la ruta de Clawd (sin DOM): recibe las cajas de las
 * secciones y los carriles, y devuelve una polilínea densa con todo lo que el
 * bucle de animación necesita consultar en O(log n) por frame.
 *
 * Forma de la ruta:
 *   - un tramo por sección, alternando carril derecho / izquierdo, con estilo
 *     variable: onda suave, zigzag (camino de montaña) o saltos rebotando;
 *   - entre secciones, un cruce en arco por el hueco vacío del padding, donde
 *     Clawd da una voltereta.
 *
 * Los saltos y el arco de los cruces hacen que `y` no sea monótona; la búsqueda
 * por altura usa `ymax` (máximo acumulado), que sí lo es.
 */
import type { SectionId } from "@/lib/types";

export type Side = "left" | "right";
export type LaneStyle = "wave" | "zigzag" | "hops";

export type SectionBox = { id: SectionId; top: number; bottom: number };
export type Lanes = { left: number; right: number; amp: number };
export type Station = { id: SectionId; index: number; len: number; x: number; y: number; side: Side };

export type Route = {
  x: Float32Array;
  y: Float32Array;
  len: Float32Array;
  ymax: Float32Array;
  /** Grados de voltereta en cada punto (solo distinto de 0 dentro de un cruce). */
  flip: Float32Array;
  /** 1 si el punto pertenece a un cruce entre carriles. */
  cross: Uint8Array;
  /** "Esfuerzo" acumulado: como `len`, pero los cruces pesan CROSS_EFFORT. Reparte el tiempo del guiado. */
  effort: Float32Array;
  total: number;
  stations: Station[];
  /** Rangos de longitud [inicio, fin] de cada cruce. */
  crossings: Array<[number, number]>;
  /** Trazo SVG (submuestreado) de la ruta completa. */
  d: string;
  end: { x: number; y: number };
};

type P = { x: number; y: number; flip: number; cross: 0 | 1 };

/** Separación objetivo entre puntos (px). */
const STEP = 4;
/** Distancia de las paradas al borde superior de su sección; cae dentro del padding (96 px). */
const STATION_INSET = 44;
/** Estilo de tramo por sección, en orden. */
const STYLES: readonly LaneStyle[] = ["wave", "zigzag", "hops", "wave", "zigzag"];
/**
 * Peso de los cruces en el esfuerzo. Un cruce son ~1500 px de ruta casi en
 * horizontal para ~90 px de scroll: a ritmo de carril la cámara se quedaría
 * parada mientras Clawd cruza. Con 0.2 lo salta de una voltereta rápida.
 */
const CROSS_EFFORT = 0.2;

const smooth = (u: number) => u * u * (3 - 2 * u);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function lane(style: LaneStyle, x0: number, y1: number, y2: number, amp: number): P[] {
  const dy = y2 - y1;
  if (dy <= 1) return [{ x: x0, y: y1, flip: 0, cross: 0 }];
  const pts: P[] = [];

  if (style === "hops") {
    // Saltitos: |sin| da cúspides en el "suelo" y arcos en el aire, como una pelota bajando escalones.
    const hops = Math.max(2, Math.round(dy / 150));
    const h = Math.min(64, (dy / hops) * 0.5);
    const n = Math.ceil((dy + hops * h * 2) / STEP);
    for (let i = 0; i <= n; i++) {
      const u = i / n;
      pts.push({
        x: x0 + amp * 0.4 * Math.sin(Math.PI * u) * Math.sin(Math.PI * hops * u),
        y: y1 + u * dy - h * Math.abs(Math.sin(Math.PI * hops * u)),
        flip: 0,
        cross: 0,
      });
    }
    return pts;
  }

  if (style === "zigzag") {
    // Camino de montaña: esquinas alternas cada ~90 px, con amplitud nula en los extremos.
    const n = Math.max(2, Math.round(dy / 90));
    const corners = Array.from({ length: n + 1 }, (_, k) => {
      const u = k / n;
      return { x: x0 + (k % 2 ? 1 : -1) * amp * Math.sin(Math.PI * u), y: y1 + u * dy };
    });
    for (let k = 0; k < n; k++) {
      const a = corners[k]!;
      const b = corners[k + 1]!;
      const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / STEP));
      for (let i = k === 0 ? 0 : 1; i <= steps; i++) {
        const t = i / steps;
        pts.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, flip: 0, cross: 0 });
      }
    }
    return pts;
  }

  // Onda: seno con envolvente para que el tramo empiece y termine centrado en el carril.
  const n = Math.ceil(dy / STEP);
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    pts.push({ x: x0 + amp * Math.sin(Math.PI * u) * Math.sin((2 * Math.PI * u * dy) / 260), y: y1 + u * dy, flip: 0, cross: 0 });
  }
  return pts;
}

/** Cruce entre carriles: arco por encima del hueco entre secciones con voltereta en el tercio central. */
function crossing(x1: number, y1: number, x2: number, y2: number): P[] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const hump = Math.min(36, Math.max(12, dy * 0.45));
  const n = Math.ceil((Math.abs(dx) + Math.abs(dy) + hump * 2) / STEP);
  const pts: P[] = [];
  for (let i = 1; i <= n; i++) {
    const u = i / n;
    pts.push({
      x: x1 + dx * smooth(u),
      y: y1 + dy * u - hump * Math.sin(Math.PI * u),
      flip: 360 * smooth(clamp01((u - 0.32) / 0.36)),
      cross: 1,
    });
  }
  return pts;
}

export function buildRoute(sections: readonly SectionBox[], lanes: Lanes, startY: number): Route | null {
  if (!sections.length) return null;
  const pts: P[] = [];
  const marks: { id: SectionId; index: number; at: number; x: number; y: number; side: Side }[] = [];
  const crossIdx: Array<[number, number]> = [];

  sections.forEach((s, i) => {
    const side: Side = i % 2 === 0 ? "right" : "left";
    const x = side === "right" ? lanes.right : lanes.left;
    const last = i === sections.length - 1;
    // El hero arranca donde cae el ancla con scroll 0: Clawd aparece ya en su parada.
    const y1 = i === 0 ? Math.min(startY, s.bottom - 160) : s.top + STATION_INSET;
    const y2 = Math.max(y1, last ? s.bottom - 40 : s.bottom - STATION_INSET);
    const prev = pts[pts.length - 1];
    if (prev) {
      const from = pts.length;
      pts.push(...crossing(prev.x, prev.y, x, y1));
      crossIdx.push([from, pts.length - 1]);
    }
    marks.push({ id: s.id, index: i, at: pts.length, x, y: y1, side });
    pts.push(...lane(STYLES[i % STYLES.length]!, x, y1, y2, lanes.amp));
  });

  const n = pts.length;
  const x = new Float32Array(n);
  const y = new Float32Array(n);
  const len = new Float32Array(n);
  const ymax = new Float32Array(n);
  const flip = new Float32Array(n);
  const cross = new Uint8Array(n);
  const effort = new Float32Array(n);
  let acc = 0;
  let work = 0;
  let top = -Infinity;
  let d = "";
  for (let i = 0; i < n; i++) {
    const p = pts[i]!;
    if (i > 0) {
      const q = pts[i - 1]!;
      const seg = Math.hypot(p.x - q.x, p.y - q.y);
      acc += seg;
      work += p.cross ? seg * CROSS_EFFORT : seg;
    }
    top = Math.max(top, p.y);
    x[i] = p.x;
    y[i] = p.y;
    len[i] = acc;
    ymax[i] = top;
    flip[i] = p.flip;
    cross[i] = p.cross;
    effort[i] = work;
    // Trazo SVG con 1 de cada 2 puntos (y siempre el último): suficiente a 8 px de resolución.
    if (i === 0) d = `M${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    else if (i % 2 === 0 || i === n - 1) d += `L${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
  }

  const last = pts[n - 1]!;
  return {
    x,
    y,
    len,
    ymax,
    flip,
    cross,
    effort,
    total: acc,
    stations: marks.map((m) => ({ id: m.id, index: m.index, len: len[Math.min(m.at, n - 1)]!, x: m.x, y: m.y, side: m.side })),
    crossings: crossIdx.map(([a, b]) => [len[a]!, len[b]!]),
    d,
    end: { x: last.x, y: last.y },
  };
}

/** Longitud de ruta a la que Clawd "llega" a la altura `py` (primer punto con ymax ≥ py). */
export function lengthAtY(r: Route, py: number): number {
  const n = r.ymax.length;
  if (py <= r.ymax[0]!) return 0;
  if (py >= r.ymax[n - 1]!) return r.total;
  let lo = 0;
  let hi = n - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (r.ymax[mid]! < py) lo = mid + 1;
    else hi = mid;
  }
  return r.len[lo]!;
}

export type RouteSample = { x: number; y: number; flip: number; cross: boolean };

/** Puntos [lo, hi] que encierran la longitud `l` y la fracción `t` entre ambos. Requiere 0 < l < total. */
function locate(r: Route, l: number): { lo: number; hi: number; t: number } {
  let lo = 0;
  let hi = r.len.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (r.len[mid]! <= l) lo = mid;
    else hi = mid;
  }
  const span = r.len[hi]! - r.len[lo]! || 1;
  return { lo, hi, t: (l - r.len[lo]!) / span };
}

/**
 * Inversa de `lengthAtY`: la altura de ancla (`ymax`) a una longitud dada. Con
 * ella la cámara del guiado sigue a Clawd, en lugar de que Clawd persiga al scroll.
 */
export function anchorYAt(r: Route, l: number): number {
  const n = r.len.length;
  if (l <= 0) return r.ymax[0]!;
  if (l >= r.total) return r.ymax[n - 1]!;
  const { lo, hi, t } = locate(r, l);
  return r.ymax[lo]! + (r.ymax[hi]! - r.ymax[lo]!) * t;
}

/** Esfuerzo acumulado a una longitud dada. */
export function effortAt(r: Route, l: number): number {
  const n = r.len.length;
  if (l <= 0) return 0;
  if (l >= r.total) return r.effort[n - 1]!;
  const { lo, hi, t } = locate(r, l);
  return r.effort[lo]! + (r.effort[hi]! - r.effort[lo]!) * t;
}

/** Inversa de `effortAt`: longitud a la que se alcanza un esfuerzo dado. */
export function lengthAtEffort(r: Route, w: number): number {
  const n = r.effort.length;
  if (w <= 0) return 0;
  if (w >= r.effort[n - 1]!) return r.total;
  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (r.effort[mid]! <= w) lo = mid;
    else hi = mid;
  }
  const span = r.effort[hi]! - r.effort[lo]! || 1;
  return r.len[lo]! + (r.len[hi]! - r.len[lo]!) * ((w - r.effort[lo]!) / span);
}

/** Punto interpolado a una longitud dada. */
export function sampleAt(r: Route, l: number): RouteSample {
  const n = r.len.length;
  if (l <= 0) return { x: r.x[0]!, y: r.y[0]!, flip: 0, cross: false };
  if (l >= r.total) return { x: r.x[n - 1]!, y: r.y[n - 1]!, flip: 0, cross: false };
  const { lo, hi, t } = locate(r, l);
  return {
    x: r.x[lo]! + (r.x[hi]! - r.x[lo]!) * t,
    y: r.y[lo]! + (r.y[hi]! - r.y[lo]!) * t,
    flip: r.flip[lo]! + (r.flip[hi]! - r.flip[lo]!) * t,
    cross: r.cross[lo] === 1,
  };
}
