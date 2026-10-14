import { expect, test } from "@playwright/test";
import { en as uiEn } from "../src/data/en/ui";
import { langSwitch, meta, quickViewCopy } from "../src/data/ui";

test.describe("Internacionalización (i18n)", () => {
  test("locale por defecto (es-CO) presenta el sitio en español con metadatos acordes", async ({ page }) => {
    await page.goto("./");
    await expect(page.locator("html")).toHaveAttribute("lang", "es");
    await expect(page).toHaveTitle(meta.title);
    await expect(page.getByRole("button", { name: quickViewCopy.open })).toBeVisible();
  });

  test("parámetro ?lang=en cambia atributos, título y textos de la interfaz", async ({ page }, testInfo) => {
    await page.goto("./?lang=en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle(uiEn.meta.title);
    await expect(page.getByRole("button", { name: uiEn.quickViewCopy.open })).toBeVisible();

    if (testInfo.project.name === "escritorio") {
      const nav = page.locator("header nav");
      await expect(nav.getByRole("link", { name: new RegExp(uiEn.stationLabels["sobre-mi"]) })).toBeVisible();
      await expect(nav.getByRole("link", { name: new RegExp(uiEn.stationLabels.stack) })).toBeVisible();
      await expect(nav.getByRole("link", { name: new RegExp(uiEn.stationLabels.proyectos) })).toBeVisible();
      await expect(nav.getByRole("link", { name: new RegExp(uiEn.stationLabels.contacto) })).toBeVisible();
    }
  });

  test("botón de idioma conmuta a inglés, fija lang=en, conserva hash y persiste la preferencia", async ({ page }) => {
    await page.goto("./#proyectos");

    // El botón de cambio de idioma en el nav muestra "EN" cuando la web está en español
    const langBtn = page.locator("header nav").getByRole("button", { name: new RegExp(langSwitch.label) });
    await expect(langBtn).toBeVisible();
    await langBtn.click();

    // Conserva la sección actual y agrega el parámetro de búsqueda
    await expect(page).toHaveURL(/lang=en/);
    await expect(page).toHaveURL(/#proyectos/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");

    // Verifica que se haya guardado en localStorage
    const saved = await page.evaluate((): string | null => localStorage.getItem("portafolio.lang"));
    expect(saved).toBe("en");

    // Una visita subsecuente sin parámetro ?lang recuerda el idioma guardado
    await page.goto("./");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page).toHaveTitle(uiEn.meta.title);
  });

  test("en escritorio, tras cambiar de idioma no vuelve a mostrar la intro a pantalla completa", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "escritorio");

    await page.goto("./#inicio");
    const langBtn = page.locator("header nav").getByRole("button", { name: new RegExp(langSwitch.label) });
    await expect(langBtn).toBeVisible();
    await langBtn.click();

    await expect(page).toHaveURL(/lang=en/);

    // La capa de intro a pantalla completa (z-[70]) no debe volver a montarse
    await expect(page.locator(".z-\\[70\\]")).toHaveCount(0);
    await expect(page.locator("#hero-title")).toBeVisible();
  });
});
