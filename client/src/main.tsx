import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted variable fonts — no external CDN requests
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
