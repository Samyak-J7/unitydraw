"use client";
import React, { useState } from 'react';
import Cursor from '@/components/cursors.jsx';

function HomePage() {
  const [cursorId, setCursorId] = useState(Math.random().toString(36).substring(2, 15)); // Generate random ID
  const [cursorX, setCursorX] = useState(0);
  const [cursorY, setCursorY] = useState(0);

  const handleMouseMove = (event) => {
    setCursorX(event.clientX);
    setCursorY(event.clientY);
    socket.emit('cursor-update', { id: cursorId, x: cursorX, y: cursorY }); // Emit cursor updates
  };

  return (
    <div className="container" onMouseMove={handleMouseMove}>
      <Cursor id={cursorId} x={cursorX} y={cursorY} color="blue" /> {/* Your cursor component */}
      {/* Add other content here */}
    </div>
  );
}

export default HomePage;
