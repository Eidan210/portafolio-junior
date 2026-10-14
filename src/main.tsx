import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/silkscreen";
import "@/styles/globals.css";
import "@/buddy/buddy.css";
import { App } from "@/App";
import { meta } from "@/data/ui";
import { lang } from "@/i18n/lang";

// El HTML estático está en español: idioma, título y descripción siguen al idioma elegido.
document.documentElement.lang = lang;
document.title = meta.title;
document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);

const root = document.getElementById("root");
if (!root) throw new Error("No se encontró #root en index.html");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
