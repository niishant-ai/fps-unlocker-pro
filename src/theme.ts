import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "fps-unlocker-theme";
const THEME_EVENT = "fps-unlocker-theme-change";

const THEME_META_COLOR: Record<Theme, string> = {
  dark: "#0a0e14",
  light: "#f7f9fc",
};

function readInitialTheme(): Theme {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.dataset.theme;
    if (attr === "light" || attr === "dark") return attr;
  }
  if (typeof window !== "undefined") {
    try {
      const param = new URLSearchParams(window.location.search).get("theme");
      if (param === "light" || param === "dark") return param;
      const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      // Storage unavailable (private mode / sandbox) — stay on default dark.
    }
  }
  return "dark";
}

let switchTimer: number | null = null;

export function applyTheme(next: Theme, persist = true) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const changed = root.dataset.theme !== next;

  if (changed) {
    root.classList.add("theme-switching");
    if (switchTimer !== null) window.clearTimeout(switchTimer);
    switchTimer = window.setTimeout(() => {
      root.classList.remove("theme-switching");
      switchTimer = null;
    }, 280);
  }

  root.dataset.theme = next;
  root.style.colorScheme = next;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_META_COLOR[next]);

  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Ignore storage write errors.
    }
  }

  window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: next }));
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(readInitialTheme);

  useEffect(() => {
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<Theme>).detail;
      if (detail === "light" || detail === "dark") setThemeState(detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === THEME_STORAGE_KEY && (e.newValue === "light" || e.newValue === "dark")) {
        applyTheme(e.newValue, false);
      }
    };
    window.addEventListener(THEME_EVENT, onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(THEME_EVENT, onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    applyTheme(next, true);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
