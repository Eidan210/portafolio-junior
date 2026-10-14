import { expect, test } from "@playwright/test";
import { konamiLine } from "../src/data/buddy-script";
import { buddyUiCopy } from "../src/data/ui";

test("la secuencia Konami por teclado muestra el confeti y el mensaje de Buddy", async ({ page }) => {
  // Con Buddy acoplado a la ruta: en el hero sus mensajes no tienen burbuja donde mostrarse.
  await page.goto("./#sobre-mi");
  await expect(page.locator("#sobre-mi")).toBeInViewport();

  // Secuencia Konami clásica: ↑ ↑ ↓ ↓ ← → ← → B A
  const keys = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
  ];

  for (const k of keys) {
    await page.keyboard.press(k);
  }

  // Capa fija de confeti (z-[60])
  const confetti = page.locator(".z-\\[60\\]");
  await expect(confetti).toBeAttached();
  await expect(confetti.locator("span")).toHaveCount(56);

  // Mensaje de Buddy con la frase oficial importada de buddy-script
  // Dentro de la burbuja: el texto también vive en la región aria-live del HUD (para lectores de pantalla).
  await expect(page.getByRole("region", { name: buddyUiCopy.messageAria })).toContainText(konamiLine);
});
