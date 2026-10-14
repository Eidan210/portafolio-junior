import { expect, test } from "@playwright/test";
import stats from "../src/data/github-stats.json" with { type: "json" };
import { quickViewCopy } from "../src/data/ui";

test("el diálogo de vista rápida se abre, muestra datos correctos y se cierra por varios medios", async ({ page }) => {
  await page.goto("./");

  // El botón del hero abre el diálogo modal
  const trigger = page.getByRole("button", { name: quickViewCopy.open });
  await expect(trigger).toBeVisible();
  await trigger.click();

  const dialog = page.locator("dialog[open]");
  await expect(dialog).toBeVisible();

  // Título accesible asociado mediante aria-labelledby
  const labelledById = await dialog.getAttribute("aria-labelledby");
  expect(labelledById).toBeTruthy();
  const heading = dialog.locator(`#${labelledById}`);
  await expect(heading).toHaveText(quickViewCopy.title);

  // Stack con evidencia (al menos 4 tecnologías destacadas)
  const chips = dialog.locator("ul li");
  const chipCount = await chips.count();
  expect(chipCount).toBeGreaterThanOrEqual(4);

  // 3 proyectos destacados en lista ordenada
  const featured = dialog.locator("ol li");
  await expect(featured).toHaveCount(3);

  // Cifras de GitHub stats sin valores escritos a mano
  const facts = dialog.locator("dl");
  await expect(facts).toContainText(String(stats.repos));
  await expect(facts).toContainText(String(stats.contributions));

  // Bloqueo de scroll en la página de fondo
  const scrollLocked = await page.evaluate((): string => document.documentElement.style.overflow);
  expect(scrollLocked).toBe("hidden");

  // Esc cierra, devuelve el foco al disparador y libera el scroll
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeAttached();
  await expect(trigger).toBeFocused();

  const scrollRestored = await page.evaluate((): string => document.documentElement.style.overflow);
  expect(scrollRestored).toBe("");

  // Un clic fuera del panel (sobre el backdrop en 4, 4) cierra el diálogo
  await trigger.click();
  await expect(dialog).toBeVisible();
  await page.mouse.click(4, 4);
  await expect(dialog).not.toBeAttached();

  // «Escribirme» cierra el diálogo y lleva a #contacto
  await trigger.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: quickViewCopy.write }).click();
  await expect(dialog).not.toBeAttached();
  await expect(page.locator("#contacto")).toBeInViewport();
});
