"use client";
import Canvas from "@/components/canvas";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
const socket = io("http://localhost:4001");

const Draw = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { userId } = useAuth();
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
      router.push(`/draw/${roomId}`);
      toast({
        duration: 5000,
        title: "Team Created",
        description: "Share this URL with your friends to add members.",
      });
    }
  }, [roomCreated]);

  return (
    <div>
      <div className=" px-8 py-2 z-10 flex  justify-between w-full absolute top-0 h-20">
        <UserButton />
        <Button
          className=" shadow-2xl bg-white text-black border-2 hover:bg-slate-300 hover:border-gray-600"
          onClick={sharecanvas}
        >
          <Users className="m-1" size={20} />
          Make a Team
        </Button>
      </div>

      <Canvas username={userId} />
    </div>
  );
};

export default Draw;
