// client/src/components/LiveMap.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fallback just in case the routing API is blocked
const FALLBACK_COORDS = [
  [16.231982, 80.550191], // N-Block
  [16.233471, 80.547463], // Main Gate
  [16.23349, 80.539118], // KM Hostel
  [16.228094, 80.518118], // Bezawada Hostel
  [16.228231, 80.5123], // TRR Hostel
];

function MapRecenter({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView([coords.lat, coords.lng], 16, { animate: true });
    }
  }, [coords, map]);
  return null;
}

function MapResizeHandler({ isFullscreen }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [isFullscreen, map]);
  return null;
}

export default function LiveMap({
  height = "h-[500px]",
  routeName = "Campus Route A",
  busData,
}) {
  const defaultCoords = { lat: 16.231982, lng: 80.550191 };
  const currentCoords = busData?.coordinates || defaultCoords;
  const busNumber = busData?.busNumber || "AP-16-TZ-9921";

  const [isDark, setIsDark] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [routePath, setRoutePath] = useState(FALLBACK_COORDS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // --- API LOGIC WITH GAP FIX ---
  useEffect(() => {
    const fetchRoadPath = async () => {
      try {
        const coordsString =
          "80.550191,16.231982;80.547463,16.233471;80.539118,16.23349;80.518118,16.228094;80.5123,16.228231";
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordsString}?geometries=geojson&overview=full`,
        );
        const data = await res.json();

        if (data.routes && data.routes[0]) {
          const snappedLatLngs = data.routes[0].geometry.coordinates.map(
            (c) => [c[1], c[0]],
          );

          // FIX: Prepend and append the exact marker coordinates to the API path
          // This forces the blue line to connect directly to the starting/ending markers!
          const precisePath = [
            [16.231982, 80.550191], // Force connect to N-Block marker
            ...snappedLatLngs,
            [16.228231, 80.5123], // Force connect to TRR Hostel marker
          ];

          setRoutePath(precisePath);
        }
      } catch (error) {
        console.error("Failed to fetch road path", error);
      }
    };
    fetchRoadPath();
  }, []);

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const tileUrl = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  const professionalBusIcon = L.divIcon({
    className: "custom-bus-marker",
    html: `
      <div style="background: ${isDark ? "#2C2C2E" : "#1D1D1F"}; color: #FFFFFF; padding: 5px 12px 5px 6px; border-radius: 24px; display: inline-flex; align-items: center; gap: 7px; box-shadow: 0 10px 25px rgba(0,0,0,0.45); border: 2px solid rgba(255,255,255,0.3); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; white-space: nowrap;">
        <span style="display: flex; align-items: center; justify-content: center; background: #007AFF; color: white; width: 24px; height: 24px; border-radius: 50%; box-shadow: 0 2px 8px rgba(0,122,255,0.5);">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-14-8h14m-14 4h14M6 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2M5 18h2m10 0h2"/>
          </svg>
        </span>
        <span style="letter-spacing: -0.01em;">${busNumber}</span>
      </div>
    `,
    iconSize: [140, 38],
    iconAnchor: [70, 19],
    popupAnchor: [0, -20],
  });

  const mapContent = (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-[999999] flex flex-col bg-[#F2F2F7] dark:bg-[#000000]"
          : `${height} relative flex w-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-3xl transition-all duration-500 dark:border-white/10 dark:bg-[#1C1C1E]/70 dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]`
      }
    >
      <style>{`
        .leaflet-marker-icon { transition: transform 1s cubic-bezier(0.25, 1, 0.5, 1) !important; }
        .leaflet-popup-content-wrapper, .leaflet-popup-tip { background-color: ${isDark ? "#2C2C2E" : "#FFFFFF"} !important; color: ${isDark ? "#F5F5F7" : "#1D1D1F"} !important; box-shadow: 0 10px 25px rgba(0,0,0,${isDark ? "0.6" : "0.15"}) !important; border: 1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.05)"} !important; border-radius: 16px !important; }
        .leaflet-popup-content { color: ${isDark ? "#F5F5F7" : "#1D1D1F"} !important; margin: 14px 18px !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important; }
        .leaflet-container a.leaflet-popup-close-button { color: ${isDark ? "#E5E5EA" : "#86868B"} !important; }
      `}</style>

      <header className="flex-shrink-0 relative z-[1000] flex items-center justify-between border-b border-black/5 bg-white px-6 py-4 shadow-sm dark:border-white/5 dark:bg-[#1C1C1E]">
        <div>
          <h2 className="text-lg font-bold text-[#1D1D1F] dark:text-[#F5F5F7]">
            Live Tracking
          </h2>
          <p className="text-sm font-medium text-[#86868B] dark:text-[#98989D]">
            {routeName}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-black/5 px-4 py-1.5 dark:bg-white/10">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#34C759]"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1D1D1F] dark:text-[#F5F5F7]">
              {busData?.driverStatus === "active" ? "Live" : "Idle / Parked"}
            </span>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
              isFullscreen
                ? "bg-[#FF3B30] text-white hover:bg-[#D70015] shadow-md"
                : "bg-black/5 text-[#1D1D1F] hover:bg-black/10 dark:bg-white/10 dark:text-[#F5F5F7] dark:hover:bg-white/20"
            }`}
          >
            {isFullscreen ? (
              <>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="hidden sm:inline">Exit Fullscreen</span>
              </>
            ) : (
              <>
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                  />
                </svg>
                <span className="hidden sm:inline">Fullscreen</span>
              </>
            )}
          </button>
        </div>
      </header>

      <div className="relative flex-1 bg-black/5 dark:bg-white/5 w-full h-full">
        <MapContainer
          center={[currentCoords.lat, currentCoords.lng]}
          zoom={16}
          scrollWheelZoom={true}
          className="absolute inset-0 h-full w-full z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url={tileUrl}
          />

          <Polyline
            positions={routePath}
            pathOptions={{
              color: isDark ? "#0A84FF" : "#007AFF",
              weight: 5,
              opacity: 0.85,
            }}
          />

          <MapRecenter coords={currentCoords} />
          <MapResizeHandler isFullscreen={isFullscreen} />

          <Marker
            position={[currentCoords.lat, currentCoords.lng]}
            icon={professionalBusIcon}
          >
            <Popup>
              <div className="space-y-1">
                <p
                  style={{ color: isDark ? "#F5F5F7" : "#1D1D1F" }}
                  className="font-bold text-sm"
                >
                  Bus: {busNumber}
                </p>
                <p
                  style={{ color: isDark ? "#E5E5EA" : "#68686C" }}
                  className="text-xs font-medium"
                >
                  Status:{" "}
                  {busData?.driverStatus === "active" ? "On Route" : "Resting"}
                </p>
                <p
                  style={{ color: isDark ? "#0A84FF" : "#007AFF" }}
                  className="text-xs font-bold"
                >
                  Location: {busData?.currentStop || "N-Block (Depot)"}
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );

  if (isFullscreen && mounted) {
    return createPortal(mapContent, document.body);
  }

  return mapContent;
}