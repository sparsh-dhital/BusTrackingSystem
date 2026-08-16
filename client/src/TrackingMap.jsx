// client/src/TrackingMap.jsx
export default function TrackingMap() {
  return (
    <div className="flex min-h-screen flex-col bg-transit-light transition-colors dark:bg-transit-dark">
      {/* Map Header */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 transition-colors dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Live Tracking
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Campus Route A
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 dark:bg-slate-800">
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-transit-amber"
            aria-hidden="true"
          ></span>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Live
          </span>
        </div>
      </header>

      {/* Map Container Placeholder */}
      <div className="relative flex-1 bg-slate-200 dark:bg-slate-800/50">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
            [ Interactive Map Rendered Here ]
          </p>
        </div>
      </div>
    </div>
  );
}