import test from "node:test";
import assert from "node:assert/strict";
import type { ContactFields, TabOpener, VisibilitySource } from "../src/lib/contact.ts";
import {
  EMAIL_MAX,
  MESSAGE_MAX,
  NAME_MAX,
  validateContact,
  composeMessage,
  gmailComposeUrl,
  mailtoUrl,
  isPhone,
  openInNewTab,
  launchApp,
  interpretScriptResponse,
  sendViaScript,
} from "../src/lib/contact.ts";

class FakeDocument implements VisibilitySource {
  hidden = false;
  listeners = new Set<() => void>();

  addEventListener(type: "visibilitychange", listener: () => void): void {
    if (type === "visibilitychange") {
      this.listeners.add(listener);
    }
  }

  removeEventListener(type: "visibilitychange", listener: () => void): void {
    if (type === "visibilitychange") {
      this.listeners.delete(listener);
    }
  }

  triggerVisibility(hidden: boolean): void {
    this.hidden = hidden;
    for (const listener of [...this.listeners]) {
      listener();
    }
  }
}

test("1. validateContact: campos válidos devuelven objeto vacío sin claves", () => {
  const fields: ContactFields = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: "Hola, este es un mensaje válido de contacto.",
  };
  const errors = validateContact(fields);
  assert.deepStrictEqual(errors, {});
  assert.strictEqual(Object.keys(errors).length, 0);
});

test("2. validateContact: name con menos de 2 caracteres tras trim produce error", () => {
  const base: ContactFields = {
    name: "",
    email: "ada@example.com",
    message: "Mensaje válido con suficiente longitud.",
  };

  const errEmpty = validateContact({ ...base, name: "" });
  assert.ok(errEmpty.name, "Debe marcar error si name está vacío");

  const errSpaces = validateContact({ ...base, name: "   " });
  assert.ok(errSpaces.name, "Debe marcar error si name son solo espacios");

  const errSingle = validateContact({ ...base, name: " A " });
  assert.ok(errSingle.name, "Debe marcar error si name tiene 1 carácter tras trim");

  const valid = validateContact({ ...base, name: " Al " });
  assert.strictEqual(valid.name, undefined, "2 caracteres tras trim debe ser válido");
});

test("3. validateContact: email inválido produce error y formato correcto es válido", () => {
  const base: ContactFields = {
    name: "Ana",
    email: "",
    message: "Mensaje válido con suficiente longitud.",
  };
  const invalidEmails = ["", "a@b", "ab.com", "a b@c.co"];
  for (const email of invalidEmails) {
    const res = validateContact({ ...base, email });
    assert.ok(res.email, `Email '${email}' debería marcar error`);
  }

  const validRes = validateContact({ ...base, email: "ana@correo.co" });
  assert.strictEqual(validRes.email, undefined, "Email válido no debe marcar error");
});

test("4. validateContact: validación de longitud de message y espacios en los extremos", () => {
  const base: ContactFields = {
    name: "Ana",
    email: "ana@correo.co",
    message: "",
  };

  // Menos de 10 caracteres tras trim -> error
  const shortMsg = validateContact({ ...base, message: "  123456789  " });
  assert.ok(shortMsg.message, "Mensaje de 9 caracteres tras trim debe marcar error");

  // Exactamente MESSAGE_MAX caracteres -> válido
  const exactMax = "a".repeat(MESSAGE_MAX);
  const validMax = validateContact({ ...base, message: exactMax });
  assert.strictEqual(validMax.message, undefined, "Exactamente MESSAGE_MAX caracteres debe ser válido");

  // MESSAGE_MAX + 1 -> error cuyo texto contiene el número MESSAGE_MAX
  const overMax = "a".repeat(MESSAGE_MAX + 1);
  const errOverMax = validateContact({ ...base, message: overMax });
  assert.ok(errOverMax.message, "MESSAGE_MAX + 1 debe marcar error");
  assert.ok(
    errOverMax.message?.includes(String(MESSAGE_MAX)),
    `El texto del error debe contener el número ${MESSAGE_MAX}`
  );

  // Los espacios de los extremos no cuentan
  const paddedExact = `   ${"a".repeat(MESSAGE_MAX)}   `;
  const validPadded = validateContact({ ...base, message: paddedExact });
  assert.strictEqual(validPadded.message, undefined, "Espacios en los extremos no deben sumar para superar MESSAGE_MAX");

  const paddedShort = `   ${"a".repeat(9)}   `;
  const invalidPadded = validateContact({ ...base, message: paddedShort });
  assert.ok(invalidPadded.message, "Espacios en los extremos no deben contar para alcanzar los 10 caracteres");
});

