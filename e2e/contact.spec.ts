import { expect, test } from "@playwright/test";
import { autoCopy, channelCopy, validationCopy } from "../src/data/contact-copy";

test.describe("Formulario de contacto", () => {
  test("enviar vacío muestra los errores de validación y no abre nada", async ({ page }) => {
    await page.goto("./#contacto");
    const form = page.locator("#contacto form");

    await form.getByRole("button", { name: /Enviar/ }).click();

    // Errores de validación visibles
    await expect(form.getByText(validationCopy.name)).toBeVisible();
    await expect(form.getByText(validationCopy.email)).toBeVisible();
    await expect(form.getByText(validationCopy.messageShort)).toBeVisible();

    // No debe aparecer estado de apertura ni de enviado
    await expect(page.getByText(channelCopy.web.openedTitle)).toHaveCount(0);
    await expect(page.getByText(channelCopy.app.openedTitle)).toHaveCount(0);
    await expect(page.getByText(autoCopy.sentTitle)).toHaveCount(0);
  });

  test("en escritorio, con ventana simulada queda listo en Gmail y envía la URL", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "escritorio");

    // Sustituye window.open con una pestaña simulada antes de navegar
    await page.addInitScript(() => {
      (window as unknown as { __openedTabs: Array<{ url: string; target?: string; fakeTab: { opener: unknown; location: { href: string } } }> }).__openedTabs = [];
      window.open = ((url?: string | URL, target?: string) => {
        const fakeTab = { opener: {}, location: { href: "" } };
        (window as unknown as { __openedTabs: Array<{ url: string; target?: string; fakeTab: { opener: unknown; location: { href: string } } }> }).__openedTabs.push({ url: String(url ?? ""), target, fakeTab });
        return fakeTab as unknown as Window;
      }) as typeof window.open;
    });

    await page.goto("./#contacto");
    const form = page.locator("#contacto form");

    await form.locator("input[type='text']").first().fill("Eidan Tester");
    await form.locator("input[type='email']").fill("tester@example.com");
    await form.locator("textarea").fill("Hola Eidan, este es un mensaje de prueba con longitud suficiente.");

    await form.getByRole("button", { name: /Enviar/ }).click();

    // Debe mostrar la vista de confirmación en Gmail
    await expect(page.getByText(channelCopy.web.openedTitle)).toBeVisible();
    await expect(page.getByText(autoCopy.sentTitle)).toHaveCount(0);

    // La pestaña simulada debe haber recibido la URL de redacción de Gmail
    const targetHref = await page.evaluate((): string => {
      const tabs = (window as unknown as { __openedTabs?: Array<{ fakeTab: { location: { href: string } } }> }).__openedTabs;
      return tabs?.[0]?.fakeTab.location.href ?? "";
    });

    expect(targetHref).toContain("mail.google.com");
    expect(targetHref).toContain(encodeURIComponent("Hola Eidan"));
  });

  test("en escritorio, si window.open retorna null muestra aviso de bloqueo y reintento", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "escritorio");

    await page.addInitScript(() => {
      window.open = () => null;
    });

    await page.goto("./#contacto");
    const form = page.locator("#contacto form");

    await form.locator("input[type='text']").first().fill("Eidan Tester");
    await form.locator("input[type='email']").fill("tester@example.com");
    await form.locator("textarea").fill("Mensaje de prueba para verificar aviso de bloqueo.");

    await form.getByRole("button", { name: /Enviar/ }).click();

    // Aviso de bloqueo del navegador visible con botón de reintento
    await expect(page.getByText(channelCopy.web.blockedTitle)).toBeVisible();
    const retryBtn = page.locator("#contacto").getByRole("link", { name: channelCopy.web.retry });
    await expect(retryBtn).toBeVisible();
    await expect(retryBtn).toHaveAttribute("href", /mail\.google\.com/);
    await expect(page.getByText(autoCopy.sentTitle)).toHaveCount(0);
  });

  test("en móvil, tras esperar el intento de mailto se muestra aviso de no apertura", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "movil");

    await page.goto("./#contacto");
    const form = page.locator("#contacto form");

    await form.locator("input[type='text']").first().fill("Móvil Tester");
    await form.locator("input[type='email']").fill("movil@example.com");
    await form.locator("textarea").fill("Probando el flujo de correo en cliente móvil headless.");

    await form.getByRole("button", { name: /Enviar/ }).click();

    // En headless el mailto no cambia la visibilidad del documento, por lo que a los ~2 s se dispara el aviso
    await expect(page.getByText(channelCopy.app.blockedTitle)).toBeVisible({ timeout: 6000 });

    // Nunca debe declarar éxito o envío completado
    await expect(page.getByText(channelCopy.app.openedTitle)).toHaveCount(0);
    await expect(page.getByText(autoCopy.sentTitle)).toHaveCount(0);
  });
});
