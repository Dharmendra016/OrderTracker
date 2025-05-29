import { Server, Socket } from "socket.io";
import UserModel from "../../models/user.model";
import OrderModel from "../../models/order.model";

interface LocationData {
  roomId: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface JoinRoomData {
  roomId: string;
  userId: string;
  orderId: string;
}

export const registerLocationHandlers = async (io: Server, socket: Socket) => {
  // Store userId and orderId when socket joins a room
  socket.on("join-room", ({ roomId, userId, orderId }: JoinRoomData) => {
    socket.join(roomId);
    socket.data.userId = userId;
    socket.data.orderId = orderId;

    console.log(`Socket ${socket.id} joined room ${roomId} with userId ${userId} and orderId ${orderId}`);
  });

  // Handle incoming location updates
  socket.on("send-location", async ({ roomId, location }: LocationData) => {
    try {
      console.log(`Received location from ${socket.id}:`, location);

      // Emit to all in room
      io.to(roomId).emit("receive-location", location);

      // Get userId and orderId from socket data
      const userId = socket.data.userId;
      const orderId = socket.data.orderId;

      if (!userId || !orderId) {
        console.warn("Missing userId or orderId in socket data");
        return;
      }

      // 1. Update user currentLocation
      await UserModel.findByIdAndUpdate(userId, {
        currentLocation: {
          latitude: location.lat,
          longitude: location.lng,
        },
      });

      // 2. Push new location to order currentLocation array
      await OrderModel.findByIdAndUpdate(orderId, {
        $push: {
          currentLocation: {
            lat: location.lat,
            lng: location.lng,
          },
        },
      });

      console.log(`Updated user ${userId} and pushed location to order ${orderId}`);
    } catch (error) {
      console.error("Error handling send-location:", error);
    }
  });

  // Optional: handle disconnect
  socket.on("disconnect", () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
};
