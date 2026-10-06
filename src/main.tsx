import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource/silkscreen";
import "@/styles/globals.css";
import "@/buddy/buddy.css";
import { App } from "@/App";

const root = document.getElementById("root");
if (!root) throw new Error("No se encontró #root en index.html");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
