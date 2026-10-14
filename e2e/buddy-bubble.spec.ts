import { expect, test } from "@playwright/test";

test("cerrar la burbuja con el puntero encima no deja la pausa pegada y con hover no se retira", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "movil");
  test.slow();

  await page.goto("./#sobre-mi");
  // Espera breve para que Buddy se acople a la barra inferior tras abandonar el hero
  await page.waitForTimeout(1200);

  // 1. Cerrar con el puntero encima no debe dejar la pausa pegada
  await page.evaluate((): void => {
    document.getElementById("stack")?.scrollIntoView({ block: "start", behavior: "instant" });
  });

  const bubble = page.locator('[aria-label="Mensaje de Buddy"]');
  await expect(bubble).toBeVisible({ timeout: 8000 });

  // Pausa para esperar que la animación de escala y entrada termine de asentar la posición de la X
  await page.waitForTimeout(1000);

  const closeBtn = bubble.locator('[aria-label="Cerrar mensaje"]');
  await closeBtn.hover();
  await closeBtn.click();
  await expect(bubble).not.toBeVisible();

  // Mueve el cursor a una posición neutra fuera de la barra
  await page.mouse.move(20, 140);

  // Navega a la siguiente sección (proyectos)
  await page.evaluate((): void => {
    document.getElementById("proyectos")?.scrollIntoView({ block: "start", behavior: "instant" });
  });

  await expect(bubble).toBeVisible({ timeout: 8000 });

  // El comentario automático debe retirarse solo (la pausa no quedó pegada al cerrar con la X)
  await expect(bubble).not.toBeVisible({ timeout: 16000 });

  // 2. La pausa por hover mantiene abierta la burbuja
  await page.evaluate((): void => {
    document.getElementById("contacto")?.scrollIntoView({ block: "start", behavior: "instant" });
  });

  await expect(bubble).toBeVisible({ timeout: 8000 });
  // Pausa para que la burbuja se asiente antes de colocar el puntero
  await page.waitForTimeout(1000);

  await bubble.hover();

  // Espera de 14 s con el puntero encima: sin hover el comentario se retiraría en ~8 s
  await page.waitForTimeout(14000);
  await expect(bubble).toBeVisible();

  // Al retirar el puntero, la cuenta se reanuda y la burbuja se cierra sola
  await page.mouse.move(20, 140);
  await expect(bubble).not.toBeVisible({ timeout: 16000 });
});
