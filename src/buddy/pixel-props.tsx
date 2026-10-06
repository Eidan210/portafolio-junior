/**
 * Props en pixel art para la ruta: la chispa coleccionable de cada parada y la
 * bandera de meta. SVG con `crispEdges` para bordes nítidos a cualquier tamaño.
 */

/** Chispa de 4 puntas (eco de las "sparkles" de Clawd): el coleccionable de cada parada. */
export function PixelSpark({ className = "size-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 9 9" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="4" y="0" width="1" height="9" fill="#eba487" />
      <rect x="0" y="4" width="9" height="1" fill="#eba487" />
      <rect x="3" y="3" width="3" height="3" fill="#d97757" />
      <rect x="4" y="4" width="1" height="1" fill="#faf9f5" />
    </svg>
  );
}

/** Bandera a cuadros sobre un mástil: la meta al final de la ruta. */
export function PixelFlag({ className = "h-12 w-9", waving = false }: { className?: string; waving?: boolean }) {
  const cells = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      cells.push(<rect key={`${r}-${c}`} x={3 + c * 2.5} y={1 + r * 2.5} width="2.5" height="2.5" fill={(r + c) % 2 ? "#d97757" : "#faf9f5"} />);
    }
  }
  return (
    <svg viewBox="0 0 14 20" className={className} shapeRendering="crispEdges" aria-hidden="true">
      <rect x="1.5" y="0.5" width="1.5" height="19.5" fill="#b0aea5" />
      <g className={waving ? "flag-wave flag-wave-fast" : "flag-wave"}>{cells}</g>
    </svg>
  );
}
