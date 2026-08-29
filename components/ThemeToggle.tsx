"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-divider"
        aria-label="Toggle theme"
      >
        <span className="w-5 h-5 block" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="group relative w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-divider hover:border-accent/50 transition-all duration-300 shadow-sm hover:shadow-md overflow-hidden"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {theme === "dark" ? (
          <Sun className="w-full h-full text-foreground transition-all duration-500" />
        ) : (
          <Moon className="w-full h-full text-foreground transition-all duration-500" />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
}
