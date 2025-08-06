"use client";
import Map from "@/components/mapcomponents";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useUserContext } from "@/context/userContext";
import { initSocket, joinRoom, leaveRoom, emitLocationUpdate, onLocationUpdate } from "@/socket/socket";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function OrderTracking() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("deliveryId");
  const destination = searchParams.get("destination");
  const { user } = useUserContext();
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null); // [lat, lng]
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null); // [lat, lng]
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [watchId, setWatchId] = useState<number | null>(null);

  // Initialize socket and join room
  useEffect(() => {
    if (!orderId || !user?.id) {
      toast.error("Missing order ID or user information");
      return;
    }

    const socket = initSocket();
    joinRoom(orderId, user.id, orderId);

    // For customer: Listen for delivery partner's location updates
    if (user.role === "customer") {
      onLocationUpdate(orderId, (location) => {
        setStartCoords([location.lat, location.lng]);
      });
    }

    return () => {
      leaveRoom(orderId);
    };
  }, [orderId, user?.id, user?.role]);

  // Track delivery partner's location (only for delivery role)
  useEffect(() => {
    if (user?.role !== "delivery" || !navigator.geolocation) {
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by this browser");
      }
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newStart = [latitude, longitude] as [number, number];
        setStartCoords(newStart);

        // Broadcast location to WebSocket room
        if (orderId) {
          emitLocationUpdate(orderId, { lat: latitude, lng: longitude });
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Failed to get current location");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );
    setWatchId(id);

    return () => {
      if (id) navigator.geolocation.clearWatch(id);
    };
  }, [orderId, user?.role]);

  // Geocode destination address using backend API
  useEffect(() => {
    const geocodeAddress = async () => {
      if (!destination) {
        toast.error("Destination address is missing");
        return;
      }

      try {
        const res = await fetch(
          `https://ordertracker-vepx.onrender.com/api/v1/map/getaddresscoordinate/${encodeURIComponent(destination)}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await res.json();
        if (data.success && data.coordinates) {
          setDestinationCoords([data.coordinates.latitude, data.coordinates.longitude]);
        } else {
          toast.error(data.message || "Failed to geocode destination address");
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
        toast.error("Failed to geocode destination address");
      }
    };

    geocodeAddress();
  }, [destination]);

  // Fetch route when start and destination coordinates are available
  useEffect(() => {
    const fetchRoute = async () => {
      if (!startCoords || !destinationCoords) return;

      const start = `${startCoords[1]},${startCoords[0]}`; // lng,lat
      const end = `${destinationCoords[1]},${destinationCoords[0]}`; // lng,lat

      try {
        const res = await fetch(
          `https://api.openrouteservice.org/v2/directions/driving-car?api_key=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImZkNjdjMWJkMDFkMTQ5Y2JiYWZhYzljODYzZjQ1M2JhIiwiaCI6Im11cm11cjY0In0=&start=${start}&end=${end}`
        );
        const data = await res.json();
        if (data.features && data.features.length > 0) {
          const coords = data.features[0].geometry.coordinates.map(
            (coord: number[]) => [coord[1], coord[0]] // Convert [lng, lat] to [lat, lng]
          );
          setRouteCoords(coords);
        } else {
          toast.error("Failed to fetch route");
        }
      } catch (error) {
        console.error("Failed to fetch route:", error);
        toast.error("Failed to fetch route");
      }
    };

    fetchRoute();
  }, [startCoords, destinationCoords]);

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold p-4">
          {user?.role === "delivery" ? `Navigating Order ${orderId}` : `Tracking Order ${orderId}`}
        </h1>
        <Link
          href={user?.role === "delivery" ? "/deliverypartner" : "/customer"}
          className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors p-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{user?.role === "delivery" ? "Back to Deliveries" : "Back to Orders"}</span>
        </Link>
      </div>

      {routeCoords.length > 0 && startCoords && destinationCoords ? (
        <Map
          routeCoords={routeCoords}
          startCoords={startCoords}
          endCoords={destinationCoords}
        />
      ) : (
        <div className="flex items-center justify-center h-screen">
          <p>{user?.role === "delivery" ? "Tracking your location..." : "Waiting for delivery partner location..."}</p>
        </div>
      )}
    </div>
  );
}