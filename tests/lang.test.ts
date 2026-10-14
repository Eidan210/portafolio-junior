import test from "node:test";
import assert from "node:assert/strict";
import { detectLang, lang, pick, skipIntro } from "../src/i18n/lang.ts";

test("detectLang: ?lang= en la URL manda sobre la preferencia y el navegador", () => {
  assert.equal(detectLang({ search: "?lang=en", saved: "es", languages: ["es-CO"] }), "en");
  assert.equal(detectLang({ search: "?x=1&lang=es", saved: "en", languages: ["en-US"] }), "es");
});

test("detectLang: un ?lang= desconocido se ignora", () => {
  assert.equal(detectLang({ search: "?lang=fr", saved: null, languages: ["es-CO"] }), "es");
  assert.equal(detectLang({ search: "?lang=", saved: "en", languages: ["es"] }), "en");
});

test("detectLang: sin URL, la preferencia guardada manda sobre el navegador", () => {
  assert.equal(detectLang({ saved: "en", languages: ["es-ES"] }), "en");
  assert.equal(detectLang({ saved: "es", languages: ["en-GB"] }), "es");
});

test("detectLang: preferencia corrupta se ignora y decide el navegador", () => {
  assert.equal(detectLang({ saved: '"en"', languages: ["es-MX"] }), "es");
});

test("detectLang: navegador en español → es; cualquier otro idioma → en", () => {
  assert.equal(detectLang({ languages: ["es-CO", "en"] }), "es");
  assert.equal(detectLang({ languages: ["ES"] }), "es");
  assert.equal(detectLang({ languages: ["en-US"] }), "en");
  assert.equal(detectLang({ languages: ["pt-BR"] }), "en");
  assert.equal(detectLang({ languages: ["", "fr"] }), "en");
});

test("detectLang: sin ninguna pista, español", () => {
  assert.equal(detectLang({}), "es");
  assert.equal(detectLang({ languages: [] }), "es");
});

test("en Node (sin window): idioma español, sin saltar la intro, y pick elige la versión es", () => {
  assert.equal(lang, "es");
  assert.equal(skipIntro, false);
  assert.equal(pick({ es: "hola", en: "hello" }), "hola");
});
