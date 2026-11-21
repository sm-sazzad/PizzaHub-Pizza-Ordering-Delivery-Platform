"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { SunIcon, MoonIcon } from "@/components/ui/Icons";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = "",
  showLabel = false,
}) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`group relative p-2.5 rounded-xl border transition-all duration-300 focus:outline-none flex items-center gap-2 cursor-pointer ${
        isDark
          ? "bg-stone-800/90 hover:bg-stone-700/90 border-stone-700 text-amber-400 hover:text-amber-300 shadow-sm shadow-amber-500/10"
          : "bg-stone-100/90 hover:bg-stone-200/90 border-stone-200 text-stone-700 hover:text-stone-900 shadow-sm"
      } ${className}`}
    >
      <span className="transition-transform duration-300 group-hover:rotate-45 block">
        {isDark ? (
          <SunIcon size={18} className="text-amber-400" />
        ) : (
          <MoonIcon size={18} className="text-stone-700" />
        )}
      </span>
      {showLabel && (
        <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
          {isDark ? "Light Mode" : "Dark Mode"}
        </span>
      )}
    </button>
  );
};
