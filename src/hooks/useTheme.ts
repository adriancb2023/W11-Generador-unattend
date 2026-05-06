import { useEffect, useState } from "react";

export type ResolvedTheme = "light" | "dark";

export function getStoredTheme(): "light" | "dark" | "system" {
  const v = localStorage.getItem("theme");
  if (v === "light" || v === "dark" || v === "system") return v;
  return "system";
}

export function resolveTheme(mode: "light" | "dark" | "system"): ResolvedTheme {
  if (mode === "light" || mode === "dark") return mode;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [mode, setMode] = useState<"light" | "dark" | "system">(() =>
    typeof window === "undefined" ? "system" : getStoredTheme(),
  );

  useEffect(() => {
    const resolved = resolveTheme(mode);
    document.documentElement.dataset.theme = resolved;
    localStorage.setItem("theme", mode);
  }, [mode]);

  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.dataset.theme = mq.matches ? "dark" : "light";
    };
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mode]);

  return { mode, setMode };
}
