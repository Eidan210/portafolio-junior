import test from "node:test";
import assert from "node:assert/strict";
import type { IndexStore } from "../src/lib/rotation.ts";
import { createRotation } from "../src/lib/rotation.ts";

class MemoryStore implements IndexStore {
  readonly data = new Map<string, unknown>();
  readonly writes: Array<{ key: string; value: number }> = [];

  read(key: string): unknown {
    return this.data.get(key);
  }

  write(key: string, value: number): void {
    this.writes.push({ key, value });
    this.data.set(key, value);
  }
}

test("1. primera visita: el store está vacío, devuelve 0 y escribe 0", () => {
  const store = new MemoryStore();
  const rotation = createRotation(store);
  const result = rotation("hero", 3);

  assert.strictEqual(result, 0);
  assert.strictEqual(store.read("hero"), 0);
  assert.strictEqual(store.writes.length, 1);
  const firstWrite = store.writes[0];
  assert.ok(firstWrite !== undefined);
  assert.deepStrictEqual(firstWrite, { key: "hero", value: 0 });
});

test("2. avanza en cada carga nueva: 0 -> 1 -> 2 -> 0 con length 3", () => {
  const store = new MemoryStore();

  const load1 = createRotation(store)("banner", 3);
  assert.strictEqual(load1, 0);

  const load2 = createRotation(store)("banner", 3);
  assert.strictEqual(load2, 1);

  const load3 = createRotation(store)("banner", 3);
  assert.strictEqual(load3, 2);

  const load4 = createRotation(store)("banner", 3);
  assert.strictEqual(load4, 0);
});

test("3. StrictMode: llamar dos o más veces en la misma carga devuelve el mismo índice y escribe una sola vez", () => {
  const store = new MemoryStore();
  const rotation = createRotation(store);

  const first = rotation("strict", 4);
  const second = rotation("strict", 4);
  const third = rotation("strict", 4);

  assert.strictEqual(first, 0);
  assert.strictEqual(second, 0);
  assert.strictEqual(third, 0);
  assert.strictEqual(store.writes.length, 1);
  const write = store.writes[0];
  assert.ok(write !== undefined);
  assert.deepStrictEqual(write, { key: "strict", value: 0 });
});

test("4. claves independientes: 'a' y 'b' no se afectan", () => {
  const store = new MemoryStore();

  const rot1 = createRotation(store);
  assert.strictEqual(rot1("a", 3), 0);
  assert.strictEqual(rot1("b", 3), 0);

  const rot2 = createRotation(store);
  assert.strictEqual(rot2("a", 3), 1);
  assert.strictEqual(rot2("b", 3), 1);

  const rot3 = createRotation(store);
  assert.strictEqual(rot3("a", 3), 2);
  assert.strictEqual(store.read("b"), 1);
});

test("5. forzado válido (forced = 2, length 3): devuelve 2 y no escribe en el store", () => {
  const store = new MemoryStore();
  const rotation = createRotation(store);
  const result = rotation("hero", 3, 2);

  assert.strictEqual(result, 2);
  assert.strictEqual(store.writes.length, 0);
  assert.strictEqual(store.read("hero"), undefined);
});

test("6. forzado inválido (-1, 3, 1.5, null): se ignora y rota normal", () => {
  const invalidForcedValues: Array<number | null> = [-1, 3, 1.5, null];

  for (const forced of invalidForcedValues) {
    const store = new MemoryStore();
    const rotation = createRotation(store);
    const result = rotation("hero", 3, forced);

    assert.strictEqual(result, 0, `forced = ${String(forced)} debería rotar normal a 0`);
    assert.strictEqual(store.writes.length, 1);
    assert.strictEqual(store.read("hero"), 0);
  }
});

test("7. valor corrupto en el store ('x', -5, 2.5, null, {}): empieza en 0", () => {
  const corruptValues: unknown[] = ["x", -5, 2.5, null, {}];

  for (const val of corruptValues) {
    const store = new MemoryStore();
    store.data.set("corrupt", val);
    const rotation = createRotation(store);
    const result = rotation("corrupt", 3);

    assert.strictEqual(result, 0, `valor corrupto ${JSON.stringify(val)} debería reiniciar a 0`);
    assert.strictEqual(store.read("corrupt"), 0);
    assert.strictEqual(store.writes.length, 1);
  }
});

test("8. valor guardado mayor que la lista (7 con length 3): queda dentro de rango ((7+1) % 3)", () => {
  const store = new MemoryStore();
  store.data.set("overflow", 7);
  const rotation = createRotation(store);
  const result = rotation("overflow", 3);

  assert.strictEqual(result, 2);
  assert.strictEqual(store.read("overflow"), 2);
  assert.strictEqual(store.writes.length, 1);
  const write = store.writes[0];
  assert.ok(write !== undefined);
  assert.deepStrictEqual(write, { key: "overflow", value: 2 });
});