test("5. composeMessage recorta campos y produce subject y body esperados", () => {
  const fields: ContactFields = {
    name: "  Ada Lovelace  ",
    email: "  ada@example.com  ",
    message: "  Hola mundo!  ",
  };
  const { subject, body } = composeMessage(fields);
  assert.strictEqual(subject, "Contacto desde el portafolio — Ada Lovelace");
  assert.strictEqual(body, "Hola mundo!\n\n— Ada Lovelace (ada@example.com)");
});

test("6. gmailComposeUrl genera URL para Gmail web con parámetros exactos", () => {
  const specialMessage = "C++ & más? #1 100%\nñ";
  const fields: ContactFields = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: specialMessage,
  };
  const to = "eidan@example.com";
  const url = gmailComposeUrl(to, fields);

  assert.ok(
    url.startsWith("https://mail.google.com/mail/?"),
    "La URL debe iniciar con https://mail.google.com/mail/?"
  );

  const parsed = new URL(url);
  assert.strictEqual(parsed.searchParams.get("view"), "cm");
  assert.strictEqual(parsed.searchParams.get("fs"), "1");
  assert.strictEqual(parsed.searchParams.get("to"), to);

  const expected = composeMessage(fields);
  assert.strictEqual(parsed.searchParams.get("su"), expected.subject);
  assert.strictEqual(parsed.searchParams.get("body"), expected.body);

  // El ida y vuelta es exacto con el mensaje especial; ningún '+' se vuelve espacio
  const bodyParam = parsed.searchParams.get("body");
  assert.ok(bodyParam !== null && bodyParam.includes(specialMessage));
  assert.ok(!url.includes("+"), "Ningún + debe quedar sin codificar en la URL");
});

test("7. mailtoUrl genera URL mailto con destinatario sin codificar y parámetros exactos", () => {
  const specialMessage = "C++ & más? #1 100%\nñ";
  const fields: ContactFields = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    message: specialMessage,
  };
  const to = "eidan@example.com";
  const url = mailtoUrl(to, fields);

  assert.ok(
    url.startsWith(`mailto:${to}?`),
    `La URL debe iniciar con mailto:${to}?`
  );

  const parsed = new URL(url);
  assert.strictEqual(parsed.pathname, to);

  const expected = composeMessage(fields);
  assert.strictEqual(parsed.searchParams.get("subject"), expected.subject);
  assert.strictEqual(parsed.searchParams.get("body"), expected.body);

  const bodyParam = parsed.searchParams.get("body");
  assert.ok(bodyParam !== null && bodyParam.includes(specialMessage));
});

test("8. isPhone devuelve true para Chrome Android y Safari iPhone, y false para desktop e iPadOS", () => {
  const chromeAndroid =
    "Mozilla/5.0 (Linux; Android 14; Pixel 8 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.179 Mobile Safari/537.36";
  const safariIPhone =
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";
  const chromeWindows =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
  const safariMac =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15";
  const safariIPad =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15";

  assert.strictEqual(isPhone(chromeAndroid), true);
  assert.strictEqual(isPhone(safariIPhone), true);
  assert.strictEqual(isPhone(chromeWindows), false);
  assert.strictEqual(isPhone(safariMac), false);
  assert.strictEqual(isPhone(safariIPad), false);
});

