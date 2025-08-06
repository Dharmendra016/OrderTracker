"use client";
import Map from "@/components/mapcomponents"; // You must have a working Map component using Leaflet
import { useEffect, useState } from "react";

export default function OrderTracking() {
    const [startCoords, setStartCoords] = useState<[number, number] | null>(null); // [lat, lng]
    const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);

    useEffect(() => {
        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const newStart = [latitude, longitude] as [number, number];
                setStartCoords(newStart);
            },
            (error) => {
                console.error("Error getting location:", error);
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 1000,
            }
        );
        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    useEffect(() => {
        const fetchRoute = async () => {
            if (!startCoords) return;

            const start = `${startCoords[1]},${startCoords[0]}`; // lng,lat

            // Move ~12 km northeast from the current location
            const offsetLat = 0.1; // ~11.1 km
            const offsetLng = 0.1; // ~8.5 km at 45° latitude

            const endLat = startCoords[0] + offsetLat;
            const endLng = startCoords[1] + offsetLng;

            const end = `${endLng},${endLat}`; // lng,lat
            
            console.log("Tracking started with watchId:", startCoords);
            try {
                const res = await fetch(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZkNjdjMWJkMDFkMTQ5Y2JiYWZhYzljODYzZjQ1M2JhIiwiaCI6Im11cm11cjY0In0=&start=${start}&end=${end}`);
                const data = await res.json();
                const coords = data.features[0].geometry.coordinates.map(
                    (coord: number[]) => [coord[1], coord[0]] // convert [lng, lat] to [lat, lng]
                );
                setRouteCoords(coords);
            } catch (error) {
                console.error("Failed to fetch route:", error);
            }
        };

        fetchRoute();
    }, [startCoords]);

    return (
        <div>
            {routeCoords.length > 0 ? <Map
                routeCoords={routeCoords}
            /> :
            <p>Tracking your location...</p>
            }
            
        </div>
    );
}
