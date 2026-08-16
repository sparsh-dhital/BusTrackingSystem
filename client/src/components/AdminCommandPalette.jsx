// client/src/components/AdminCommandPalette.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminCommandPalette({ onAdminLogin }) {
  const [isOpen, setIsOpen] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate(); // React Router's smooth navigation

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
      // 1. Clear the form and close the palette
      setIsOpen(false);
      setPassphrase("");
      setError(false);

      // 2. Tell App.jsx that an admin is officially logged in
      if (onAdminLogin) {
        onAdminLogin({ role: "admin", idNumber: "SYS-ADMIN" });
      }

      // 3. Smoothly navigate to the correct portal route
      navigate("/admin-portal");
    } else {
      setError(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1D1D1F]/40 backdrop-blur-sm transition-opacity dark:bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-label="Admin Access Portal"
    >
      <form
        onSubmit={handleAdminLogin}
        className="w-full max-w-md rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#1C1C1E]/80 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
      >
        <h2 className="mb-4 text-xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
          System Override
        </h2>

        <label htmlFor="admin-key" className="sr-only">
          Admin Passphrase
        </label>
        <input
          id="admin-key"
          type="password"
          autoFocus
          className={`w-full rounded-xl border ${error ? "border-[#FF3B30] dark:border-[#FF453A]" : "border-transparent focus:border-[#007AFF] dark:border-white/10 dark:focus:border-[#0A84FF]"} bg-white px-4 py-3.5 text-[#1D1D1F] shadow-sm outline-none placeholder:text-[#86868B] transition-all focus:ring-4 focus:ring-[#007AFF]/15 dark:bg-black/40 dark:text-white dark:placeholder:text-[#636366] dark:focus:bg-black/60 dark:focus:ring-[#0A84FF]/25`}
          placeholder="Enter Admin Passphrase..."
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          aria-invalid={error}
        />
        {error && (
          <p
            className="mt-2 text-sm font-medium text-[#FF3B30] dark:text-[#FF453A]"
            role="alert"
          >
            Access Denied. Invalid credentials.
          </p>
        )}
      </form>
    </div>
  );
}