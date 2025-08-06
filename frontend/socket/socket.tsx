"use client";
import { io, Socket } from "socket.io-client";
import { useUserContext } from "@/context/userContext";

// Singleton Socket instance
let socket: Socket | null = null;

// Initialize socket connection
export const initSocket = (): Socket => {
  if (!socket) {
    socket = io("https://ordertracker-vepx.onrender.com");

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket?.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
    });
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

// Join a WebSocket room
export const joinRoom = (roomId: string, userId: string, orderId: string) => {
  if (socket && socket.connected) {
    socket.emit("join-room", { roomId, userId, orderId });
    console.log(`Joined WebSocket room: ${roomId} with userId: ${userId}, orderId: ${orderId}`);
  } else {
    console.error("Socket not connected");
  }
};

// Leave a WebSocket room
export const leaveRoom = (roomId: string) => {
  if (socket && socket.connected) {
    socket.emit("leaveRoom", roomId);
    console.log(`Left WebSocket room: ${roomId}`);
  }
};

// Emit location update to a room
export const emitLocationUpdate = (roomId: string, location: { lat: number; lng: number }) => {
  if (socket && socket.connected) {
    socket.emit("send-location", { roomId, location });
    console.log(`Emitted location for ${roomId}:`, location);
  }
};

// Listen for location updates
export const onLocationUpdate = (
  roomId: string,
  callback: (location: { lat: number; lng: number }) => void
) => {
  if (socket) {
    socket.on("receive-location", (location: { lat: number; lng: number }) => {
      callback(location);
    });
  }
};

// Clean up socket listeners
export const cleanupSocket = () => {
  if (socket) {
    socket.off("receive-location");
    socket.disconnect();
    socket = null;
  }
};

// Get the socket instance (for advanced use cases)
export const getSocket = (): Socket | null => {
  return socket;
};