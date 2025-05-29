// socketConnect.ts
import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";

let io: Server;

export const initSocketIO = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  return io;
};

export { io };
