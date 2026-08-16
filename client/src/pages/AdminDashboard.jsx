// client/src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function AdminDashboard({ onLogout }) {
  const [fleet, setFleet] = useState([]); // Initialized as empty; populated via database fetch
  const [selectedBus, setSelectedBus] = useState(null); // Track which bus was clicked for details

  // --- FETCH INITIAL FLEET DATA FROM DATABASE API ---
  useEffect(() => {
    fetch("http://localhost:5000/api/fleet")
      .then((res) => res.json())
      .then((data) => setFleet(data))
      .catch((err) => console.error("Failed to fetch fleet data:", err));
  }, []);

  // --- THE RECEIVER ---
  useEffect(() => {
    socket.on("bus_location_update", (liveUpdate) => {
      setFleet((prevFleet) =>
        prevFleet.map((bus) => {
          if (bus.busNumber === liveUpdate.busNumber) {
            const updatedBus = { ...bus, ...liveUpdate };
            // If this bus is currently open in the detail view, update it live too!
            if (selectedBus && selectedBus.busNumber === liveUpdate.busNumber) {
              setSelectedBus(updatedBus);
            }
            return updatedBus;
          }
          return bus;
        }),
      );
    });

    return () => {
      socket.off("bus_location_update");
    };
  }, [selectedBus]);

  const activeCount = fleet.filter((b) => b.driverStatus === "active").length;
  const restingCount = fleet.filter((b) => b.driverStatus === "layover").length;
  const idleCount = fleet.filter(
    (b) => b.driverStatus === "idle" || b.driverStatus === "finished",
  ).length;

  return (
    <DashboardLayout title="Admin Command" userRole="admin" onLogout={onLogout}>
      <header className="mb-8">
        <p className="text-lg font-medium text-[#86868B] dark:text-[#98989D]">
          Real-time fleet monitoring and driver management.
        </p>
      </header>

      {/* --- CONDITIONAL VIEW: IF A BUS IS SELECTED, SHOW DETAIL PAGE --- */}
      {selectedBus ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Back Button */}
          <button
            onClick={() => setSelectedBus(null)}
            className="flex items-center gap-2 rounded-xl bg-black/5 px-4 py-2 text-sm font-semibold text-[#1D1D1F] transition-all hover:bg-black/10 dark:bg-white/10 dark:text-[#F5F5F7] dark:hover:bg-white/20"
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
            Back to Fleet Overview
          </button>

          {/* Bus Detail Card */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Vehicle & Route Summary */}
            <div className="rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#1C1C1E]/70">
              <div className="flex items-center justify-between mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFCC00] px-3 py-1.5 text-sm font-black text-black shadow-sm">
                  {selectedBus.busNumber}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    selectedBus.driverStatus === "active"
                      ? "bg-green-500/10 text-green-600 dark:text-green-400"
                      : selectedBus.driverStatus === "layover"
                        ? "bg-[#FF9500]/10 text-[#FF9500]"
                        : "bg-black/5 text-[#86868B] dark:bg-white/10"
                  }`}
                >
                  {selectedBus.driverStatus === "active"
                    ? "Active on Route"
                    : selectedBus.driverStatus === "layover"
                      ? "Resting at Stop"
                      : "Offline / Idle"}
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7] mb-2">
                {selectedBus.routeName}
              </h2>
              <p className="text-sm font-medium text-[#86868B] dark:text-[#98989D] mb-6">
                Journey:{" "}
                <strong className="text-[#1D1D1F] dark:text-white">
                  {selectedBus.fromLocation}
                </strong>{" "}
                →{" "}
                <strong className="text-[#1D1D1F] dark:text-white">
                  {selectedBus.toLocation}
                </strong>
              </p>

              <div className="grid grid-cols-2 gap-4 rounded-2xl bg-black/5 p-4 dark:bg-white/5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
                    Current Location
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#007AFF] dark:text-[#0A84FF]">
                    {selectedBus.currentStop || "Not Departed"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B]">
                    Next Destination
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {selectedBus.currentNextStop !== "--"
                      ? selectedBus.currentNextStop
                      : "--"}
                  </p>
                </div>
              </div>
            </div>

            {/* Operator / Driver Profile Card */}
            <div className="rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#1C1C1E]/70 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D] mb-6">
                  Assigned Operator
                </h3>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#007AFF]/10 text-[#007AFF] dark:bg-[#0A84FF]/20 dark:text-[#0A84FF] text-2xl font-bold">
                    {selectedBus.driverName?.charAt(0) || "D"}
                  </div>
                  <div>
                    <h4 className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                      {selectedBus.driverName}
                    </h4>
                    <p className="text-sm font-mono font-medium text-[#86868B] dark:text-[#98989D]">
                      ID: {selectedBus.driverId}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-black/5 bg-white/40 p-4 dark:border-white/5 dark:bg-black/20">
                <p className="text-xs font-medium text-[#86868B] dark:text-[#98989D] text-center">
                  Driver status is synced securely in real time via WebSocket
                  connection.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* --- MAIN FLEET OVERVIEW VIEW --- */
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* STAT CARDS */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#1C1C1E]/70">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#86868B]">
                Active on Route
              </p>
              <p className="mt-2 text-4xl font-black text-[#34C759]">
                {activeCount}
              </p>
            </div>
            <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#1C1C1E]/70">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#86868B]">
                Resting / Layover
              </p>
              <p className="mt-2 text-4xl font-black text-[#FF9500]">
                {restingCount}
              </p>
            </div>
            <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#1C1C1E]/70">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#86868B]">
                Idle / Offline
              </p>
              <p className="mt-2 text-4xl font-black text-[#86868B]">
                {idleCount}
              </p>
            </div>
          </div>

          {/* LIVE FLEET TABLE */}
          <div className="rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl dark:border-white/10 dark:bg-[#1C1C1E]/70">
            <h2 className="text-2xl font-semibold tracking-tight mb-2">
              Live Fleet Overview
            </h2>
            <p className="text-sm text-[#86868B] dark:text-[#98989D] mb-6">
              Click on any bus row to inspect telemetry and driver credentials.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-black/5 dark:border-white/10 text-xs font-semibold uppercase tracking-wider text-[#86868B]">
                    <th className="pb-4 px-4">Bus Number</th>
                    <th className="pb-4 px-4">Route</th>
                    <th className="pb-4 px-4">From → To</th>
                    <th className="pb-4 px-4">Status</th>
                    <th className="pb-4 px-4">Currently At</th>
                    <th className="pb-4 px-4">Next Stop</th>
                    <th className="pb-4 px-4">ETA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm">
                  {fleet.map((bus) => (
                    <tr
                      key={bus.busNumber}
                      onClick={() => setSelectedBus(bus)}
                      className="group cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-4 font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FFCC00] px-2.5 py-1 text-xs font-black text-black shadow-sm">
                          {bus.busNumber}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                        {bus.routeName}
                      </td>
                      <td className="py-4 px-4 text-xs font-medium text-[#86868B] dark:text-[#98989D]">
                        {bus.fromLocation} →{" "}
                        <strong className="text-[#1D1D1F] dark:text-white">
                          {bus.toLocation}
                        </strong>
                      </td>
                      <td className="py-4 px-4">
                        {bus.driverStatus === "active" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-600 dark:text-green-400">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                            </span>
                            Active
                          </span>
                        ) : bus.driverStatus === "layover" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF9500]/10 px-3 py-1 text-xs font-bold text-[#FF9500]">
                            Resting
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-xs font-bold text-[#86868B] dark:bg-white/10 dark:text-[#98989D]">
                            Offline
                          </span>
                        )}
                      </td>
                      {/* --- NOW SHOWING CURRENT STOP --- */}
                      <td className="py-4 px-4 font-bold text-[#007AFF] dark:text-[#0A84FF]">
                        {bus.currentStop || "Depot"}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                        {bus.currentNextStop || "--"}
                      </td>
                      <td className="py-4 px-4 font-bold text-[#007AFF] dark:text-[#0A84FF]">
                        {bus.driverStatus === "active"
                          ? `${bus.etaMinutes} mins`
                          : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}