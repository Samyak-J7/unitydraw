"use client";
import Canvas from "@/components/canvas";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { UserButton, useAuth } from "@clerk/nextjs";
import { Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { fetchCanvasById, saveCanvas } from "@/lib/actions/canvas.action";
import { getUserById } from "@/lib/actions/user.action";
import { set } from "mongoose";

const Draw = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [roomId, setRoomId] = useState(null);
  const { userId } = useAuth();
  const [user, setUser] = useState({});
  const searchParams = useSearchParams();
  const [canvasData, setCanvasData] = useState(null);
  useEffect(() => {
    const canvasId = `${searchParams}`.slice(0, -1);
    if (canvasId && user._id) {
        fetchCanvasById(canvasId, user._id)
        .then((data) => setCanvasData(data))
        .catch((error) =>{
          toast({
            duration: 2000,
            title: "Error",
            description: "Canvas not found.",
          });
          router.push("/draw");
        });
    }
  }, [user._id]);


  useEffect(() => {
    if (!userId) return;
    getUserById({ clerkId: userId })
      .then((founduser) => setUser(JSON.parse(founduser)))
      .catch((error) => {
        toast({
          duration: 2000,
          title: "Cannot find User",
          description: "Please Login or Refresh the page.",
        });
      
      });
  }, [userId]);

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

  //save button click
  const save = () => {
    const canvasId = `${searchParams}`.slice(0, -1);
    const savedCanvasState = localStorage.getItem("canvasState");
    saveCanvas({
      canvasName: "Untitled",
      canvasData: JSON.parse(savedCanvasState),
      createdBy: user,
      canvasId: canvasId? canvasId : uuidv4(),
    })
    .then(() => {
    toast({
      duration: 2000,
      title: "Saved",
      description: "Your Canvas has been saved.",
    })})
    .catch((error) => {
      toast({
        duration: 2000,
        title: "Error",
        description: "Canvas not saved.",
      });
    });

  };
  return (
    <div>
      <div className="px-8 py-2 flex justify-between w-full absolute top-0 my-1">
        <span className="z-10">
          <UserButton />
        </span>

        <span className="z-10 flex gap-2">
          <Button
            className=" bg-green-200 shadow-2xl text-black border-2 border-green-500 hover:bg-green-400 hover:border-gray-600"
            onClick={save}
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

      {canvasData !== null ? (
        <Canvas data={canvasData} />
      ) : (
        <>
        <Canvas />
        </>
      )}
    </div>
  );
};

export default Draw;
