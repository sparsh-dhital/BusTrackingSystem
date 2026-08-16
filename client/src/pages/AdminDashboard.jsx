// client/src/AdminDashboard.jsx
import DashboardLayout from "../components/DashboardLayout";

export default function AdminDashboard({ onLogout }) {
  return (
    <DashboardLayout
      title="System Overview"
      userRole="admin"
      onLogout={onLogout}
    >
      <div className="grid gap-6 md:grid-cols-3">
        {/* Stat Cards */}
        {[
          { label: "Active Buses", value: "12" },
          { label: "Total Students", value: "4,209" },
          { label: "System Status", value: "Optimal", color: "text-[#34C759]" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          >
            <p className="text-sm font-medium text-[#86868B] dark:text-[#98989D] uppercase tracking-wider">
              {stat.label}
            </p>
            <p
              className={`mt-2 text-4xl font-black ${stat.color || "text-[#1D1D1F] dark:text-[#F5F5F7]"}`}
            >
              {stat.value}
            </p>
          </div>
        ))}

        {/* Large Data Table Placeholder */}
        <div className="md:col-span-3 h-96 rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Live Fleet Metrics
          </h2>
          <div className="flex h-full w-full items-center justify-center rounded-2xl bg-black/5 dark:bg-black/40">
            <p className="text-[#86868B] dark:text-[#98989D]">
              Data grid rendering...
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}