// socketConnect.ts
import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import { registerLocationHandlers } from "./socketControllers/location.controller";
import { config } from "../config/config";

let io: Server;

export const initSocketIO = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000",  config.client_url],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    registerLocationHandlers(io, socket);

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};

export { io };
