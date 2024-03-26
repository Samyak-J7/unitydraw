"use client";
import Canvas from "@/components/canvas";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";

const Draw = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [roomId, setRoomId] = useState(null);

  //create team on button click
  const createTeam = () => {
    const roomName = uuidv4();
    //add room to database
    setRoomId(roomName); // triggers the useffect below
  };

  //reroute user to created room and toast successfully created team
  useEffect(() => {
    if (roomId) {
      router.push(`/draw/${roomId}`); //dynamic route
      toast({
        duration: 5000,
        title: "Team Created",
        description: "Share this URL with your friends to add members.",
      });
    }
  }, [roomId]);

  return (
    <div>
      <div className="px-8 py-2 flex justify-between w-full absolute top-0 my-1">
        <span className="z-10">
          <UserButton />
        </span>

        
        
        <span className="z-10 flex gap-2">     
        <Button
            className=" bg-green-200 shadow-2xl text-black border-2 border-green-500 hover:bg-green-400 hover:border-gray-600"
           
          >
            <Save className="m-1" size={20} /> 
            Save
          </Button> 
          <Button
            className=" shadow-2xl bg-blue-200 text-black border-2 border-blue-500 hover:bg-blue-400 hover:border-gray-600"
            onClick={createTeam}
          >
            <Users className="m-1" size={20} /> 
            Make a Team
          </Button>
        </span>
      </div>

      <Canvas />
    </div>
  );
};

export default Draw;
