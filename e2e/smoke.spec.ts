import { expect, test } from "@playwright/test";

test("el portafolio carga sin errores y muestra sus secciones", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("./#proyectos");
  for (const id of ["inicio", "sobre-mi", "stack", "proyectos", "contacto"]) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await expect(page.locator("#proyectos")).toBeVisible();
  expect(errors).toEqual([]);
});
