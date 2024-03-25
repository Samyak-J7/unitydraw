"use client";
import Canvas from "@/components/canvas";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { useAuth } from "@clerk/nextjs";
const socket = io("http://localhost:4001");

const Draw = () => {

  const router = useRouter();
  const {  userId } = useAuth();
  const [roomId, setRoomId] = useState(null);
  const [roomCreated, setRoomCreated] = useState(false);
  useEffect(() => {
    socket.on("roomCreated", (details) => {
      setRoomId(details.roomName);
      setRoomCreated(true);
    });
  }, []);

  const sharecanvas = () => {
    socket.emit("createRoom", userId);
    socket.emit("joinRoom", roomId, userId);
  };
  useEffect(() => {
    if (roomCreated) {
      console.log(roomId);
      router.push(`/draw/${roomId}`);
    }
  }, [roomCreated]);

  return (
    <div>
      <Canvas username={userId} />
      <button onClick={sharecanvas}>share canvas</button>
    </div>
  );
};

export default Draw;
