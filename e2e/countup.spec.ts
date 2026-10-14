import { expect, test } from "@playwright/test";

type MetricValue = {
  shown: string | null;
  real: string;
};

const getMetrics = (): MetricValue[] => {
  const elements = Array.from(document.querySelectorAll("#proyectos .sr-only"));
  return elements
    .map((sr): MetricValue => ({
      shown:
        sr.previousElementSibling?.getAttribute("aria-hidden") === "true"
          ? (sr.previousElementSibling.textContent ?? null)
          : null,
      real: sr.textContent ?? "",
    }))
    .filter((m): m is MetricValue => m.shown !== null);
};

test.describe("Métricas animadas CountUp", () => {
  test("lejos muestra valor real, se arma en 0 justo antes de entrar y cuenta hasta terminar exacto", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "escritorio");

    // Navega a una sección superior para mantener las métricas lejos del viewport
    await page.goto("./#sobre-mi");
    await expect(page.locator("#sobre-mi")).toBeVisible();

    const far = await page.evaluate(getMetrics);
    expect(far.length).toBeGreaterThan(0);
    expect(far.every((m) => m.shown === m.real)).toBe(true);

    // Mide la posición del primer bloque de métricas
    const top = await page.evaluate((): number => {
      const sr = document.querySelector("#proyectos .sr-only");
      return sr ? sr.getBoundingClientRect().top + window.scrollY : 0;
    });

    // Desplaza justo antes de entrar al viewport (franja de armado al 25 %)
    await page.evaluate((y: number): void => {
      window.scrollTo({ top: y, behavior: "instant" });
    }, top - 900 - 100);

    // Al armarse antes de verse, la métrica desciende a 0
    await expect
      .poll(async () => {
        const armed = await page.evaluate(getMetrics);
        return armed[0]?.shown ?? "";
      })
      .toMatch(/^0([.,]0+)?\D*$/);

    // Desplaza al 50 % para hacerla visible e iniciar el conteo
    await page.evaluate((y: number): void => {
      window.scrollTo({ top: y, behavior: "instant" });
    }, top - 450);

    // Mientras cuenta nunca queda vacía
    const mid = await page.evaluate(getMetrics);
    expect(mid.every((m) => m.shown !== "")).toBe(true);

    // Al finalizar la animación (~1.2 s), el valor visible debe coincidir exactamente con el real
    await expect
      .poll(
        async () => {
          const end = await page.evaluate(getMetrics);
          return end.slice(0, 3).every((m) => m.shown === m.real);
        },
        { timeout: 4000 },
      )
      .toBe(true);
  });

  test("con reducedMotion reduce muestra el valor real de inmediato sin contar", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "escritorio");

    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("./#proyectos");
    await expect(page.locator("#proyectos")).toBeVisible();

    const metrics = await page.evaluate(getMetrics);
    expect(metrics.length).toBeGreaterThan(0);
    expect(metrics.every((m) => m.shown === m.real)).toBe(true);
  });
});
