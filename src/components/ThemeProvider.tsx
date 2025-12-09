import { useCallback, useSyncExternalStore, type ReactNode } from "react";
import { ThemeContext, type ColorTheme, type Mode } from "@/hooks/useTheme";

const STORAGE_KEY_COLOR = "mycodosing-color-theme";
const STORAGE_KEY_MODE = "mycodosing-mode";

function getStoredColorTheme(): ColorTheme {
  if (typeof window === "undefined") return "teal";
  const stored = localStorage.getItem(STORAGE_KEY_COLOR);
  if (stored && ["teal", "purple", "yellow", "lime"].includes(stored)) {
    return stored as ColorTheme;
  }
  return "teal";
}

function getStoredMode(): Mode {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(STORAGE_KEY_MODE);
  if (stored && ["light", "dark", "system"].includes(stored)) {
    return stored as Mode;
  }
  return "system";
}

function getSystemPreference(): "light" | "dark" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(colorTheme: ColorTheme, mode: Mode) {
  const root = document.documentElement;
  const resolvedMode = mode === "system" ? getSystemPreference() : mode;

  // Set color theme
  root.setAttribute("data-color-theme", colorTheme);

  // Set dark mode class
  if (resolvedMode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

// External store for system preference
function subscribeToSystemPreference(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getSystemPreferenceSnapshot() {
  return getSystemPreference();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Use useSyncExternalStore to track system preference changes
  const systemPreference = useSyncExternalStore(
    subscribeToSystemPreference,
    getSystemPreferenceSnapshot,
    () => "light" as const,
  );

  // Use useSyncExternalStore for localStorage values
  const colorTheme = useSyncExternalStore(
    useCallback((callback: () => void) => {
      const handler = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY_COLOR) callback();
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    }, []),
    () => getStoredColorTheme(),
    () => "teal" as ColorTheme,
  );

  const mode = useSyncExternalStore(
    useCallback((callback: () => void) => {
      const handler = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY_MODE) callback();
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    }, []),
    () => getStoredMode(),
    () => "system" as Mode,
  );

  const resolvedMode = mode === "system" ? systemPreference : mode;

  // Apply theme whenever values change
  // Using a synchronous approach to avoid flicker
  if (typeof window !== "undefined") {
    applyTheme(colorTheme, mode);
  }

  const setColorTheme = useCallback((newTheme: ColorTheme) => {
    localStorage.setItem(STORAGE_KEY_COLOR, newTheme);
    applyTheme(newTheme, getStoredMode());
    // Trigger re-render by dispatching a storage event
    window.dispatchEvent(
      new StorageEvent("storage", { key: STORAGE_KEY_COLOR }),
    );
  }, []);

  const setMode = useCallback((newMode: Mode) => {
    localStorage.setItem(STORAGE_KEY_MODE, newMode);
    applyTheme(getStoredColorTheme(), newMode);
    // Trigger re-render by dispatching a storage event
    window.dispatchEvent(
      new StorageEvent("storage", { key: STORAGE_KEY_MODE }),
    );
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        colorTheme,
        mode,
        resolvedMode,
        setColorTheme,
        setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
