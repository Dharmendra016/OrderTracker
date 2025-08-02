"use client";
import { MapContainer, TileLayer, Popup, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default icon
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src ?? markerIcon2x,
  iconUrl: markerIcon.src ?? markerIcon,
  shadowUrl: markerShadow.src ?? markerShadow,
});

export default function Map({ routeCoords }: { routeCoords: [number, number][] }) {
  if (!routeCoords || routeCoords.length < 2) return <p>Invalid route coordinates</p>;

  const start = routeCoords[0];
  const end = routeCoords[routeCoords.length - 1];

  return (
    <MapContainer center={start} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Delivery Partner Marker */}
      <Marker position={start}>
        <Popup>Delivery Partner</Popup>
      </Marker>

      {/* Customer/Destination Marker */}
      <Marker position={end}>
        <Popup>Customer Location</Popup>
      </Marker>

      {/* Route Line */}
      <Polyline positions={routeCoords} />
    </MapContainer>
  );
}
