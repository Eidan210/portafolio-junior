/**
 * Punto de entrada de la ruta de escritorio. La capa (`RouteBuddy.tsx`, con su
 * geometría y sus efectos) es la parte más pesada de Buddy y solo existe en
 * modo "lanes" (escritorio ≥ 1280 px con movimiento): se descarga aparte y
 * solo cuando hace falta, así el móvil y la tablet no la pagan.
 */
import { Component, Suspense, lazy } from "react";
import type { ReactNode } from "react";
import { useBuddy } from "@/buddy/BuddyProvider";

const RouteLayer = lazy(() => import("@/buddy/RouteBuddy").then((m) => ({ default: m.RouteLayer })));

/**
 * Si el chunk no llega (red caída, o un despliegue nuevo borró el que pedía una
 * página en caché), la ruta no aparece y el resto de la página sigue: sin esto,
 * el error del `lazy` desmontaría toda la app.
 */
class LoadBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function RouteBuddy() {
  const { routeMode, stage, minimized } = useBuddy();
  if (routeMode !== "lanes" || stage !== "hud" || minimized) return null;
  return (
    <LoadBoundary>
      <Suspense fallback={null}>
        <RouteLayer />
      </Suspense>
    </LoadBoundary>
  );
}
