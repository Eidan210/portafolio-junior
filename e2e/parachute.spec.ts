import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

type ParachuteState = {
  feet: number;
  ground: number | null;
  canopy: number;
  hello: boolean;
  on: "burbuja" | "barra" | "footer";
};

const probeState = (): ParachuteState | null => {
  const g = document.querySelector(".parachute-group");
  if (!g) return null;
  const r = g.getBoundingClientRect();
  const canopy = g.querySelector(".parachute-canopy");

  const visibleTop = (el: Element | null, x?: number): number | undefined => {
    if (!el) return undefined;
    const b = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    if (b.width === 0 || b.height === 0 || s.visibility === "hidden" || Number(s.opacity) === 0) return undefined;
    if (b.top < 0 || b.top > window.innerHeight) return undefined;
    if (x !== undefined && (x < b.left || x > b.right)) return undefined;
    return b.top;
  };

  const cx = r.left + r.width / 2;
  const footer = document.querySelector("[data-landing]");
  const track = visibleTop(document.querySelector("[data-route-track]"));
  const bubble = visibleTop(document.querySelector(`[data-route-track] [aria-label="Mensaje de Buddy"]`), cx);

  let ground: number | null = Math.min(
    footer ? footer.getBoundingClientRect().top : Infinity,
    track !== undefined ? track - 12 : Infinity,
    bubble !== undefined ? bubble - 2 : Infinity,
  );

  if (!(ground < window.innerHeight - 8)) ground = null;

  return {
    feet: Math.round(r.bottom * 10) / 10,
    ground: ground === null ? null : Math.round(ground * 10) / 10,
    canopy: canopy ? Number(getComputedStyle(canopy).opacity) : 0,
    hello: Array.from(g.querySelectorAll("span")).some((s) => s.textContent === "¡Hola!"),
    on: bubble !== undefined && ground === bubble - 2 ? "burbuja" : track !== undefined && ground === track - 12 ? "barra" : "footer",
  };
};

async function jump(page: Page, options: { midScroll?: number } = {}) {
  // Desplaza al fondo del documento para activar la suelta de Clawd desde el nav
  await page.evaluate((): void => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
  });

  const start = Date.now();
  let deployedAt: number | null = null;
  let scrolled = false;
  let landed: ParachuteState | null = null;
  let maxFeet = -Infinity;
  let seen = false;

  while (Date.now() - start < 20000) {
    const s = await page.evaluate(probeState);
    if (!s) {
      if (seen) break;
      // Pequeño intervalo de espera hasta que la animación monta el grupo del paracaídas
      await page.waitForTimeout(60);
      continue;
    }

    seen = true;
    maxFeet = Math.max(maxFeet, s.feet);

    if (deployedAt === null && s.canopy > 0.9) deployedAt = Date.now();

    if (options.midScroll && !scrolled && deployedAt !== null && Date.now() - deployedAt > 250) {
      await page.evaluate((dy: number): void => {
        window.scrollBy({ top: dy, behavior: "instant" });
      }, options.midScroll);
      scrolled = true;
    }

    if (s.hello && !landed) landed = s;

    // Intervalo de muestreo para seguir la trayectoria de descenso
    await page.waitForTimeout(50);
  }

  return { seen, landed, maxFeet, scrolled };
}

test.describe("Aterrizaje en paracaídas de NavParachute", () => {
  test("en móvil, aterriza sobre la burbuja o la barra de ruta a ±3 px", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "movil");

    await page.goto("./#contacto");
    // Pausa técnica para permitir que la página y sus elementos inferiores se estabilicen
    await page.waitForTimeout(2000);

    const r = await jump(page);
    expect(r.seen).toBe(true);
    expect(r.landed).not.toBeNull();
    expect(r.landed?.ground).not.toBeNull();
    expect(Math.abs(r.landed!.feet - r.landed!.ground!)).toBeLessThanOrEqual(3);
  });

  test("en escritorio, con scroll de -60 px a mitad del descenso aterriza sobre el footer movido", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "escritorio");

    await page.goto("./#contacto");
    await page.waitForTimeout(2000);

    const r = await jump(page, { midScroll: -60 });
    expect(r.seen).toBe(true);
    expect(r.scrolled).toBe(true);
    expect(r.landed).not.toBeNull();
    expect(r.landed?.ground).not.toBeNull();
    expect(Math.abs(r.landed!.feet - r.landed!.ground!)).toBeLessThanOrEqual(3);
  });

  test("en escritorio, con scroll de -500 px sale por abajo sin saludar", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "escritorio");

    await page.goto("./#contacto");
    await page.waitForTimeout(2000);

    const r = await jump(page, { midScroll: -500 });
    expect(r.seen).toBe(true);
    expect(r.scrolled).toBe(true);
    // Al perder el suelo no saluda
    expect(r.landed).toBeNull();
    // Sale por abajo del viewport de 900 px
    expect(r.maxFeet).toBeGreaterThan(800);
  });
});
