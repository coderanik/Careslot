"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "careslot-theme";

function getPreferredTheme(): Theme {
  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const initialTheme = getPreferredTheme();
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;

    function syncTheme(event: StorageEvent) {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      const nextTheme = getPreferredTheme();
      setTheme(nextTheme);
      document.documentElement.dataset.theme = nextTheme;
    }

    window.addEventListener("storage", syncTheme);
    return () => window.removeEventListener("storage", syncTheme);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  }

  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      aria-pressed={theme === "dark"}
      title={label}
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg-elevated)] text-[var(--ink)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      {theme === "light" ? (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
          <path
            d="M12 2.75v2M12 19.25v2M21.25 12h-2M4.75 12h-2m15.26-6.51-1.42 1.42M7.41 16.59l-1.42 1.42m12.02 0-1.42-1.42M7.41 7.41 5.99 5.99"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M20.2 15.05A8.5 8.5 0 0 1 8.95 3.8 8.6 8.6 0 1 0 20.2 15.05Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
