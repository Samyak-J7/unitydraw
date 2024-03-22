import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000/api/cursors'); // Connect to API route

function Cursor({ id, x, y, color }) {
  const [cursorStyle, setCursorStyle] = useState({
    left: `${x}px`,
    top: `${y}px`,
    backgroundColor: color,
  });

  useEffect(() => {
    socket.on('cursor-update', (data) => {
      if (data.id !== id) {
        setCursorStyle({ left: `${data.x}px`, top: `${data.y}px` });
      }
    });
  }, []);

  return <div className="cursor" style={cursorStyle}></div>;
}

export default Cursor;
