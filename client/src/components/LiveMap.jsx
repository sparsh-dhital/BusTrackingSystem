// client/src/components/LiveMap.jsx
export default function LiveMap({
  height = "h-[500px]",
  routeName = "Campus Route A",
}) {
  return (
    <div
      className={`relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${height}`}
    >
      {/* Map Header (Adapted from your TrackingMap.jsx) */}
      <header className="flex items-center justify-between border-b border-black/5 bg-white/40 px-6 py-4 backdrop-blur-md transition-colors dark:border-white/5 dark:bg-black/20">
        <div>
          <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Live Tracking
          </h2>
          <p className="text-sm font-medium text-[#86868B] dark:text-[#98989D]">
            {routeName}
          </p>
        </div>

        {/* Pulsing Live Indicator */}
        <div className="flex items-center gap-2 rounded-full bg-black/5 px-4 py-1.5 transition-colors dark:bg-white/10">
          <span
            className="h-2 w-2 animate-pulse rounded-full bg-[#FFCC00]"
            aria-hidden="true"
          ></span>
          <span className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] dark:text-[#F5F5F7]">
            Live
          </span>
        </div>
      </header>

      {/* Map Container Placeholder */}
      <div className="relative flex flex-1 items-center justify-center bg-black/5 transition-colors dark:bg-white/5">
        <div className="flex flex-col items-center gap-3 text-center">
          <svg
            className="h-12 w-12 text-[#86868B]/50 dark:text-[#98989D]/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
          <p className="text-lg font-medium text-[#86868B] dark:text-[#98989D]">
            [ Interactive Map Rendered Here ]
          </p>
        </div>
      </div>
    </div>
  );
}