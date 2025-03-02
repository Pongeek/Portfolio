import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to true for dark mode
  
  // Function to check the actual current theme from DOM
  const checkCurrentTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    console.log("[ThemeToggle] Current theme check - dark mode:", isDark);
    setIsDarkMode(isDark);
    return isDark;
  };
  
  // Force dark mode to be the default state
  useEffect(() => {
    // Initially force dark mode
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
    localStorage.setItem("portfolio-theme", "dark");
    
    // Set mounted state and check current theme
    setMounted(true);
    setIsDarkMode(true); // Force dark mode in initial state
    
    // Delayed check to ensure we have the correct state
    setTimeout(() => {
      checkCurrentTheme();
    }, 50);
    
    // Use a MutationObserver to detect class changes on the document element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          checkCurrentTheme();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);
  
  // Toggle function that directly manipulates the DOM
  const toggleTheme = () => {
    const currentIsDark = checkCurrentTheme();
    console.log("[ThemeToggle] Toggle clicked, current isDark:", currentIsDark);
    
    if (currentIsDark) {
      console.log("[ThemeToggle] Switching to light mode");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("portfolio-theme", "light");
      setTheme("light");
    } else {
      console.log("[ThemeToggle] Switching to dark mode");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("portfolio-theme", "dark");
      setTheme("dark");
    }
    
    // Force check again after toggle
    setTimeout(checkCurrentTheme, 50);
  };
  
  // Don't render anything until after client-side hydration
  if (!mounted) return null;

  return (
    <Button 
      variant="outline" 
      size="icon"
      onClick={toggleTheme}
      className="transition-transform hover:rotate-45 duration-300 border-2 border-primary/40"
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5 transition-all animate-in duration-300" />
      ) : (
        <Moon className="h-5 w-5 transition-all animate-in duration-300" />
      )}
      <span className="sr-only">
        {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </Button>
  );
} 