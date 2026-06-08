"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

/**
 * Light/dark theme switch. Persists the choice to localStorage and toggles
 * the `dark` class on <html>. A no-flash script in the root layout applies
 * the saved theme before paint.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore storage failures (private mode, etc.)
    }
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={mounted ? isDark : undefined}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      onClick={toggle}
      className="group inline-flex items-center gap-3 rounded-full border-3 border-border bg-surface-sunken px-1 py-1 shadow-neo-sm transition-colors"
    >
      {/* Sun side */}
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full border-3 border-border transition-colors ${
          !isDark ? "bg-primary text-primary-fg" : "bg-transparent text-ink-soft"
        }`}
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
        </svg>
      </span>
      {/* Moon side */}
      <span
        className={`flex h-7 w-7 items-center justify-center rounded-full border-3 border-border transition-colors ${
          isDark ? "bg-secondary text-secondary-fg" : "bg-transparent text-ink-soft"
        }`}
        aria-hidden="true"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
      <span className="pr-2 text-sm font-semibold text-ink">
        {mounted ? (isDark ? "Dark" : "Light") : "Theme"}
      </span>
    </button>
  );
}
