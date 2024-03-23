import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
  }
});

const PORT = process.env.PORT || 4001;


io.on('connection', (socket) => {


  socket.on('cursor', (data) => {
    console.log('Cursor position:', data);
    // Broadcast cursor position to all connected clients except the sender
    socket.broadcast.emit('cursor', data);
  });

    socket.on('realtimeObject', (data) => {
        console.log('Realtime object:', data);
        // Broadcast realtime object to all connected clients except the sender
        socket.broadcast.emit('realtimeObject', data);
    });

  socket.on('disconnect', () => {   
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