test("9. openInNewTab devuelve 'blocked' si opener devuelve null", () => {
  const result = openInNewTab("https://example.com", () => null);
  assert.strictEqual(result, "blocked");
});

test("10. openInNewTab abre pestaña en blanco, elimina opener y asigna la URL", () => {
  const calls: Array<{ url: string; target: string }> = [];
  const fakeTab = { opener: { test: true } as unknown, location: { href: "" } };
  const fakeOpener: TabOpener = (targetUrl: string, targetName: string) => {
    calls.push({ url: targetUrl, target: targetName });
    return fakeTab;
  };

  const destination = "https://mail.google.com/mail/?view=cm";
  const result = openInNewTab(destination, fakeOpener);

  assert.strictEqual(result, "opened");
  assert.strictEqual(calls.length, 1);
  const firstCall = calls[0];
  assert.ok(firstCall !== undefined);
  assert.strictEqual(firstCall.url, "");
  assert.strictEqual(firstCall.target, "_blank");
  assert.strictEqual(fakeTab.opener, null);
  assert.strictEqual(fakeTab.location.href, destination);
});

test("11. launchApp llama a navigate exactamente una vez con la URL", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const doc = new FakeDocument();
  const navigated: string[] = [];

  launchApp("mailto:eidan@example.com", {
    doc,
    navigate: (u) => { navigated.push(u); },
    onOpened: () => {},
    onMissed: () => {},
  });

  assert.strictEqual(navigated.length, 1);
  assert.strictEqual(navigated[0], "mailto:eidan@example.com");
});

test("12. launchApp: si la página se oculta antes de waitMs, llama a onOpened una vez y nunca a onMissed", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const doc = new FakeDocument();
  let openedCount = 0;
  let missedCount = 0;

  launchApp("mailto:test@example.com", {
    doc,
    navigate: () => {},
    waitMs: 1000,
    onOpened: () => { openedCount++; },
    onMissed: () => { missedCount++; },
  });

  t.mock.timers.tick(300);
  doc.triggerVisibility(true);

  assert.strictEqual(openedCount, 1);
  assert.strictEqual(missedCount, 0);

  // Al pasar waitMs no debe dispararse onMissed
  t.mock.timers.tick(1500);
  assert.strictEqual(openedCount, 1);
  assert.strictEqual(missedCount, 0);
});

test("13. launchApp: si no se oculta en waitMs avisa onMissed; dentro de lateMs corrige con onOpened y después deja de vigilar", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });

  // El selector de apps tardó: la ocultación dentro del margen tardío corrige con onOpened.
  {
    const doc = new FakeDocument();
    let openedCount = 0;
    let missedCount = 0;
    launchApp("mailto:test@example.com", {
      doc,
      navigate: () => {},
      waitMs: 1000,
      lateMs: 5000,
      onOpened: () => { openedCount++; },
      onMissed: () => { missedCount++; },
    });

    t.mock.timers.tick(1000);
    assert.strictEqual(missedCount, 1);
    assert.strictEqual(openedCount, 0);

    t.mock.timers.tick(4000);
    doc.triggerVisibility(true);
    assert.strictEqual(missedCount, 1);
    assert.strictEqual(openedCount, 1);
    assert.strictEqual(doc.listeners.size, 0, "Tras abrirse no debe quedar ningún listener");
  }

  // Pasado el margen, ocultarse (cambiar de pestaña, bloquear el teléfono) no demuestra nada.
  {
    const doc = new FakeDocument();
    let openedCount = 0;
    launchApp("mailto:test@example.com", {
      doc,
      navigate: () => {},
      waitMs: 1000,
      lateMs: 5000,
      onOpened: () => { openedCount++; },
      onMissed: () => {},
    });

    t.mock.timers.tick(1000);
    t.mock.timers.tick(5000);
    assert.strictEqual(doc.listeners.size, 0, "Pasado lateMs no debe quedar ningún listener");
    doc.triggerVisibility(true);
    assert.strictEqual(openedCount, 0, "Una ocultación tardía no se anuncia como correo abierto");
  }
});

