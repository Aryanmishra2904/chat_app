// backend/lib/socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const userSocketMap = {}; // { userId: socketId }

// ✅ helper function to get receiver socketId
export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];

io.on("connection", (socket) => {
  const userId = socket.handshake.auth?.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  console.log("A user connected:", socket.id);

  // Send updated online users list
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ❌ Removed duplicate socket.on("sendMessage")

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    for (const [id, sId] of Object.entries(userSocketMap)) {
      if (sId === socket.id) delete userSocketMap[id];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
