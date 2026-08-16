// client/src/components/DashboardLayout.jsx
import React from "react";
import ThemeToggle from "./ThemeToggle";

export default function DashboardLayout({
  children,
  title,
  userRole,
  onLogout,
}) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F5F5F7] text-[#1D1D1F] transition-colors duration-500 dark:bg-black dark:text-[#F5F5F7]">
      {/* Ambient Background Glows (Matching LoginForm) */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full bg-[#007AFF]/15 blur-[120px] transition-opacity duration-500 dark:bg-[#0A84FF]/25"></div>
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-[600px] w-[600px] rounded-full bg-[#AF52DE]/10 blur-[120px] transition-opacity duration-500 dark:bg-[#5E5CE6]/20"></div>

      {/* Frosted Glass Navbar */}
      <header className="relative z-20 flex h-20 items-center justify-between border-b border-white/50 bg-white/40 px-6 backdrop-blur-2xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/40 md:px-12">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
            {title}
          </h1>
          <span className="hidden rounded-full bg-black/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#86868B] dark:bg-white/10 dark:text-[#98989D] sm:inline-block">
            {userRole}
          </span>
        </div>

        {/* --- THE SWEET SPOT --- */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          <button
            onClick={onLogout}
            className="flex h-11 items-center gap-2 rounded-xl bg-black/5 px-4 font-semibold transition-all hover:bg-black/10 active:scale-95 dark:bg-white/10 dark:hover:bg-white/20"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            <span className="hidden text-sm sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 mx-auto max-w-7xl p-6 md:p-12">
        {children}
      </main>
    </div>
  );
}