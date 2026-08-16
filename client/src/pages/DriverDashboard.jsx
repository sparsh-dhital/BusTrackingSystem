// client/src/pages/DriverDashboard.jsx
import DashboardLayout from "../components/DashboardLayout";

export default function DriverDashboard({ onLogout }) {
  return (
    <DashboardLayout
      title="Driver Portal"
      userRole="driver"
      onLogout={onLogout}
    >
      {/* Sub-header text (The main title is already handled by DashboardLayout) */}
      <header className="mb-8">
        <p className="text-lg font-medium text-[#86868B] dark:text-[#98989D]">
          Manage your active route and vehicle status.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Status Card - Frosted Glass */}
        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
            Current Status
          </h2>
          <div className="flex items-center gap-3">
            {/* Added a pulsing animation to the green dot for a "live" feel */}
            <span className="relative flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34C759] opacity-75"></span>
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#34C759]"></span>
            </span>
            <span className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              On Route
            </span>
          </div>
        </div>

        {/* Next Stop Card - Frosted Glass */}
        <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
            Next Stop
          </h2>
          <p className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Engineering Block B
          </p>
          {/* Enhanced the timing text into a styled badge */}
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#007AFF]/10 px-3 py-1 text-sm font-semibold text-[#007AFF] dark:bg-[#0A84FF]/20 dark:text-[#0A84FF]">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Arriving in 4 mins
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}