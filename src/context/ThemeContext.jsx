import { useState, useEffect, useCallback } from "react";
import { ThemeContext } from "./themeContext.js";

const STORAGE_KEY = "slovo-cards-theme";

function getInitialTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? "light";
  } catch {
    return "light";
  }
}


export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  // Drop the preload class so theme-toggle transitions are enabled again.
  useEffect(() => { document.documentElement.classList.remove("preload"); }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      console.warn("slovo-cards: failed to persist theme to localStorage", e);
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

