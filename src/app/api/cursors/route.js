import { Server } from 'socket.io';

export default async function handler(req, res) {
  if (!res.socket.server.io) {
    // Initialize Socket.IO server
    const io = new Server(res.socket.server);

    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('A user connected');

      socket.on('cursor-update', (data) => {
        socket.broadcast.emit('cursor-update', data); // Broadcast to all clients
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }
  res.end();
}
