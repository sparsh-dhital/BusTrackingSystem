// client/src/components/LoginForm.jsx
import { useState } from "react";
import BusLoader from "./BusLoader";
import ThemeToggle from "./ThemeToggle"; // <-- Imported ThemeToggle

export default function LoginForm({ onLogin }) {
  const [role, setRole] = useState("student");
  const [step, setStep] = useState(1); // 1 = Enter ID, 2 = Enter OTP
  const [idNumber, setIdNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpMethod, setOtpMethod] = useState(""); // 'whatsapp' or 'email'

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");

  const handleRequestOTP = async (method) => {
    const newErrors = {};
    if (!idNumber.trim()) {
      newErrors.idNumber = `Please enter a valid ${role === "student" ? "Registration Number" : "Driver ID"}.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSuccessMessage("");
    setIsLoading(true);
    setLoadingMessage(
      `Sending OTP via ${method === "whatsapp" ? "WhatsApp" : "Email"}...`,
    );
    setOtpMethod(method);

    try {
      // Call your Node.js backend API
      const response = await fetch(
        "http://localhost:5000/api/auth/request-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idNumber, method, role }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to request OTP");
      }

      setSuccessMessage(
        `OTP sent to your registered ${method === "whatsapp" ? "WhatsApp number" : "Email address"}.`,
      );
      setStep(2);
    } catch (err) {
      setErrors({ idNumber: err.message });
      setStep(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (otp.length < 6) {
      newErrors.otp = "OTP must be at least 6 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);
    setLoadingMessage("Authenticating credentials...");

    try {
      // Call your Node.js backend API to authorize the OTP
      const response = await fetch(
        "http://localhost:5000/api/auth/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idNumber, otp }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid verification code");
      }

      // Success! Pass authenticated user up to App.jsx
      onLogin({ idNumber: data.user.id, role: data.user.role });
    } catch (err) {
      setErrors({ otp: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <BusLoader message={loadingMessage} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F7] text-[#1D1D1F] transition-colors duration-500 dark:bg-black dark:text-[#F5F5F7] lg:flex-row">
      {/* --- THE SWEET SPOT FOR LOGIN PAGE --- */}
      <ThemeToggle className="absolute right-6 top-6 z-50" />

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
                <span className="h-0.5 w-12 rounded-full bg-gradient-to-r from-transparent to-[#FFCC00] opacity-70"></span>
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

            <div className="absolute bottom-6 inset-x-0 h-0.5 animate-dash-scroll bg-[repeating-linear-gradient(90deg,transparent,transparent_15px,#FFFFFF_15px,#FFFFFF_30px)]"></div>

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
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-112 w-md rounded-full bg-[#AF52DE]/10 blur-[120px] transition-opacity duration-500 dark:bg-[#5E5CE6]/20"></div>

        <form
          onSubmit={step === 2 ? handleVerifyOTP : (e) => e.preventDefault()}
          className="relative z-10 w-full max-w-md rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          aria-labelledby="login-heading"
        >
          <h2
            id="login-heading"
            className="mb-8 text-center text-3xl font-semibold tracking-tight"
          >
            Sign In
          </h2>

          {/* Role Selection Tabs - Only show in Step 1 */}
          {step === 1 && (
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
                  onClick={() => {
                    setRole(r);
                    setErrors({});
                    setIdNumber("");
                  }}
                  aria-pressed={role === r}
                >
                  {r}
                </button>
              ))}
            </div>
          )}

          {/* Success Message Banner */}
          {successMessage && (
            <div className="mb-6 rounded-xl bg-green-50/50 p-4 border border-green-200 dark:bg-green-900/20 dark:border-green-800 backdrop-blur-md">
              <p className="text-sm font-medium text-green-800 dark:text-green-300 text-center">
                {successMessage}
              </p>
            </div>
          )}

          <div className="space-y-6">
            {step === 1 ? (
              /* --- STEP 1: ID ENTRY --- */
              <div>
                <label
                  htmlFor="idNumber"
                  className="mb-1.5 block text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]"
                >
                  {role === "student" ? "Registration Number" : "Driver ID"}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    {/* User ID Icon */}
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
                        d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="idNumber"
                    type="text"
                    placeholder={`Enter your ${role === "student" ? "Registration Number" : "ID"}`}
                    className={`w-full rounded-xl border ${errors.idNumber ? "border-[#FF3B30] dark:border-[#FF453A]" : "border-transparent focus:border-[#007AFF] dark:border-white/10 dark:focus:border-[#0A84FF]"} bg-white pl-11 pr-4 py-3.5 text-[#1D1D1F] shadow-sm outline-none placeholder:text-[#86868B] transition-all focus:ring-4 focus:ring-[#007AFF]/15 dark:bg-black/40 dark:text-white dark:placeholder:text-[#636366] dark:focus:bg-black/60 dark:focus:ring-[#0A84FF]/25`}
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    aria-invalid={!!errors.idNumber}
                    aria-describedby={errors.idNumber ? "id-error" : undefined}
                  />
                </div>
                {errors.idNumber && (
                  <span
                    id="id-error"
                    className="mt-1.5 block text-xs font-medium text-[#FF3B30] dark:text-[#FF453A]"
                  >
                    {errors.idNumber}
                  </span>
                )}

                {/* OTP Request Buttons */}
                <div className="mt-8 space-y-3">
                  <p className="text-xs text-center text-[#86868B] dark:text-[#98989D] uppercase tracking-wider font-semibold">
                    Get Verification Code Via
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleRequestOTP("whatsapp")}
                      className="w-full rounded-xl bg-[#25D366] py-3 text-sm font-semibold tracking-wide text-white shadow-lg transition-all hover:bg-[#20bd5a] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRequestOTP("email")}
                      className="w-full rounded-xl bg-[#007AFF] py-3 text-sm font-semibold tracking-wide text-white shadow-lg transition-all hover:bg-[#0071E3] active:scale-[0.98] dark:bg-[#0A84FF] dark:hover:bg-[#007AFF] focus:outline-none focus:ring-4 focus:ring-[#007AFF]/30 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      Email
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* --- STEP 2: OTP ENTRY --- */
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <label
                  htmlFor="otp"
                  className="mb-1.5 block text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]"
                >
                  One-Time Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    {/* Key/Lock Icon */}
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
                        d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"
                      />
                    </svg>
                  </div>
                  <input
                    id="otp"
                    type="text"
                    maxLength="6"
                    placeholder="• • • • • •"
                    className={`w-full rounded-xl border ${errors.otp ? "border-[#FF3B30] dark:border-[#FF453A]" : "border-transparent focus:border-[#007AFF] dark:border-white/10 dark:focus:border-[#0A84FF]"} bg-white pl-11 pr-4 py-3.5 text-center text-lg tracking-[0.5em] text-[#1D1D1F] shadow-sm outline-none placeholder:text-[#86868B] placeholder:tracking-normal transition-all focus:ring-4 focus:ring-[#007AFF]/15 dark:bg-black/40 dark:text-white dark:placeholder:text-[#636366] dark:focus:bg-black/60 dark:focus:ring-[#0A84FF]/25`}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    aria-invalid={!!errors.otp}
                    aria-describedby={errors.otp ? "otp-error" : undefined}
                  />
                </div>
                {errors.otp && (
                  <span
                    id="otp-error"
                    className="mt-1.5 block text-xs font-medium text-[#FF3B30] dark:text-[#FF453A] text-center"
                  >
                    {errors.otp}
                  </span>
                )}

                <button
                  type="submit"
                  className="mt-8 w-full rounded-xl bg-[#007AFF] py-3.5 font-semibold tracking-wide text-white shadow-lg transition-all hover:bg-[#0071E3] active:scale-[0.98] dark:bg-[#0A84FF] dark:hover:bg-[#007AFF] focus:outline-none focus:ring-4 focus:ring-[#007AFF]/30"
                >
                  Verify & Continue
                </button>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setOtp("");
                      setErrors({});
                      setSuccessMessage("");
                    }}
                    className="text-sm font-medium text-[#86868B] hover:text-[#1D1D1F] transition-colors dark:text-[#98989D] dark:hover:text-white flex items-center justify-center gap-1 mx-auto"
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
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back to ID Entry
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}