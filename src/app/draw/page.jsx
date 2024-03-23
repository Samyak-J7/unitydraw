"use client";

import React, { useEffect } from "react";
import io from 'socket.io-client';
import Canvas from "@/components/canvas";

const Draw = () => {
  useEffect(() => {
    const socket = io('http://localhost:4001');
  
    socket.on('connect', () => {
      console.log('Connected to server');
    });
  
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  
    return () => {
      socket.disconnect();
    };
  }, []);
  return(
    <Canvas />
  )
}

export default Draw;
