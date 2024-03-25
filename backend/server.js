import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { v4 as uuidv4 } from "uuid";
const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 4001;
let rooms = {};

io.on("connection", (socket) => {

  //create room
  socket.on("createRoom", (userid) => {
    const roomName = uuidv4(); // Generate a unique room ID
    socket.join(roomName);

    rooms[roomName] = {
      creator: userid, // The user who created the room
      editors: [userid],
      viewers: [],
    };
    console.log(userid, "created room:", { roomName, role: "editor" });

    // Broadcast room creation to all connected clients
    socket.emit("roomCreated", { roomName, role: "editor" });
  });


  //join room
  socket.on("joinRoom", (roomId, userid) => {
    if (!roomId || !rooms[roomId]) {
      // Handle invalid room ID or non-existing room
      console.log(userid, "tried to join invalid room:", roomId);
      return;
    }
    socket.join(roomId);
    if (!rooms[roomId].editors.includes(userid)) {
      // Check if the user is already in the viewers list
      if (!rooms[roomId].viewers.includes(userid)) {
        // If the user is not in either list, add them to the viewers list
        rooms[roomId].viewers.push(userid);
        console.log(userid, "joined room as viewer:", roomId);
        // Broadcast user joined as a viewer to the room
        socket.to(roomId).emit("userJoined", { userid, role: "viewer" });
      } else {
        console.log(userid, "already joined as viewer:", roomId);
      }
    } else {
      console.log(userid, "joined room as editor:", roomId);
      // Broadcast user joined as an editor to the room
      socket.to(roomId).emit("userJoined", { userid, role: "editor" });
    }
  });

  socket.on("cursor", (data, roomId) => {
    if (!roomId || !rooms[roomId]) {
      return;
    }
    

    // Broadcast cursor position to all connected clients except the sender
    socket.to(roomId).emit("cursor", data);
  });

  socket.on("realtimeObject", (data, roomId) => {
    if (!roomId || !rooms[roomId]) {
      return;
    }

    // Broadcast realtime object to all connected clients except the sender
    socket.to(roomId).emit("realtimeObject", data);
  });

  socket.on("disconnect", () => {
    
    console.log("A user disconnected");
  });

});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
