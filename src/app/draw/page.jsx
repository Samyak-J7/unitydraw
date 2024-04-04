"use client";
import Canvas from "@/components/canvas";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {  useAuth } from "@clerk/nextjs";
import {  Home, Loader2, Save, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from "uuid";
import { fetchCanvasById, saveCanvas } from "@/lib/actions/canvas.action";
import { getUserById } from "@/lib/actions/user.action";
import { CanvasNameInput } from "@/components/CanvasNameInput";
import { createRoom } from "@/lib/actions/room.action";

const Draw = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [roomId, setRoomId] = useState(null);
  const { userId } = useAuth();
  const [user, setUser] = useState({});
  const searchParams = useSearchParams();
  const [canvasData, setCanvasData] = useState(null);
  const [canvasName, setCanvasName] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    const canvasId = `${searchParams}`.slice(0, -1);
    if (canvasId && user._id) {
      fetchCanvasById(canvasId, user._id)
        .then((data) => setCanvasData(data))
        .catch((error) => {
          toast({
            duration: 2000,
            title: "Error",
            description: "Canvas not found.",
          });
          router.push("/draw");
        });
    }
  }, [user._id, searchParams, router, toast]);

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
  }, [userId, toast]);

  //create team on button click
  const createTeam = async () => {
    const roomName = uuidv4();
    createRoom({ roomId: roomName, createdBy: user._id, editors: [user._id] })
      .then(() => {
        save(roomName).then(() => {
          setRoomId(roomName);
        });
      })
      .catch((error) => {
        toast({
          duration: 2000,
          title: "Error",
          description: "Team not created.",
        });
      });
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
  }, [roomId, router, toast]);

  const changeCanvasName = (name) => {
    setCanvasName(name);
  };

  //save button click
  const save = (roomid) => {
    return new Promise((resolve, reject) => {
      setSaving(true);
      const canvasId = `${searchParams}`.slice(0, -1);
      const SaveCanvasId = uuidv4();
      const dataToSave = {
        canvasName: canvasName || "Untitled",
        canvasData: JSON.parse(localStorage.getItem("canvasState")),
        createdBy: user,
        canvasId: canvasId || SaveCanvasId,
      };

      if (roomid) {
        dataToSave.roomId = roomid;
      }

      saveCanvas(dataToSave)
        .then(() => {
          if (!roomid) {
            setSaving(false);
            toast({
              duration: 2000,
              title: "Saved",
              description: "Your Canvas has been saved.",
            });
          }

          if (!canvasId) {
            router.push(`/draw?${SaveCanvasId}`);
          }
          resolve();
        })
        .catch((error) => {
          setSaving(false);
          toast({
            duration: 2000,
            title: "Error",
            description: "Canvas not saved.",
          });
          reject(error);
        });
    });
  };

  return (
    <div className="h-screen w-screen flex flex-col ">
      <div className="py-2 px-3 flex justify-between items-center w-full bg-transparent border-2 border-b-slate-100">
      <span className="z-10 flex items-center gap-2">
          <Button
            onClick={() => router.push("/home")}
            className="flex items-center gap-1 bg-red-200 shadow-2xl text-black border-2 border-red-500 hover:bg-red-300 hover:border-black"
          >
            <Home /> <span className="sm:block hidden" > Home </span> 
          </Button>
          <CanvasNameInput title={changeCanvasName}  />
        </span>
        <span className="flex z-50  gap-2 ">
          
          <Button
            className=" bg-green-200 shadow-2xl text-black border-2 border-green-500 hover:bg-green-400 hover:border-gray-600"
            onClick={() => save(null)}
          >
            <Save className="m-1" size={20} />
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <span className="sm:block hidden" > Save </span> 
            )}
          </Button>
          <Button
            className=" shadow-2xl bg-blue-200 text-black border-2 border-blue-500 hover:bg-blue-400 hover:border-gray-600"
            onClick={createTeam}
          >
            <Users className="m-1" size={20} />
            <span className="sm:block hidden" > Live Collaboration </span> 
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
