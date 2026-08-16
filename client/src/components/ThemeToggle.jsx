// client/src/components/ThemeToggle.jsx
import { useState, useEffect } from "react";

export default function ThemeToggle({ className = "" }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference on load
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Dark Mode"
      aria-pressed={isDarkMode}
      // Removed fixed positioning. Added glassy effect and removed browser outlines.
      className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-white/30 p-2.5 text-[#1D1D1F] shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl transition-all duration-300 hover:scale-110 active:scale-95 outline-none focus:outline-none [-webkit-tap-highlight-color:transparent] dark:border-white/10 dark:bg-white/10 dark:text-[#F5F5F7] dark:hover:bg-white/20 ${className}`}
    >
      {isDarkMode ? (
        <svg
          className="h-full w-full text-amber-400 drop-shadow-md"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="h-full w-full drop-shadow-md"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}