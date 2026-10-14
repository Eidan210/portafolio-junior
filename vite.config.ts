import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Precarga las fuentes del primer pintado (subconjunto latin, que cubre tildes
 * y eñes). Sin esto se piden al maquetar el texto, el primer render sale con la
 * fuente de respaldo y al llegar la buena el hero se recoloca: en Linux, cuyas
 * fuentes de respaldo son más anchas, Lighthouse medía un CLS de 0,17.
 */
function preloadFonts(patterns: readonly RegExp[]): Plugin {
  return {
    name: "preload-fonts",
    apply: "build",
    // `post`: corre con el bundle ya generado, cuando existen los nombres con hash de las fuentes.
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        return Object.keys(ctx.bundle ?? {})
          .filter((file) => patterns.some((p) => p.test(file)))
          .map((file) => ({
            tag: "link",
            attrs: { rel: "preload", as: "font", type: "font/woff2", href: `./${file}`, crossorigin: "" },
            injectTo: "head" as const,
          }));
      },
    },
  };
}

// `base: "./"` deja el build portable: sirve igual en un dominio raíz que en
// un subpath de GitHub Pages sin reconfigurar.
export default defineConfig({
  base: "./",
  plugins: [
    react(),
    tailwindcss(),
    preloadFonts([/inter-latin-wght-normal-[\w-]+\.woff2$/, /plus-jakarta-sans-latin-wght-normal-[\w-]+\.woff2$/, /silkscreen-latin-400-normal-[\w-]+\.woff2$/]),
  ],
  // Mapas de fuentes publicados: el código ya es público en GitHub y así los errores del sitio se leen con su fuente.
  build: { sourcemap: true },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
