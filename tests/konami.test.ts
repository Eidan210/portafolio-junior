import test from "node:test";
import assert from "node:assert/strict";
import { KONAMI, konamiStep, isTypingTarget } from "../src/lib/konami.ts";

test("1. la secuencia completa da done: true solo en la última tecla y deja progress en 0", () => {
  let progress = 0;

  for (let i = 0; i < KONAMI.length; i++) {
    const key = KONAMI[i];
    assert.ok(key !== undefined);
    const step = konamiStep(progress, key);

    if (i === KONAMI.length - 1) {
      assert.strictEqual(step.done, true);
      assert.strictEqual(step.progress, 0);
    } else {
      assert.strictEqual(step.done, false);
      assert.strictEqual(step.progress, i + 1);
    }
    progress = step.progress;
  }
});

test("2. las letras no distinguen mayúsculas: 'B', 'A'", () => {
  let progress = 0;

  // Avanza hasta antes de 'b' (primeras 8 teclas)
  for (let i = 0; i < 8; i++) {
    const key = KONAMI[i];
    assert.ok(key !== undefined);
    progress = konamiStep(progress, key).progress;
  }
  assert.strictEqual(progress, 8);

  const stepB = konamiStep(progress, "B");
  assert.strictEqual(stepB.progress, 9);
  assert.strictEqual(stepB.done, false);

  const stepA = konamiStep(stepB.progress, "A");
  assert.strictEqual(stepA.progress, 0);
  assert.strictEqual(stepA.done, true);
});

test("3. una tecla incorrecta a mitad reinicia a 0", () => {
  let progress = 0;
  progress = konamiStep(progress, "ArrowUp").progress;
  progress = konamiStep(progress, "ArrowUp").progress;
  progress = konamiStep(progress, "ArrowDown").progress;
  assert.strictEqual(progress, 3);

  const step = konamiStep(progress, "x");
  assert.strictEqual(step.progress, 0);
  assert.strictEqual(step.done, false);
});

test("4. ArrowUp incorrecto a mitad deja progress en 1", () => {
  let progress = 0;
  progress = konamiStep(progress, "ArrowUp").progress;
  progress = konamiStep(progress, "ArrowUp").progress;
  progress = konamiStep(progress, "ArrowDown").progress;
  assert.strictEqual(progress, 3);

  const step = konamiStep(progress, "ArrowUp");
  assert.strictEqual(step.progress, 1);
  assert.strictEqual(step.done, false);
});

test("5. 'ArrowUp ArrowUp ArrowUp' y luego el resto completa igualmente (progress se queda en 2 con el tercer ArrowUp)", () => {
  let progress = 0;
  progress = konamiStep(progress, "ArrowUp").progress;
  assert.strictEqual(progress, 1);

  progress = konamiStep(progress, "ArrowUp").progress;
  assert.strictEqual(progress, 2);

  const thirdUp = konamiStep(progress, "ArrowUp");
  assert.strictEqual(thirdUp.progress, 2);
  assert.strictEqual(thirdUp.done, false);
  progress = thirdUp.progress;

  for (let i = 2; i < KONAMI.length; i++) {
    const key = KONAMI[i];
    assert.ok(key !== undefined);
    const step = konamiStep(progress, key);

    if (i === KONAMI.length - 1) {
      assert.strictEqual(step.done, true);
      assert.strictEqual(step.progress, 0);
    } else {
      assert.strictEqual(step.done, false);
      assert.strictEqual(step.progress, i + 1);
    }
    progress = step.progress;
  }
});

test("6. isTypingTarget: elementos editables dan true y otros o null dan false", () => {
  // Casos true
  assert.strictEqual(isTypingTarget({ tagName: "INPUT" } as unknown as EventTarget), true);
  assert.strictEqual(isTypingTarget({ tagName: "TEXTAREA" } as unknown as EventTarget), true);
  assert.strictEqual(isTypingTarget({ tagName: "SELECT" } as unknown as EventTarget), true);
  assert.strictEqual(isTypingTarget({ isContentEditable: true } as unknown as EventTarget), true);
  assert.strictEqual(
    isTypingTarget({
      getAttribute: (name: string) => (name === "contenteditable" ? "true" : null),
    } as unknown as EventTarget),
    true
  );

  // Casos false
  assert.strictEqual(isTypingTarget(null), false);
  assert.strictEqual(isTypingTarget({ tagName: "DIV" } as unknown as EventTarget), false);
  assert.strictEqual(
    isTypingTarget({
      getAttribute: (name: string) => (name === "contenteditable" ? "false" : null),
    } as unknown as EventTarget),
    false
  );
});
