// client/src/components/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#F5F5F7] p-4 text-center text-[#1D1D1F] transition-colors duration-500 dark:bg-black dark:text-[#F5F5F7]"
      role="main"
      aria-labelledby="error-heading"
    >
      {/* Ambient Glow Effects matching LoginForm */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#007AFF]/15 blur-[120px] dark:bg-[#0A84FF]/25"></div>
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-112 w-md rounded-full bg-[#AF52DE]/10 blur-[120px] transition-opacity duration-500 dark:bg-[#5E5CE6]/20"></div>

      <div className="relative z-10 flex flex-col items-center max-w-md w-full rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <h1
          className="text-8xl font-black tracking-tighter text-[#86868B]/30 dark:text-white/10"
          aria-hidden="true"
        >
          404
        </h1>
        <h2
          id="error-heading"
          className="mt-4 text-3xl font-semibold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]"
        >
          Route Not Found
        </h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-[#86868B] dark:text-[#98989D]">
          The destination or transit path you are looking for does not exist.
        </p>
        <Link
          to="/"
          className="mt-8 w-full rounded-xl bg-[#007AFF] py-3.5 font-semibold tracking-wide text-white shadow-lg transition-all hover:bg-[#0071E3] active:scale-[0.98] dark:bg-[#0A84FF] dark:hover:bg-[#007AFF] focus:outline-none focus:ring-4 focus:ring-[#007AFF]/30 flex items-center justify-center gap-2"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}