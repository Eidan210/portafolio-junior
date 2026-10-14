/**
 * Pruebas E2E sobre el build de producción (`vite preview`) con el Chrome
 * instalado (`channel: "chrome"`): ni en local ni en CI hace falta descargar
 * navegadores. Escritorio y móvil, con animaciones completas (el sitio respeta
 * "reducir movimiento" del sistema y eso desactivaría lo que se prueba).
 */
import { defineConfig, devices } from "@playwright/test";

// Distinto del 4173 de `npm run preview`, para no chocar con una vista previa abierta.
const PORT = 4174;

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${PORT}/`,
    channel: "chrome",
    // El sitio elige idioma por el navegador: los tests van en español salvo que pidan ?lang=en.
    locale: "es-CO",
    reducedMotion: "no-preference",
    trace: "retain-on-failure",
  },
  webServer: {
    command: `npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: "escritorio", use: { ...devices["Desktop Chrome"], channel: "chrome", viewport: { width: 1440, height: 900 } } },
    { name: "movil", use: { ...devices["Pixel 7"], channel: "chrome" } },
  ],
});
