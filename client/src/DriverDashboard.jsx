// client/src/DriverDashboard.jsx
export default function DriverDashboard() {
  return (
    <div className="min-h-screen bg-transit-light p-6 transition-colors dark:bg-transit-dark lg:p-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Driver Portal
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Manage your active route and vehicle status.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Status Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Current Status
          </h2>
          <div className="flex items-center gap-3">
            <span
              className="flex h-3 w-3 rounded-full bg-green-500"
              aria-hidden="true"
            ></span>
            <span className="text-xl font-bold text-slate-900 dark:text-white">
              On Route
            </span>
          </div>
        </div>

        {/* Next Stop Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Next Stop
          </h2>
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            Engineering Block B
          </p>
          <p className="mt-1 text-sm font-medium text-transit-blue">
            Arriving in 4 mins
          </p>
        </div>
      </div>
    </div>
  );
}