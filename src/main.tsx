import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { getStoredTheme, resolveTheme } from "./hooks/useTheme";
import "./index.css";

const initialMode = getStoredTheme();
document.documentElement.dataset.theme = resolveTheme(initialMode);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
