"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L, { Icon } from "leaflet";

const icon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41], // Proper anchor so it points at the location
});

export default function MapComponent() {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  function LocateOnLoad() {
    const map = useMap();

    useEffect(() => {
      map.locate({ setView: true });

      const onLocationFound = (e: L.LocationEvent) => {
        setPosition(e.latlng);
      };

      const onLocationError = (e: L.ErrorEvent) => {
        alert("Location access denied. Please allow it in your browser.");
        console.error(e.message);
      };

      map.on("locationfound", onLocationFound);
      map.on("locationerror", onLocationError);

      return () => {
        map.off("locationfound", onLocationFound);
        map.off("locationerror", onLocationError);
      };
    }, [map]);

    return null;
  }

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <LocateOnLoad />
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && (
        <Marker position={position} icon={icon}>
          <Popup>
            You are here.
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
