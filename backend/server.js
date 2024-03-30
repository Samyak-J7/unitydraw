import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 4001;

io.on("connection", (socket) => {
  //join room
  socket.on("joinRoom", (roomId, userid) => {
    if (!roomId) return;
    socket.join(roomId);
    socket.emit("userJoined", { roomId, userid }); // send confirmation to user that he successfully joined
    socket.to(roomId).emit("roomJoined", { roomId, userid }); // send to everyone in room that a user joined
  });

  //cursor data
  socket.on("cursor", (data, roomId) => {
    if (!roomId) return;
    socket.to(roomId).emit('cursor', { ...data, userId: socket.id });
  });

  //object data
  socket.on("realtimeObject", (data, roomId) => {
    if (!roomId) return;
    socket.to(roomId).emit("realtimeObject", data);
  });

  //disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
