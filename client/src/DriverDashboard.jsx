import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function DriverDashboard() {
  const [tracking, setTracking] = useState(false);
  const routeId = "route_123";

  useEffect(() => {
    let watchId;

    if (tracking) {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const data = {
              routeId: routeId,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            socket.emit("driver_location_update", data);
          },
          (error) => console.log(error),
          { enableHighAccuracy: true, maximumAge: 0 },
        );
      }
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [tracking]);

  const markAttendance = () => {
    console.log("Attendance recorded successfully");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Driver Portal</h1>
      <div className="bg-white p-4 shadow rounded">
        <p>Assigned Route: {routeId}</p>
        <button
          className="bg-blue-600 text-white p-2 rounded mt-4 mr-4"
          onClick={() => setTracking(!tracking)}
        >
          {tracking ? "Stop Location Broadcast" : "Start Trip Broadcast"}
        </button>
        <button
          className="bg-green-600 text-white p-2 rounded mt-4"
          onClick={markAttendance}
        >
          Mark Daily Attendance
        </button>
      </div>
    </div>
  );
}