test("14. launchApp: visibilitychange con hidden = false no llama a nada", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const doc = new FakeDocument();
  let openedCount = 0;
  let missedCount = 0;

  launchApp("mailto:test@example.com", {
    doc,
    navigate: () => {},
    waitMs: 1000,
    onOpened: () => { openedCount++; },
    onMissed: () => { missedCount++; },
  });

  doc.triggerVisibility(false);
  t.mock.timers.tick(200);
  doc.triggerVisibility(false);

  assert.strictEqual(openedCount, 0);
  assert.strictEqual(missedCount, 0);
});

test("15. launchApp: múltiples visibilitychange con hidden = true llaman a onOpened solo una vez", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const doc = new FakeDocument();
  let openedCount = 0;
  let missedCount = 0;

  launchApp("mailto:test@example.com", {
    doc,
    navigate: () => {},
    waitMs: 1000,
    onOpened: () => { openedCount++; },
    onMissed: () => { missedCount++; },
  });

  doc.triggerVisibility(true);
  doc.triggerVisibility(true);
  doc.triggerVisibility(true);

  assert.strictEqual(openedCount, 1);
  assert.strictEqual(missedCount, 0);
});

test("16. launchApp: función de limpieza cancela timer y retira listeners", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const doc = new FakeDocument();
  let openedCount = 0;
  let missedCount = 0;

  const cleanup = launchApp("mailto:test@example.com", {
    doc,
    navigate: () => {},
    waitMs: 1000,
    onOpened: () => { openedCount++; },
    onMissed: () => { missedCount++; },
  });

  assert.strictEqual(doc.listeners.size, 1);

  cleanup();
  assert.strictEqual(doc.listeners.size, 0, "El documento falso no debe conservar listeners tras cleanup");

  t.mock.timers.tick(1500);
  assert.strictEqual(missedCount, 0);
  assert.strictEqual(openedCount, 0);

  doc.triggerVisibility(true);
  assert.strictEqual(openedCount, 0);
});

test("17. launchApp (invariante de honestidad): onOpened nunca se llama si el documento nunca estuvo oculto", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });

  // Escenario A: waitMs expira sin ocultarse
  {
    const doc = new FakeDocument();
    let opened = 0;
    launchApp("mailto:test@example.com", {
      doc,
      navigate: () => {},
      waitMs: 500,
      onOpened: () => { opened++; },
      onMissed: () => {},
    });
    t.mock.timers.tick(1000);
    assert.strictEqual(opened, 0, "Escenario A: onOpened no debe llamarse si nunca estuvo oculto");
  }

  // Escenario B: eventos visibilitychange con hidden = false antes de expirar
  {
    const doc = new FakeDocument();
    let opened = 0;
    launchApp("mailto:test@example.com", {
      doc,
      navigate: () => {},
      waitMs: 500,
      onOpened: () => { opened++; },
      onMissed: () => {},
    });
    doc.triggerVisibility(false);
    t.mock.timers.tick(200);
    doc.triggerVisibility(false);
    t.mock.timers.tick(400);
    assert.strictEqual(opened, 0, "Escenario B: onOpened no debe llamarse con hidden = false");
  }

  // Escenario C: cleanup llamado antes de timeout sin haberse ocultado
  {
    const doc = new FakeDocument();
    let opened = 0;
    const cleanup = launchApp("mailto:test@example.com", {
      doc,
      navigate: () => {},
      waitMs: 500,
      onOpened: () => { opened++; },
      onMissed: () => {},
    });
    t.mock.timers.tick(100);
    cleanup();
    t.mock.timers.tick(1000);
    assert.strictEqual(opened, 0, "Escenario C: onOpened no debe llamarse tras cleanup");
  }

  // Escenario D: eventos con hidden = false tanto antes como después de waitMs
  {
    const doc = new FakeDocument();
    let opened = 0;
    let missed = 0;
    launchApp("mailto:test@example.com", {
      doc,
      navigate: () => {},
      waitMs: 500,
      onOpened: () => { opened++; },
      onMissed: () => { missed++; },
    });
    doc.triggerVisibility(false);
    t.mock.timers.tick(600);
    assert.strictEqual(missed, 1);
    doc.triggerVisibility(false);
    t.mock.timers.tick(300);
    doc.triggerVisibility(false);
    assert.strictEqual(opened, 0, "Escenario D: onOpened nunca debe llamarse");
  }
});

