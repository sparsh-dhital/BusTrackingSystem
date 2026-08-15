// client/src/components/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-transit-light p-4 text-center transition-colors dark:bg-transit-dark"
      role="main"
      aria-labelledby="error-heading"
    >
      <h1
        className="text-9xl font-extrabold text-slate-200 dark:text-white/5"
        aria-hidden="true"
      >
        404
      </h1>
      <h2
        id="error-heading"
        className="mt-4 text-3xl font-bold text-slate-900 dark:text-white"
      >
        Route Not Found
      </h2>
      <p className="mt-2 font-medium text-slate-600 dark:text-slate-400">
        The destination you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-xl bg-transit-blue px-8 py-3 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
      >
        Return to Login
      </Link>
    </div>
  );
}