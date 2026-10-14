import test from "node:test";
import assert from "node:assert/strict";
import { parseMetric, formatMetric } from "../src/lib/count.ts";

test("1. parseMetric con '25' produce value 25, decimals 0 y suffix ''", () => {
  const m = parseMetric("25");
  assert.ok(m !== null);
  assert.strictEqual(m.value, 25);
  assert.strictEqual(m.decimals, 0);
  assert.strictEqual(m.suffix, "");
});

test("2. parseMetric con '65 %' produce value 65 y suffix ' %'", () => {
  const m = parseMetric("65 %");
  assert.ok(m !== null);
  assert.strictEqual(m.value, 65);
  assert.strictEqual(m.suffix, " %");
});

test("3. parseMetric con '9,7 KB' produce value 9.7, decimals 1, separator ',' y suffix ' KB'", () => {
  const m = parseMetric("9,7 KB");
  assert.ok(m !== null);
  assert.strictEqual(m.value, 9.7);
  assert.strictEqual(m.decimals, 1);
  assert.strictEqual(m.separator, ",");
  assert.strictEqual(m.suffix, " KB");
});

test("4. parseMetric con '111 KB' produce value 111", () => {
  const m = parseMetric("111 KB");
  assert.ok(m !== null);
  assert.strictEqual(m.value, 111);
});

test("5. parseMetric con 'v2.0', '', 'abc', '12 años' produce null", () => {
  assert.strictEqual(parseMetric("v2.0"), null);
  assert.strictEqual(parseMetric(""), null);
  assert.strictEqual(parseMetric("abc"), null);
  assert.strictEqual(parseMetric("12 años"), null);
});

test("6. formatMetric con 0, con valor final y con intermedio", () => {
  const m25 = parseMetric("25");
  const m65 = parseMetric("65 %");
  const m97 = parseMetric("9,7 KB");
  const m111 = parseMetric("111 KB");

  assert.ok(m25 !== null);
  assert.ok(m65 !== null);
  assert.ok(m97 !== null);
  assert.ok(m111 !== null);

  // Con 0
  assert.strictEqual(formatMetric(0, m25), "0");
  assert.strictEqual(formatMetric(0, m65), "0 %");
  assert.strictEqual(formatMetric(0, m97), "0,0 KB");

  // Con valor final
  assert.strictEqual(formatMetric(m25.value, m25), "25");
  assert.strictEqual(formatMetric(m65.value, m65), "65 %");
  assert.strictEqual(formatMetric(m97.value, m97), "9,7 KB");
  assert.strictEqual(formatMetric(m111.value, m111), "111 KB");

  // Con intermedio (4.85 sobre "9,7 KB")
  const intermediate = formatMetric(4.85, m97);
  assert.match(intermediate, /^4,[89] KB$/);
});
