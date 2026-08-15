import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import DriverDashboard from "./DriverDashboard";
import TrackingMap from "./TrackingMap";

function LandingPage() {
  const [selectedRole, setSelectedRole] = useState("Student");
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (selectedRole === "Student") {
      if (step === 1) {
        alert(
          `OTP dispatched to registered mobile for Registration No: ${identifier}`,
        );
        setStep(2);
      } else {
        alert("Student Login Successful!");
        navigate("/map");
      }
    } else {
      alert(`${selectedRole} Login Successful!`);
      if (selectedRole === "Driver") {
        navigate("/driver");
      } else {
        navigate("/map");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300">
      {/* Navigation Header */}
      <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 dark:bg-indigo-500 text-white p-2 rounded-xl font-bold tracking-wider text-sm shadow-md shadow-indigo-500/20">
            BTS
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
            TransitFlow
          </span>
        </div>

        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex gap-6 items-center">
            <Link
              to="/"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Home
            </Link>
            <Link
              to="/driver"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Driver Portal
            </Link>
            <Link
              to="/map"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              Live Tracking
            </Link>
          </nav>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition shadow-inner cursor-pointer"
            aria-label="Toggle Theme"
          >
            {darkMode ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-grow max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Promotional Content */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <span>🚀 Next-Gen Fleet Management</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            Real-Time Bus Tracking & Campus Transit System
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Empower your institution with a unified ecosystem. Monitor live
            fleet locations, streamline driver attendance logs, handle
            complaints instantly, and give students exact boarding schedules.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition">
              <div className="text-indigo-600 dark:text-indigo-400 font-bold text-xl mb-1">
                ⚡ Live
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Instant GPS telemetry streams over WebSocket grids.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition">
              <div className="text-violet-600 dark:text-violet-400 font-bold text-xl mb-1">
                🛡️ Secure
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Role-tailored dashboards with multi-tier validation.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold text-xl mb-1">
                📍 Accurate
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                OpenStreetMap canvas integration with zero licensing fees.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Sleek Form Lander Component */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition">
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Portal Sign In
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select your role to access your personalized workspace.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => {
                  setSelectedRole(e.target.value);
                  setStep(1);
                }}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                <option value="Student">Student</option>
                <option value="Driver">Driver</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {selectedRole === "Student" ? (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 21BCSE101"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>

                {step === 2 && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Enter SMS OTP
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Email or Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={`Enter ${selectedRole.toLowerCase()} id`}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/35 transition duration-200 cursor-pointer"
            >
              {selectedRole === "Student" && step === 1
                ? "Send OTP"
                : "Sign In to Dashboard"}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400 font-medium transition">
        TransitFlow Bus Tracking System &bull; All Rights Reserved
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/driver"
          element={
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 transition-colors">
              <nav className="mb-6 bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl flex gap-6 max-w-7xl mx-auto items-center">
                <Link
                  to="/"
                  className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  ← Back to Landing
                </Link>
                <Link
                  to="/driver"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Driver Portal
                </Link>
                <Link
                  to="/map"
                  className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600"
                >
                  Live Map
                </Link>
              </nav>
              <div className="max-w-7xl mx-auto">
                <DriverDashboard />
              </div>
            </div>
          }
        />
        <Route
          path="/map"
          element={
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-6 transition-colors">
              <nav className="mb-6 bg-white dark:bg-slate-900 p-4 shadow-sm border border-slate-200 dark:border-slate-800 rounded-2xl flex gap-6 max-w-7xl mx-auto items-center">
                <Link
                  to="/"
                  className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  ← Back to Landing
                </Link>
                <Link
                  to="/driver"
                  className="text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600"
                >
                  Driver Portal
                </Link>
                <Link
                  to="/map"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Live Map
                </Link>
              </nav>
              <div className="max-w-7xl mx-auto">
                <TrackingMap />
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;