import { expect, test } from "@playwright/test";

test.describe("Recorrido de Buddy por la ruta", () => {
  test("en móvil, Clawd avanza horizontalmente por la barra con el scroll", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "movil");

    await page.goto("./");
    await page.evaluate((): void => {
      document.getElementById("sobre-mi")?.scrollIntoView({ block: "start", behavior: "instant" });
    });

    const getClawdX = (): Promise<number | null> =>
      page.evaluate((): number | null => {
        const img = document.querySelector("[data-route-track] img");
        return img ? Math.round(img.getBoundingClientRect().left) : null;
      });

    await expect.poll(getClawdX).not.toBeNull();
    const firstX = (await getClawdX())!;

    await page.evaluate((): void => {
      document.getElementById("contacto")?.scrollIntoView({ block: "start", behavior: "instant" });
    });

    // Clawd debe avanzar hacia la derecha a lo largo de la barra de ruta
    await expect.poll(getClawdX, { timeout: 8000 }).toBeGreaterThan(firstX + 40);
  });

  test("en escritorio, Clawd desciende verticalmente por los carriles laterales", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "escritorio");

    await page.goto("./#sobre-mi");
    await page.evaluate((): void => {
      document.getElementById("stack")?.scrollIntoView({ block: "start", behavior: "instant" });
    });

    const getClawdY = (): Promise<number | null> =>
      page.evaluate((): number | null => {
        const b = document.querySelector('[aria-label="Abrir menú de Buddy"], [aria-label="Cerrar menú de Buddy"]');
        if (!b) return null;
        const r = b.getBoundingClientRect();
        return Math.round(r.top + window.scrollY);
      });

    await expect.poll(getClawdY, { timeout: 8000 }).not.toBeNull();
    const firstY = (await getClawdY())!;

    await page.evaluate((): void => {
      document.getElementById("proyectos")?.scrollIntoView({ block: "start", behavior: "instant" });
    });

    // Clawd debe descender verticalmente al cambiar de sección
    await expect.poll(getClawdY, { timeout: 8000 }).toBeGreaterThan(firstY + 200);
  });

  test("con el módulo RouteBuddy bloqueado, la página sigue en pie y no hay capa de ruta", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "escritorio");

    // Simula fallo de red al descargar el chunk lazy de la ruta
    await page.route("**/assets/RouteBuddy-*.js", (r) => r.abort());
    await page.route("**/src/buddy/RouteBuddy.tsx*", (r) => r.abort());

    await page.goto("./#proyectos");

    // El contenido principal se mantiene intacto gracias al ErrorBoundary
    const main = page.locator("main");
    await expect(main).toBeVisible();
    await expect(page.locator("#proyectos")).toBeVisible();

    const mainLength = await page.evaluate((): number => (document.querySelector("main")?.innerText || "").length);
    expect(mainLength).toBeGreaterThan(500);

    // La capa de Buddy no se montó al fallar el chunk
    await expect(page.locator('[aria-label="Abrir menú de Buddy"], [aria-label="Cerrar menú de Buddy"]')).toHaveCount(0);
  });
});
