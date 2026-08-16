// client/src/pages/DriverDashboard.jsx
import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { io } from "socket.io-client";

// Connect to our Node.js backend
const socket = io("http://localhost:5000");

const ASSIGNED_SHIFT = {
  driverId: "DRV001",
  busNumber: "AP-16-TZ-9921",
  routeName: "Campus To TRR Hostel",
  stops: ["N-Block", "Main Gate", "KM Hostel", "Bezawada Hostel", "TRR Hostel"],
};

export default function DriverDashboard({ onLogout }) {
  const [tripState, setTripState] = useState("idle");
  const [isReturnTrip, setIsReturnTrip] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const displayStops = isReturnTrip
    ? [...ASSIGNED_SHIFT.stops].reverse()
    : ASSIGNED_SHIFT.stops;

  // --- UPDATED BROADCASTER ---
  useEffect(() => {
    const simulatedEta = Math.max(1, 4 - Math.floor(elapsedSeconds / 60));

    // UPDATED: If we are at the very first stop of the day, say "Campus Depot".
    // Otherwise, say whatever the last stop was!
    const previousStop =
      currentStopIndex > 0
        ? displayStops[currentStopIndex - 1]
        : "Campus Depot";

    const liveUpdate = {
      busNumber: ASSIGNED_SHIFT.busNumber,
      routeName: ASSIGNED_SHIFT.routeName,
      driverStatus: tripState,
      direction: isReturnTrip ? "back" : "forward",
      lastStop: previousStop,
      currentNextStop: displayStops[currentStopIndex] || "--",
      etaMinutes: tripState === "active" ? simulatedEta : 0,
    };

    socket.emit("driver_update", liveUpdate);
  }, [tripState, isReturnTrip, currentStopIndex, displayStops, elapsedSeconds]);

  useEffect(() => {
    let timer;
    if (tripState === "active") {
      timer = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [tripState]);

  const formatTime = (totalSeconds) => {
    const m = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStartTrip = () => {
    setTripState("active");
    setIsReturnTrip(false);
    setCurrentStopIndex(0);
    setElapsedSeconds(0);
  };

  const handleNextStop = () => {
    if (currentStopIndex < displayStops.length - 1) {
      setCurrentStopIndex((prev) => prev + 1);
      setElapsedSeconds(0);
    } else {
      if (!isReturnTrip) {
        setTripState("layover");
      } else {
        setTripState("finished");
      }
    }
  };

  const handleStartReturnTrip = () => {
    setTripState("active");
    setIsReturnTrip(true);
    // FIX: Set index to 1! Since we are already at the layover stop, we are driving to stop #1.
    setCurrentStopIndex(1);
    setElapsedSeconds(0);
  };

  const handleEndShiftEarly = () => {
    setTripState("finished");
  };

  return (
    <DashboardLayout title="Driver Panel" userRole="driver" onLogout={onLogout}>
      <header className="mb-8">
        <p className="text-lg font-medium text-[#86868B] dark:text-[#98989D]">
          View your route and track your driving time.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* --- 1. STATUS CARD --- */}
        <div className="flex flex-col rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
            Current Status
          </h2>
          <div className="flex items-center gap-3 mb-6">
            {tripState === "active" ? (
              <span className="relative flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#34C759] opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#34C759]"></span>
              </span>
            ) : tripState === "layover" ? (
              <span className="relative flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF9500] opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-[#FF9500]"></span>
              </span>
            ) : tripState === "finished" ? (
              <span className="h-3.5 w-3.5 rounded-full bg-[#007AFF] dark:bg-[#0A84FF]"></span>
            ) : (
              <span className="h-3.5 w-3.5 rounded-full bg-[#86868B]"></span>
            )}

            <span className="text-xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7] capitalize">
              {tripState === "active"
                ? `Driving (${isReturnTrip ? "Back" : "Forward"})`
                : tripState === "layover"
                  ? "Resting at Last Stop"
                  : tripState === "idle"
                    ? "Ready to Start"
                    : "Finished for Today"}
            </span>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-4 rounded-2xl bg-black/5 p-4 dark:bg-white/5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
                Leg Time
              </p>
              <p
                className={`mt-1 text-lg font-bold tabular-nums ${tripState === "active" ? "text-[#007AFF] dark:text-[#0A84FF]" : "text-[#1D1D1F] dark:text-[#F5F5F7]"}`}
              >
                {formatTime(elapsedSeconds)}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
                Stops Passed
              </p>
              <p className="mt-1 text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                {tripState === "idle"
                  ? "0"
                  : currentStopIndex +
                    (tripState === "finished" || tripState === "layover"
                      ? 1
                      : 0)}{" "}
                / {displayStops.length}
              </p>
            </div>
          </div>
        </div>

        {/* --- 2. BUS INFO AND NEXT STOP CARD --- */}
        <div
          className={`relative flex flex-col overflow-hidden rounded-3xl border shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-700 ${
            tripState === "idle"
              ? "border-transparent bg-gradient-to-br from-[#007AFF] via-[#0051BA] to-[#5E5CE6] dark:shadow-[0_8px_32px_rgba(0,122,255,0.3)]"
              : "border-white/80 bg-white/70 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
          }`}
        >
          {tripState === "idle" ? (
            <div className="relative z-10 flex h-full flex-col p-6 animate-in fade-in duration-500">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/80">
                Your Bus & Route
              </h2>
              <div className="flex flex-1 flex-col justify-center gap-6">
                <div>
                  <p className="mb-2 text-sm font-medium text-white/80">
                    Bus Number
                  </p>
                  <div className="inline-block rounded-lg bg-[#FFCC00] px-4 py-2 shadow-lg ring-2 ring-white/20">
                    <p className="text-2xl font-black tracking-widest text-black">
                      {ASSIGNED_SHIFT.busNumber}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="mb-1 text-sm font-medium text-white/80">
                    Route Name
                  </p>
                  <p className="text-2xl font-bold leading-tight text-white drop-shadow-md">
                    {ASSIGNED_SHIFT.routeName}
                  </p>
                </div>
              </div>
              <div className="pointer-events-none absolute -bottom-6 -right-6 opacity-10">
                <svg
                  className="h-48 w-48 text-white"
                  fill="currentColor"
                  viewBox="0 0 64 32"
                >
                  <path d="M4 8C4 5.79086 5.79086 4 8 4H52C56.4183 4 60 7.58172 60 12V24C60 25.1046 59.1046 26 58 26H6C4.89543 26 4 25.1046 4 24V8Z" />
                </svg>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex h-full flex-col p-6 animate-in fade-in duration-500">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
                  {tripState === "active" ? "Next Stop" : "Status"}
                </h2>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-[#FFCC00] px-2 py-1 text-xs font-bold text-black shadow-sm">
                  {ASSIGNED_SHIFT.busNumber}
                </span>
              </div>

              {tripState === "active" ? (
                <div className="flex h-full flex-col justify-center">
                  <p className="text-3xl font-black tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {displayStops[currentStopIndex]}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-sm font-bold text-[#007AFF] dark:text-[#0A84FF] truncate">
                      {isReturnTrip ? "Driving Back" : ASSIGNED_SHIFT.routeName}
                    </p>
                    {currentStopIndex === displayStops.length - 1 && (
                      <span className="inline-flex w-max items-center gap-1 rounded-md bg-[#FF9500]/10 px-2 py-0.5 text-xs font-semibold text-[#FF9500] dark:bg-[#FF9F0A]/20 dark:text-[#FF9F0A]">
                        {isReturnTrip ? "Final Stop" : "End of Route"}
                      </span>
                    )}
                  </div>
                </div>
              ) : tripState === "layover" ? (
                <div className="flex h-full flex-col justify-center">
                  <p className="text-3xl font-black tracking-tight text-[#1D1D1F] dark:text-[#F5F5F7]">
                    {displayStops[displayStops.length - 1]}
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#FF9500] dark:text-[#FF9F0A]">
                    You have arrived. Ready to drive back?
                  </p>
                </div>
              ) : (
                <div className="flex h-full flex-col justify-center opacity-70">
                  <p className="text-2xl font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
                    Done for the Day
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#86868B] dark:text-[#98989D]">
                    All stops are finished.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* --- 3. DRIVER CONTROLS --- */}
        <div className="flex flex-col rounded-3xl border border-white/80 bg-white/70 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
            Driver Controls
          </h2>
          <div className="flex h-full flex-col justify-center gap-3">
            {tripState === "idle" ? (
              <button
                onClick={handleStartTrip}
                className="w-full flex-1 rounded-2xl bg-[#34C759] py-4 text-lg font-bold text-white shadow-[0_4px_14px_rgba(52,199,89,0.4)] transition-all active:scale-[0.98] hover:bg-[#30b753] hover:shadow-[0_6px_20px_rgba(52,199,89,0.6)]"
              >
                Start Driving
              </button>
            ) : tripState === "layover" ? (
              <>
                <button
                  onClick={handleStartReturnTrip}
                  className="w-full flex-1 rounded-2xl bg-[#FF9500] py-4 text-lg font-bold text-white shadow-[0_4px_14px_rgba(255,149,0,0.4)] transition-all active:scale-[0.98] hover:bg-[#E08300] dark:bg-[#FF9F0A] dark:hover:bg-[#FF9500]"
                >
                  Start Drive Back
                </button>
                <button
                  onClick={handleEndShiftEarly}
                  className="w-full rounded-2xl bg-[#FF3B30]/10 py-3 text-sm font-bold text-[#FF3B30] transition-all active:scale-[0.98] hover:bg-[#FF3B30]/20 dark:bg-[#FF453A]/10 dark:text-[#FF453A] dark:hover:bg-[#FF453A]/20"
                >
                  Stop Early
                </button>
              </>
            ) : tripState === "finished" ? (
              <button
                onClick={() => setTripState("idle")}
                className="w-full flex-1 rounded-2xl bg-[#34C759] py-4 text-lg font-bold text-white shadow-[0_4px_14px_rgba(52,199,89,0.4)] transition-all active:scale-[0.98] hover:bg-[#30b753]"
              >
                Get Next Route
              </button>
            ) : (
              <>
                <button
                  onClick={handleNextStop}
                  className="w-full flex-1 rounded-2xl bg-[#007AFF] py-4 text-lg font-bold text-white shadow-[0_4px_14px_rgba(0,122,255,0.4)] transition-all active:scale-[0.98] hover:bg-[#0071E3] dark:bg-[#0A84FF] dark:hover:bg-[#007AFF] dark:shadow-[0_4px_14px_rgba(10,132,255,0.4)]"
                >
                  Arrived at Stop
                </button>
                <button
                  onClick={handleEndShiftEarly}
                  className="w-full rounded-2xl bg-[#FF3B30]/10 py-3 text-sm font-bold text-[#FF3B30] transition-all active:scale-[0.98] hover:bg-[#FF3B30]/20 dark:bg-[#FF453A]/10 dark:text-[#FF453A] dark:hover:bg-[#FF453A]/20"
                >
                  Stop Early
                </button>
              </>
            )}
          </div>
        </div>

        {/* --- 4. LIST OF STOPS TIMELINE --- */}
        <div className="md:col-span-2 lg:col-span-3 mt-2 rounded-3xl border border-white/80 bg-white/70 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#86868B] dark:text-[#98989D]">
              List of Stops
            </h2>
            {isReturnTrip && (
              <span className="inline-flex items-center gap-1 rounded-md bg-[#007AFF]/10 px-2 py-1 text-xs font-bold uppercase tracking-wider text-[#007AFF] dark:bg-[#0A84FF]/20 dark:text-[#0A84FF]">
                Driving Back
              </span>
            )}
          </div>

          <div className="relative ml-4 border-l-2 border-[#E5E5EA] dark:border-[#38383A]">
            {displayStops.map((stop, index) => {
              const isPast =
                tripState === "finished" ||
                tripState === "layover" ||
                (tripState === "active" && index < currentStopIndex);
              const isCurrent =
                tripState === "active" && index === currentStopIndex;

              return (
                <div
                  key={`${stop}-${index}`}
                  className="mb-8 ml-8 last:mb-0 relative"
                >
                  <span
                    className={`absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-white transition-all duration-300 dark:ring-[#1C1C1E] ${
                      isPast
                        ? "bg-[#34C759]"
                        : isCurrent
                          ? "bg-[#007AFF] dark:bg-[#0A84FF] ring-[6px] shadow-[0_0_12px_rgba(0,122,255,0.6)]"
                          : "bg-[#E5E5EA] dark:bg-[#48484A]"
                    }`}
                  >
                    {isPast && (
                      <svg
                        className="h-3.5 w-3.5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>

                  <div className="flex flex-col justify-center">
                    <h3
                      className={`text-lg font-bold transition-colors duration-300 ${
                        isCurrent
                          ? "text-[#007AFF] dark:text-[#0A84FF]"
                          : isPast
                            ? "text-[#86868B] dark:text-[#98989D]"
                            : "text-[#1D1D1F] dark:text-[#F5F5F7]"
                      }`}
                    >
                      {stop}
                    </h3>

                    {isCurrent && (
                      <p className="mt-1 text-sm font-semibold text-[#86868B] dark:text-[#98989D] animate-pulse">
                        Driving here now...
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}