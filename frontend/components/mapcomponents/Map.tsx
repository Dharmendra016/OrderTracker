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

export default function Map({ startCoords, endCoords, routeCoords }: { startCoords: [number, number]; endCoords: [number, number]; routeCoords: [number, number][] }) {
  if (!routeCoords || routeCoords.length < 2) return <p>Invalid route coordinates</p>;

  return (
    <MapContainer center={startCoords} zoom={16} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Delivery Partner Marker */}
      <Marker position={startCoords}>
        <Popup>Delivery Partner</Popup>
      </Marker>

      {/* Customer/Destination Marker */}
      <Marker position={endCoords}>
        <Popup>Customer Location</Popup>
      </Marker>

      {/* Route Line */}
      <Polyline positions={routeCoords} />
    </MapContainer>
  );
}
