/**
 * Diálogo modal nativo (`<dialog>` + `showModal`): el navegador pone la capa de
 * fondo, atrapa el foco, cierra con Esc y devuelve el foco a quien lo abrió. Se
 * cierra también al pulsar fuera del panel, y mientras está abierto la página
 * de fondo no hace scroll.
 */
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Id del título visible del diálogo. */
  labelledBy: string;
  children: ReactNode;
};

export function Dialog({ open, onClose, labelledBy, children }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  // Solo cierra un clic que empieza y termina en la capa de fondo: seleccionar texto del panel y soltar fuera no cuenta.
  const downOnBackdrop = useRef(false);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={labelledBy}
      onClose={onClose}
      // El <dialog> no tiene padding propio: un evento cuyo destino es él mismo cayó en la capa de fondo.
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === e.currentTarget;
      }}
      onClick={(e) => {
        if (downOnBackdrop.current && e.target === e.currentTarget) onClose();
        downOnBackdrop.current = false;
      }}
      className="app-dialog m-auto max-h-[min(90dvh,52rem)] w-[min(44rem,calc(100%-2rem))] overflow-hidden rounded-3xl border border-white/10 bg-ink p-0 text-fg shadow-2xl backdrop:bg-ink/80"
    >
      <div className="max-h-[inherit] overflow-y-auto overscroll-contain p-6 sm:p-8">{children}</div>
    </dialog>
  );
}