test("18. interpretScriptResponse: 200 con { ok: true } devuelve ok: true; otros devuelven reason: 'rejected'", () => {
  const success = interpretScriptResponse(200, { ok: true });
  assert.deepStrictEqual(success, { ok: true });

  const cases: Array<{ status: number; body: unknown; checkDetailRate?: boolean }> = [
    { status: 200, body: { ok: "true" } },
    { status: 200, body: { ok: false, error: "rate" }, checkDetailRate: true },
    { status: 500, body: { ok: true } },
    { status: 200, body: null },
    { status: 200, body: "x" },
  ];

  for (const c of cases) {
    const res = interpretScriptResponse(c.status, c.body);
    assert.strictEqual(res.ok, false, `Status ${c.status} con body ${JSON.stringify(c.body)} debe devolver ok: false`);
    assert.strictEqual(res.reason, "rejected");
    if (c.checkDetailRate) {
      assert.ok(res.detail?.includes("rate"), "El detail debe contener 'rate'");
    }
  }
});

test("19. sendViaScript hace una sola llamada al endpoint con POST, Content-Type text/plain, body recortado y AbortSignal", async () => {
  const endpoint = "https://script.google.com/macros/s/xyz/exec";
  const fields: ContactFields = {
    name: "  Ada Lovelace  ",
    email: "  ada@example.com  ",
    message: "  Mensaje de prueba con espacios.  ",
  };

  // Caso 1: honeypot por defecto ("")
  {
    const calls: Array<{ url: string | URL | Request; init?: RequestInit }> = [];
    const fakeFetch: typeof fetch = async (url, init) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    };

    const res = await sendViaScript(endpoint, fields, { fetch: fakeFetch });
    assert.strictEqual(res.ok, true);
    assert.strictEqual(calls.length, 1);

    const call = calls[0];
    assert.ok(call !== undefined);
    assert.strictEqual(call.url, endpoint);
    assert.strictEqual(call.init?.method, "POST");

    const headers = call.init?.headers as Record<string, string> | undefined;
    assert.ok(headers !== undefined);
    const contentType = headers["Content-Type"];
    assert.ok(typeof contentType === "string" && contentType.startsWith("text/plain"), "Content-Type debe empezar por text/plain");

    assert.ok(call.init?.signal instanceof AbortSignal, "signal debe ser instancia de AbortSignal");

    assert.ok(typeof call.init?.body === "string");
    const parsedBody = JSON.parse(call.init.body) as Record<string, unknown>;
    assert.deepStrictEqual(parsedBody, {
      name: "Ada Lovelace",
      email: "ada@example.com",
      message: "Mensaje de prueba con espacios.",
      honeypot: "",
    });
  }

  // Caso 2: honeypot especificado
  {
    const calls: Array<{ url: string | URL | Request; init?: RequestInit }> = [];
    const fakeFetch: typeof fetch = async (url, init) => {
      calls.push({ url, init });
      return new Response(JSON.stringify({ ok: true }), { status: 200 });
    };

    await sendViaScript(endpoint, fields, { fetch: fakeFetch, honeypot: "trap-value" });
    assert.strictEqual(calls.length, 1);
    const call = calls[0];
    assert.ok(call !== undefined && typeof call.init?.body === "string");
    const parsedBody = JSON.parse(call.init.body) as Record<string, unknown>;
    assert.strictEqual(parsedBody.honeypot, "trap-value");
  }
});

