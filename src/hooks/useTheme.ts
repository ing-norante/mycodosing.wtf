import { createContext, useContext } from "react";

export type ColorTheme = "teal" | "purple" | "yellow" | "lime";
export type Mode = "light" | "dark" | "system";

export interface ThemeContextValue {
  colorTheme: ColorTheme;
  mode: Mode;
  resolvedMode: "light" | "dark";
  setColorTheme: (theme: ColorTheme) => void;
  setMode: (mode: Mode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
