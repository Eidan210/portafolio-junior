import { expect, test } from "@playwright/test";

test.describe("Página 404 (not found)", () => {
  test("en español muestra título, encabezado, enlace de vuelta e imágenes cargadas", async ({ page }) => {
    await page.goto("./404.html");

    await expect(page).toHaveTitle("Página no encontrada · Eidan Carreño");
    await expect(page.locator("h1")).toHaveText("404 · Clawd se perdió");

    const homeBtn = page.locator("#home-btn");
    await expect(homeBtn).toHaveText("Volver al inicio");
    await expect(homeBtn).toHaveAttribute("href", /\/$/);

    // Verifica que ambas variantes del sprite de Clawd se hayan cargado sin error
    const imagesLoaded = await page.evaluate((): boolean => {
      const left = document.getElementById("clawd-left") as HTMLImageElement | null;
      const right = document.getElementById("clawd-right") as HTMLImageElement | null;
      return Boolean(left?.complete && (left.naturalWidth > 0) && right?.complete && (right.naturalWidth > 0));
    });

    expect(imagesLoaded).toBe(true);
  });

  test("con preferencia portafolio.lang en inglés se presenta traducida", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("portafolio.lang", "en");
    });

    await page.goto("./404.html");

    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle("Page not found · Eidan Carreño");
    await expect(page.locator("h1")).toHaveText("404 · Clawd got lost");
    await expect(page.locator("#home-btn")).toHaveText("Back to home");
  });
});
