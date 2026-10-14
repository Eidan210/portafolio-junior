/**
 * Guiño oculto: el código Konami (↑↑↓↓←→←→BA). `konamiStep` es la máquina de
 * estados pura (se testea con `node --test`) y `useKonami` la conecta al
 * teclado, ignorando lo que se escribe en campos de formulario.
 */
import { useEffect, useLayoutEffect, useRef } from "react";

export const KONAMI: readonly string[] = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export function konamiStep(
  progress: number,
  key: string,
): { progress: number; done: boolean } {
  const target = KONAMI[progress];
  const firstKey = KONAMI[0];

  if (target !== undefined && key.toLowerCase() === target.toLowerCase()) {
    const nextProgress = progress + 1;
    if (nextProgress === KONAMI.length) {
      return { progress: 0, done: true };
    }
    return { progress: nextProgress, done: false };
  }

  if (firstKey !== undefined && key.toLowerCase() === firstKey.toLowerCase()) {
    return { progress: progress === 2 ? 2 : 1, done: false };
  }

  return { progress: 0, done: false };
}

export function isTypingTarget(el: EventTarget | null): boolean {
  if (!el || typeof el !== "object") {
    return false;
  }

  const candidate = el as {
    tagName?: unknown;
    isContentEditable?: unknown;
    getAttribute?: unknown;
  };

  if (typeof candidate.tagName === "string") {
    const tag = candidate.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") {
      return true;
    }
  }

  if (candidate.isContentEditable === true) {
    return true;
  }

  if (typeof candidate.getAttribute === "function") {
    const editable = (candidate.getAttribute as (name: string) => string | null)("contenteditable");
    if (editable !== null && editable !== "false") {
      return true;
    }
  }

  return false;
}

export function useKonami(onTrigger: () => void): void {
  const onTriggerRef = useRef(onTrigger);

  useLayoutEffect(() => {
    onTriggerRef.current = onTrigger;
  });

  useEffect(() => {
    let progress = 0;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      if (isTypingTarget(e.target)) {
        return;
      }

      const result = konamiStep(progress, e.key);
      progress = result.progress;
      if (result.done) {
        onTriggerRef.current();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