test("20. sendViaScript: resultados según respuesta de fetch (éxito, no JSON, TypeError, TimeoutError, AbortError, offline)", async () => {
  const endpoint = "https://script.google.com/test";
  const fields: ContactFields = { name: "Ada", email: "ada@example.com", message: "Mensaje válido" };

  // 1. fetch resuelve 200 { ok: true } -> { ok: true }
  {
    const fakeFetch: typeof fetch = async () => new Response(JSON.stringify({ ok: true }), { status: 200 });
    const res = await sendViaScript(endpoint, fields, { fetch: fakeFetch });
    assert.deepStrictEqual(res, { ok: true });
  }

  // 2. 200 con un body que no es JSON -> "rejected"
  {
    const fakeFetch: typeof fetch = async () => new Response("<html>Not JSON</html>", { status: 200 });
    const res = await sendViaScript(endpoint, fields, { fetch: fakeFetch });
    assert.strictEqual(res.ok, false);
    assert.strictEqual(res.reason, "rejected");
  }

  // 3. TypeError -> "network"
  {
    const fakeFetch: typeof fetch = async () => {
      throw new TypeError("Failed to fetch");
    };
    const res = await sendViaScript(endpoint, fields, { fetch: fakeFetch });
    assert.strictEqual(res.ok, false);
    assert.strictEqual(res.reason, "network");
  }

  // 4a. DOMException TimeoutError -> "timeout"
  {
    const fakeFetch: typeof fetch = async () => {
      throw new DOMException("The operation timed out.", "TimeoutError");
    };
    const res = await sendViaScript(endpoint, fields, { fetch: fakeFetch });
    assert.strictEqual(res.ok, false);
    assert.strictEqual(res.reason, "timeout");
  }

  // 4b. DOMException AbortError -> "timeout"
  {
    const fakeFetch: typeof fetch = async () => {
      throw new DOMException("The user aborted a request.", "AbortError");
    };
    const res = await sendViaScript(endpoint, fields, { fetch: fakeFetch });
    assert.strictEqual(res.ok, false);
    assert.strictEqual(res.reason, "timeout");
  }

  // 5. online: false -> "offline" sin llamar a fetch
  {
    let fetchCalled = false;
    const fakeFetch: typeof fetch = async () => {
      fetchCalled = true;
      return new Response(JSON.stringify({ ok: true }));
    };
    const res = await sendViaScript(endpoint, fields, { online: false, fetch: fakeFetch });
    assert.strictEqual(res.ok, false);
    assert.strictEqual(res.reason, "offline");
    assert.strictEqual(fetchCalled, false);
  }
});

test("21. sendViaScript: timeout real con timeoutMs 30 devuelve 'timeout'", async () => {
  const fields: ContactFields = { name: "Ada", email: "ada@example.com", message: "Mensaje válido de prueba" };
  const endpoint = "https://script.google.com/test";

  // Mantén un setTimeout ref'd mientras esperas
  const keepAlive = setTimeout(() => {}, 5000);

  try {
    const fakeHangingFetch: typeof fetch = (_url, init) => {
      return new Promise<Response>((_, reject) => {
        if (init?.signal?.aborted) {
          reject(init.signal.reason);
          return;
        }
        init?.signal?.addEventListener("abort", () => {
          reject(init.signal?.reason);
        });
      });
    };

    const res = await sendViaScript(endpoint, fields, {
      timeoutMs: 30,
      fetch: fakeHangingFetch,
    });

    assert.strictEqual(res.ok, false);
    assert.strictEqual(res.reason, "timeout");
  } finally {
    clearTimeout(keepAlive);
  }
});

