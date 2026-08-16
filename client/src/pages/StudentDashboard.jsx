// client/src/pages/StudentDashboard.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import LiveMap from "../components/LiveMap";
import { io } from "socket.io-client";

// Connect to our Node.js backend to listen for updates
const socket = io("http://localhost:5000");

// The default screen before the driver turns on their app
const WAITING_STATE = {
  busNumber: "Waiting for signal...",
  routeName: "No Route Active",
  driverStatus: "idle",
  direction: "forward",
  lastStop: "--",
  currentNextStop: "--",
  etaMinutes: 0,
};

export default function StudentDashboard({ onLogout }) {
  const [busData, setBusData] = useState(WAITING_STATE);

  // --- THE RECEIVER ---
  useEffect(() => {
    socket.on("bus_location_update", (liveUpdate) => {
      setBusData(liveUpdate);
    });

    return () => {
      socket.off("bus_location_update");
    };
  }, []);

  return (
    <DashboardLayout
      title="Student Transit"
      userRole="student"
      onLogout={onLogout}
    >
      <header className="mb-8">
        <p className="text-lg font-medium text-[#86868B] dark:text-[#98989D]">
          Track your campus bus in real-time.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* --- LEFT COLUMN: LIVE INFO CARDS --- */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Active Route Card */}
          <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
                Assigned Bus
              </h2>
              {busData.driverStatus === "active" ? (
                <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2 py-1 text-xs font-bold text-green-600 dark:text-green-400">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  LIVE GPS
                </span>
              ) : busData.driverStatus === "layover" ? (
                <span className="flex items-center gap-1.5 rounded-full bg-[#FF9500]/10 px-2 py-1 text-xs font-bold text-[#FF9500]">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF9500] opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF9500]"></span>
                  </span>
                  RESTING
                </span>
              ) : (
                <span className="rounded-full bg-black/5 px-2 py-1 text-xs font-bold text-[#86868B] dark:bg-white/10 dark:text-[#98989D]">
                  OFFLINE
                </span>
              )}
            </div>

            <p className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
              {busData.routeName}
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-black tracking-wider shadow-sm transition-colors ${busData.driverStatus === "idle" ? "bg-black/10 text-[#86868B] dark:bg-white/10 dark:text-[#98989D]" : "bg-[#FFCC00] text-black"}`}
              >
                <svg
                  className="h-4 w-4 opacity-70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                {busData.busNumber}
              </span>
              <p className="text-sm font-medium text-[#86868B] dark:text-[#98989D]">
                {busData.driverStatus === "active"
                  ? `Heading ${busData.direction === "forward" ? "Forward" : "Back"}`
                  : "Waiting..."}
              </p>
            </div>
          </div>

          {/* --- NEW: DYNAMIC TRAVEL PATH CARD --- */}
          <div
            className={`rounded-3xl border border-white/80 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${
              busData.driverStatus === "active"
                ? "bg-white/70 dark:bg-[#1C1C1E]/70"
                : "bg-black/5 dark:bg-white/5 opacity-70"
            }`}
          >
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
              Live Travel Path
            </h2>

            {busData.driverStatus === "active" ? (
              <div className="animate-in fade-in duration-300">
                {/* Visual Timeline Path */}
                <div className="relative ml-2 border-l-2 border-dashed border-[#007AFF]/50 dark:border-[#0A84FF]/50">
                  {/* Where the bus just left */}
                  <div className="mb-6 ml-6 relative">
                    <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[#86868B] ring-4 ring-white dark:ring-[#1C1C1E]"></span>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
                      Departed From
                    </p>
                    <p className="mt-1 text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      {busData.lastStop}
                    </p>
                  </div>

                  {/* Where it is going right now */}
                  <div className="ml-6 relative">
                    <span className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full bg-[#007AFF] ring-4 ring-white dark:bg-[#0A84FF] dark:ring-[#1C1C1E] shadow-[0_0_12px_rgba(0,122,255,0.6)] animate-pulse"></span>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#007AFF] dark:text-[#0A84FF]">
                      Arriving At
                    </p>
                    <p className="mt-1 text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      {busData.currentNextStop}
                    </p>

                    {/* Live Ticking Countdown */}
                    <div className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#007AFF]/10 px-3 py-1.5 dark:bg-[#0A84FF]/10">
                      <svg
                        className="h-4 w-4 text-[#007AFF] dark:text-[#0A84FF] animate-spin-slow"
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
                      <p className="text-sm font-bold text-[#007AFF] dark:text-[#0A84FF]">
                        ETA: {busData.etaMinutes} min
                        {busData.etaMinutes !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : busData.driverStatus === "layover" ? (
              <div className="py-2 animate-in fade-in duration-300">
                <p className="text-2xl font-bold text-[#FF9500] dark:text-[#FF9F0A]">
                  Bus is Resting
                </p>
                <p className="mt-2 text-sm font-medium text-[#86868B] dark:text-[#98989D]">
                  Waiting at{" "}
                  <strong className="text-[#1D1D1F] dark:text-white">
                    {busData.currentNextStop}
                  </strong>{" "}
                  before heading back to campus.
                </p>
              </div>
            ) : (
              <div className="py-2 animate-in fade-in duration-300">
                <p className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                  No Active Trips
                </p>
                <p className="mt-2 text-sm font-medium text-[#86868B] dark:text-[#98989D]">
                  The driver has not started the engine yet.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: THE REUSABLE LIVE MAP --- */}
        <div className="lg:col-span-2">
          {/* We reuse the LiveMap component we built earlier! */}
          <LiveMap
            height="h-full min-h-[400px] lg:min-h-[500px]"
            routeName={busData.routeName}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}