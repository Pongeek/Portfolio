import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  forceDarkMode?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Apply theme class to document
const applyTheme = (theme: Theme) => {
  if (typeof window === "undefined") return;
  
  const root = window.document.documentElement;
  root.classList.remove("light", "dark");
  
  console.log("[ThemeProvider] Applying theme:", theme);
  
  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    console.log(`[ThemeProvider] System theme detected: ${systemTheme}`);
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

// Force dark mode application
const forceDarkMode = () => {
  if (typeof window === "undefined") return;
  
  const root = window.document.documentElement;
  root.classList.remove("light");
  root.classList.add("dark");
  console.log("[ThemeProvider] Forced dark mode");
};

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "portfolio-theme",
  forceDarkMode: shouldForceDarkMode = true, // Add with default true
  ...props
}: ThemeProviderProps) {
  // Initialize theme state
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark"; // Always default to dark in SSR
    
    try {
      // If forcing dark mode, ignore stored theme
      if (shouldForceDarkMode) {
        console.log("[ThemeProvider] Using forced dark mode");
        return "dark";
      }
      
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      console.log("[ThemeProvider] Initial load, stored theme:", storedTheme);
      return storedTheme || defaultTheme;
    } catch (error) {
      console.error("[ThemeProvider] Error accessing localStorage:", error);
      return "dark"; // Fallback to dark mode on error
    }
  });

  // Force dark mode on first render
  useEffect(() => {
    console.log("[ThemeProvider] Provider mounted");
    
    // Apply dark mode immediately
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    
    // Set dark theme in localStorage
    try {
      localStorage.setItem(storageKey, "dark");
    } catch (err) {
      console.error("[ThemeProvider] Error setting localStorage:", err);
    }
    
    // Apply dark theme after a short delay to ensure it takes effect
    setTimeout(() => {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }, 0);
  }, []);

  // Apply theme when state changes (but not on initial mount)
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    console.log("[ThemeProvider] Theme state changed to:", theme);
    
    try {
      localStorage.setItem(storageKey, theme);
      applyTheme(theme);
    } catch (error) {
      console.error("[ThemeProvider] Error setting theme:", error);
    }
  }, [theme, storageKey]);

  // Listen for system preference changes
  useEffect(() => {
    if (typeof window === "undefined" || theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      console.log("[ThemeProvider] System preference changed");
      applyTheme("system");
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      console.log("[ThemeProvider] setTheme called with:", newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
}; 