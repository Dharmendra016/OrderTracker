// components/MapComponent.tsx
"use client";

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: "/leaflet/images/marker-icon.png",
    iconRetinaUrl: "/leaflet/images/marker-icon-2x.png",
    shadowUrl: "/leaflet/images/marker-shadow.png",
});


export default function MapComponent() {

    const [position, setPosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                console.log("Current Position:", latitude, longitude);
                setPosition([latitude, longitude]);
            },
            (err) => console.error(err)
        );

        // Cleanup
        return () => navigator.geolocation.clearWatch(watchId);

    }, [])

    return (
        <div className="w-full h-full">
            {position ? (
                <MapContainer
                    center={position}
                    zoom={13}
                    style={{ height: "400px", width: "100%" }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    />
                    <Marker position={position}>
                        <Popup>You are here</Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <p>Loading map...</p>
            )}
        </div>
    );
};