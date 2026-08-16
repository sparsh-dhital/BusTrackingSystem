// client/src/pages/StudentDashboard.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import LiveMap from "../components/LiveMap";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

// --- FIX: The starting state MUST use the exact N-Block Google Maps coordinates ---
const WAITING_STATE = {
  busNumber: "AP-16-TZ-9921",
  routeName: "Campus To TRR Hostel",
  driverStatus: "idle",
  currentStop: "N-Block (Depot)",
  currentNextStop: "Ready to Depart",
  etaMinutes: 0,
  coordinates: { lat: 16.231982, lng: 80.550191 }, // <--- Snaps the parked bus to the road!
};

export default function StudentDashboard({ onLogout }) {
  const [busData, setBusData] = useState(WAITING_STATE);

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
        <div className="flex flex-col gap-6 lg:col-span-1">
          <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-[#1C1C1E]/70">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#86868B]">
              Assigned Bus
            </h2>
            <p className="text-2xl font-bold mt-2 text-[#1D1D1F] dark:text-[#F5F5F7]">
              {busData.routeName}
            </p>
            <span className="inline-block mt-3 rounded-lg bg-[#FFCC00] px-2.5 py-1 text-xs font-black text-black">
              {busData.busNumber}
            </span>
          </div>

          <div className="rounded-3xl border border-white/80 bg-white/70 p-6 shadow-sm dark:border-white/10 dark:bg-[#1C1C1E]/70">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#86868B] mb-4">
              Live Travel Path
            </h2>
            {busData.driverStatus === "active" ? (
              <div className="relative ml-2 border-l-2 border-dashed border-[#007AFF]/50">
                <div className="mb-6 ml-6 relative">
                  <span className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-[#86868B] ring-4 ring-white dark:ring-[#1C1C1E]"></span>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#86868B]">
                    Departed From
                  </p>
                  <p className="mt-1 text-lg font-semibold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {busData.currentStop}
                  </p>
                </div>

                <div className="ml-6 relative">
                  <span className="absolute -left-[33px] top-1.5 h-4 w-4 rounded-full bg-[#007AFF] ring-4 ring-white shadow-md animate-pulse"></span>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#007AFF]">
                    Arriving At
                  </p>
                  <p className="mt-1 text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {busData.currentNextStop}
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#007AFF]">
                    ETA: {busData.etaMinutes} mins
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#1D1D1F] dark:text-[#F5F5F7]">
                  Bus is currently resting at:{" "}
                  <strong className="text-[#007AFF] dark:text-[#0A84FF]">
                    {busData.currentStop}
                  </strong>
                </p>
                <p className="text-xs text-[#86868B] dark:text-[#98989D]">
                  Waiting for the driver to start the route.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <LiveMap
            height="h-full min-h-[400px] lg:min-h-[500px]"
            routeName={busData.routeName}
            busData={busData}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}