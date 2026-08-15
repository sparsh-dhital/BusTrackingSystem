import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { io } from "socket.io-client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

const socket = io("http://localhost:5000");

export default function TrackingMap() {
  const [busPosition, setBusPosition] = useState([16.2736, 80.5367]);
  const routeId = "route_123";

  useEffect(() => {
    socket.emit("join_route", { routeId });

    socket.on("bus_location_broadcast", (data) => {
      setBusPosition([data.latitude, data.longitude]);
    });

    return () => {
      socket.off("bus_location_broadcast");
    };
  }, []);

  return (
    <div style={{ height: "500px", width: "100%", marginTop: "20px" }}>
      <MapContainer
        center={busPosition}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={busPosition}>
          <Popup>Live Bus Location</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}