// client/src/components/LoginForm.jsx
import { useState } from "react";
import BusLoader from "./BusLoader";

export default function LoginForm({ onLogin }) {
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.email.includes("@"))
      newErrors.email = "Please enter a valid email address.";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validate();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        onLogin({ ...formData, role });
      }, 2000);
    }
  };

  if (isLoading) {
    return <BusLoader message="Authenticating credentials..." />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7] text-[#1D1D1F] transition-colors duration-500 dark:bg-black dark:text-[#F5F5F7] lg:flex-row">
      {/* LEFT PANE - Vertically centered stack containing typography, submessage, and the road */}
      <div
        className="relative flex min-h-[500px] w-full flex-col items-center justify-center overflow-hidden bg-black text-white shadow-2xl lg:min-h-screen lg:w-1/2 py-12"
        aria-hidden="true"
      >
        {/* Ambient Glow */}
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0A84FF]/15 blur-[120px]"></div>

        {/* --- UNIFIED CENTERED STACK --- */}
        <div className="relative z-10 flex flex-col items-center text-center w-full space-y-10">
          {/* Typography Block */}
          <div className="px-8 lg:px-16">
            <h1 className="flex flex-col items-center justify-center">
              <span className="bg-gradient-to-b from-white via-white to-[#636366] bg-clip-text text-7xl font-black tracking-tighter text-transparent drop-shadow-sm sm:text-8xl lg:text-9xl">
                VIGNAN
              </span>
              <span className="mt-2 flex items-center gap-4 text-xl font-light tracking-[0.3em] text-white sm:text-2xl lg:text-3xl">
                <span className="h-[2px] w-12 rounded-full bg-gradient-to-r from-transparent to-[#FFCC00] opacity-70"></span>
                <span className="font-semibold text-[#FFCC00]">TMS</span>
                <span className="h-[2px] w-12 rounded-full bg-gradient-to-l from-transparent to-[#FFCC00] opacity-70"></span>
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm font-medium leading-relaxed text-[#86868B] sm:text-base lg:mt-8">
              Next-generation fleet intelligence, seamless campus mobility, and
              real-time transit tracking.
            </p>
          </div>

          {/* --- EDGE-TO-EDGE ROAD & BUS CONTAINER (Integrated in the center stack) --- */}
          <div className="relative w-full h-24">
            <div className="absolute inset-x-0 bottom-0 w-full h-14 border-y border-[#38383A] bg-[#1C1C1E]/40 backdrop-blur-sm"></div>

            <div className="absolute bottom-6 inset-x-0 h-[2px] animate-dash-scroll bg-[repeating-linear-gradient(90deg,transparent,transparent_15px,#FFFFFF_15px,#FFFFFF_30px)]"></div>

            <div className="absolute bottom-6 left-0 animate-drive-loop">
              <svg
                className="h-16 w-32 drop-shadow-2xl"
                viewBox="0 0 64 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 8C4 5.79086 5.79086 4 8 4H52C56.4183 4 60 7.58172 60 12V24C60 25.1046 59.1046 26 58 26H6C4.89543 26 4 25.1046 4 24V8Z"
                  className="fill-[#FFCC00]"
                />
                <rect x="8" y="8" width="8" height="6" rx="1" fill="#000000" />
                <rect x="18" y="8" width="8" height="6" rx="1" fill="#000000" />
                <rect x="28" y="8" width="8" height="6" rx="1" fill="#000000" />
                <rect x="38" y="8" width="8" height="6" rx="1" fill="#000000" />
                <rect x="48" y="8" width="8" height="6" rx="1" fill="#000000" />
                <circle
                  cx="16"
                  cy="27"
                  r="5"
                  fill="#1C1C1E"
                  stroke="#38383A"
                  strokeWidth="1.5"
                />
                <circle
                  cx="48"
                  cy="27"
                  r="5"
                  fill="#1C1C1E"
                  stroke="#38383A"
                  strokeWidth="1.5"
                />
                <circle cx="16" cy="27" r="2" fill="#86868B" />
                <circle cx="48" cy="27" r="2" fill="#86868B" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANE */}
      <div className="relative flex w-full overflow-hidden items-center justify-center p-8 lg:w-1/2">
        <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#007AFF]/15 blur-[100px] transition-opacity duration-500 dark:bg-[#0A84FF]/25"></div>
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-[28rem] w-[28rem] rounded-full bg-[#AF52DE]/10 blur-[120px] transition-opacity duration-500 dark:bg-[#5E5CE6]/20"></div>

        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full max-w-md rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          aria-labelledby="login-heading"
        >
          <h2
            id="login-heading"
            className="mb-8 text-center text-3xl font-semibold tracking-tight"
          >
            Sign In
          </h2>

          <div
            className="mb-8 flex rounded-xl border border-black/5 bg-black/5 p-1 shadow-inner backdrop-blur-md transition-colors duration-500 dark:border-white/5 dark:bg-white/5"
            role="group"
            aria-label="Select your role"
          >
            {["student", "driver"].map((r) => (
              <button
                key={r}
                type="button"
                className={`w-1/2 rounded-lg py-2.5 text-sm font-medium capitalize transition-all duration-300 ${
                  role === r
                    ? "bg-white text-black shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:bg-[#636366]/80 dark:text-white dark:shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                    : "text-[#86868B] hover:text-[#1D1D1F] dark:text-[#98989D] dark:hover:text-white"
                }`}
                onClick={() => setRole(r)}
                aria-pressed={role === r}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg
                    className="h-5 w-5 text-[#86868B] dark:text-[#98989D]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@vignan.ac.in"
                  className={`w-full rounded-xl border ${errors.email ? "border-[#FF3B30] dark:border-[#FF453A]" : "border-transparent focus:border-[#007AFF] dark:border-white/10 dark:focus:border-[#0A84FF]"} bg-white pl-11 pr-4 py-3.5 text-[#1D1D1F] shadow-sm outline-none placeholder:text-[#86868B] transition-all focus:ring-4 focus:ring-[#007AFF]/15 dark:bg-black/40 dark:text-white dark:placeholder:text-[#636366] dark:focus:bg-black/60 dark:focus:ring-[#0A84FF]/25`}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <span
                  id="email-error"
                  className="mt-1.5 block text-xs font-medium text-[#FF3B30] dark:text-[#FF453A]"
                >
                  {errors.email}
                </span>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <svg
                    className="h-5 w-5 text-[#86868B] dark:text-[#98989D]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={`w-full rounded-xl border ${errors.password ? "border-[#FF3B30] dark:border-[#FF453A]" : "border-transparent focus:border-[#007AFF] dark:border-white/10 dark:focus:border-[#0A84FF]"} bg-white pl-11 pr-4 py-3.5 text-[#1D1D1F] shadow-sm outline-none placeholder:text-[#86868B] transition-all focus:ring-4 focus:ring-[#007AFF]/15 dark:bg-black/40 dark:text-white dark:placeholder:text-[#636366] dark:focus:bg-black/60 dark:focus:ring-[#0A84FF]/25`}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
              </div>
              {errors.password && (
                <span
                  id="password-error"
                  className="mt-1.5 block text-xs font-medium text-[#FF3B30] dark:text-[#FF453A]"
                >
                  {errors.password}
                </span>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="mt-10 w-full rounded-xl bg-[#007AFF] py-3.5 font-semibold tracking-wide text-white shadow-lg transition-all hover:bg-[#0071E3] active:scale-[0.98] dark:bg-[#0A84FF] dark:hover:bg-[#007AFF] focus:outline-none focus:ring-4 focus:ring-[#007AFF]/30"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}