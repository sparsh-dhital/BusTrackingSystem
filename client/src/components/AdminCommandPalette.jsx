// client/src/components/AdminCommandPalette.jsx
import { useState, useEffect } from "react";

export default function AdminCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (passphrase === "secret-admin-key") {
      window.location.href = "/admin-dashboard";
    } else {
      setError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity dark:bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label="Admin Access Portal"
    >
      <form
        onSubmit={handleAdminLogin}
        className="w-full max-w-md rounded-2xl border border-white/40 bg-white/60 p-6 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80"
      >
        <label htmlFor="admin-key" className="sr-only">
          Admin Passphrase
        </label>
        <input
          id="admin-key"
          type="password"
          autoFocus
          className="w-full rounded-lg bg-white/50 px-4 py-3 text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-transit-blue dark:bg-black/40 dark:text-white dark:placeholder-slate-400"
          placeholder="Enter Admin Passphrase..."
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          aria-invalid={error}
        />
        {error && (
          <p
            className="mt-2 text-sm font-medium text-red-600 dark:text-red-400"
            role="alert"
          >
            Invalid credentials.
          </p>
        )}
      </form>
    </div>
  );
}