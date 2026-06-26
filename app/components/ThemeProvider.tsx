"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import ThemeTransition from "./ThemeTransition";

type Theme = "pink" | "yellow" | "blue";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("pink");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTheme, setTransitionTheme] = useState<Theme | null>(null);

  useEffect(() => {
    // On mount, read from localStorage or default to pink
    const savedTheme = localStorage.getItem("portfolio-theme") as Theme;
    if (savedTheme && ["pink", "yellow", "white"].includes(savedTheme)) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "pink");
    }
  }, []);

  const setTheme = (newTheme: Theme) => {
    if (newTheme === theme || isTransitioning) return;
    
    // Start transition
    setTransitionTheme(newTheme);
    setIsTransitioning(true);

    // Wait a bit for the overlay to cover the screen before changing actual CSS variables
    setTimeout(() => {
      setThemeState(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("portfolio-theme", newTheme);
    }, 800);

    // End transition
    setTimeout(() => {
      setIsTransitioning(false);
      setTransitionTheme(null);
    }, 2500); // Total transition time
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
      <AnimatePresence>
        {isTransitioning && transitionTheme && (
          <ThemeTransition targetTheme={transitionTheme} />
        )}
      </AnimatePresence>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