test("22. invariante: ok solo es true con HTTP 2xx y { ok: true }", async () => {
  const fields: ContactFields = { name: "Ada", email: "ada@example.com", message: "Mensaje válido de prueba." };
  const endpoint = "https://script.google.com/test";

  const nonSuccessCases: Array<{ status: number; body: unknown }> = [
    { status: 199, body: { ok: true } },
    { status: 300, body: { ok: true } },
    { status: 400, body: { ok: true } },
    { status: 403, body: { ok: true } },
    { status: 404, body: { ok: true } },
    { status: 500, body: { ok: true } },
    { status: 503, body: { ok: true } },
    { status: 200, body: { ok: false } },
    { status: 200, body: { ok: "true" } },
    { status: 200, body: { ok: 1 } },
    { status: 200, body: { ok: null } },
    { status: 200, body: null },
    { status: 200, body: "x" },
    { status: 200, body: {} },
  ];

  for (const c of nonSuccessCases) {
    const parsed = interpretScriptResponse(c.status, c.body);
    assert.strictEqual(parsed.ok, false, `interpretScriptResponse(${c.status}, ${JSON.stringify(c.body)}) debe devolver ok: false`);

    const fakeFetch: typeof fetch = async () =>
      new Response(typeof c.body === "string" ? c.body : JSON.stringify(c.body), { status: c.status });

    const sendRes = await sendViaScript(endpoint, fields, { fetch: fakeFetch });
    assert.strictEqual(sendRes.ok, false, `sendViaScript con status ${c.status} y body ${JSON.stringify(c.body)} debe devolver ok: false`);
  }

  // Éxitos con HTTP 2xx y { ok: true }
  for (const status of [200, 201, 202]) {
    const parsed = interpretScriptResponse(status, { ok: true });
    assert.strictEqual(parsed.ok, true);

    const fakeFetch: typeof fetch = async () =>
      new Response(JSON.stringify({ ok: true }), { status });

    const sendRes = await sendViaScript(endpoint, fields, { fetch: fakeFetch });
    assert.strictEqual(sendRes.ok, true);
  }
});

test("23. validateContact: nombre y email por encima de los topes del Apps Script marcan error con el tope", () => {
  const base: ContactFields = {
    name: "Ana",
    email: "ana@correo.co",
    message: "Mensaje válido con suficiente longitud.",
  };

  assert.strictEqual(validateContact({ ...base, name: "a".repeat(NAME_MAX) }).name, undefined, "NAME_MAX exacto es válido");
  const longName = validateContact({ ...base, name: "a".repeat(NAME_MAX + 1) }).name;
  assert.ok(longName?.includes(String(NAME_MAX)), "NAME_MAX + 1 debe marcar un error con el tope");

  const email = (length: number) => `${"a".repeat(length - "@correo.co".length)}@correo.co`;
  assert.strictEqual(validateContact({ ...base, email: email(EMAIL_MAX) }).email, undefined, "EMAIL_MAX exacto es válido");
  const longEmail = validateContact({ ...base, email: email(EMAIL_MAX + 1) }).email;
  assert.ok(longEmail?.includes(String(EMAIL_MAX)), "EMAIL_MAX + 1 debe marcar un error con el tope");
});

test("24. Un sustituto UTF-16 suelto no rompe las URLs: pasa a U+FFFD y los pares válidos se conservan", () => {
  const fields: ContactFields = {
    name: "Ana \ud83d",
    email: "ana@correo.co",
    message: "Hola \udc00 y un emoji 😀 en el mensaje",
  };

  assert.doesNotThrow(() => gmailComposeUrl("eidan@example.com", fields));
  assert.doesNotThrow(() => mailtoUrl("eidan@example.com", fields));
  const { subject, body } = composeMessage(fields);
  assert.ok(subject.endsWith("Ana \uFFFD"));
  assert.ok(body.includes("Hola \uFFFD y un emoji 😀"));
  assert.ok(gmailComposeUrl("eidan@example.com", fields).includes(encodeURIComponent("😀")));
});
