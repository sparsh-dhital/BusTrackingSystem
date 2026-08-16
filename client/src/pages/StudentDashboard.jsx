// client/src/pages/StudentDashboard.jsx
import DashboardLayout from "../components/DashboardLayout";
import LiveMap from "../components/LiveMap";

export default function StudentDashboard({ onLogout }) {
  return (
    <DashboardLayout
      title="Student Portal"
      userRole="student"
      onLogout={onLogout}
    >
      <header className="mb-8">
        <p className="text-lg font-medium text-[#86868B] dark:text-[#98989D]">
          Track your campus transit in real-time.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Info Cards */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Active Route Card */}
          <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
              Subscribed Route
            </h2>
            <p className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              Route 4 - Guntur City
            </p>
            <p className="mt-1 text-sm font-medium text-[#86868B] dark:text-[#98989D]">
              Vehicle: AP-16-TZ-9921
            </p>
          </div>

          {/* ETA Card */}
          <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
              Estimated Arrival
            </h2>
            <p className="text-4xl font-black text-[#007AFF] dark:text-[#0A84FF]">
              12 <span className="text-xl font-semibold">mins</span>
            </p>
            <p className="mt-2 text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
              Next Stop: Main Gate
            </p>
          </div>
        </div>

        {/* Right Column: The Reusable Live Map */}
        <div className="lg:col-span-2">
          <LiveMap height="h-full min-h-[400px]" role="student" />
        </div>
      </div>
    </DashboardLayout>
  );
}