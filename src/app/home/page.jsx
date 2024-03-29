"use client";
import HomeTable from "@/components/HomeTable";
import HomeHeader from "@/components/homeHeader";
import { useToast } from "@/components/ui/use-toast";
import { fetchAllCanvas, fetchJoinedCanvas } from "@/lib/actions/canvas.action";
import { getUserById } from "@/lib/actions/user.action";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Home() {
  const { toast } = useToast();
  const { userId } = useAuth();
  const [user, setUser] = useState({});
  const [allCanvas, setAllCanvas] = useState([]);
  const [joinedCanvas, setJoinedCanvas] = useState([]);
  const router = useRouter();
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
  }, []);

  useEffect(() => {
    if (!user || !user._id) return;
    fetchAllCanvas(user._id)
      .then((canvas) => setAllCanvas(canvas))
      .catch((error) => {
        toast({
          duration: 2000,
          title: "Server Error",
          description: "Please Refresh the page.",
        });
      });
  }, [user._id]);

  useEffect(()=>{
    if (!user || !user._id) return;
    fetchJoinedCanvas(user._id)
      .then((canvas) => setJoinedCanvas(canvas))
      .catch((error) => {
        toast({
          duration: 2000,
          title: "Server Error",
          description: "Please Refresh the page.",
        });
      });
  },[user._id])

  //load canvas on click
  const open = (id) => {
    router.push(`/draw?${id}`);
  };

  const openRoom = (id) => {
    router.push(`/draw/${id}`);
  };

  return (
    <div className="bg-zinc-950 h-screen text-white">
      <HomeHeader username={user.username} /> 
      <HomeTable />
      
      {/* <div>
        Personal Canvas List :
        <ul>
          {allCanvas && allCanvas.map((canvas) => {
            return (
              <li key={canvas.canvasId}>
                <p>
                  {canvas.canvasName} {canvas.updatedAt}
                  <button onClick={() => open(canvas.canvasId)}>
                    Open Canvas
                  </button>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        Shared Canvas List :
        <ul>
          {joinedCanvas && joinedCanvas.map((canvas) => {
            return (
              <li key={canvas.canvasId}>
                <p>
                  {canvas.canvasName} {canvas.updatedAt}
                  <button onClick={() => openRoom(canvas.roomId)}>
                    Open Canvas
                  </button>
                </p>
              </li>
            );
          })}
        </ul>
      </div> */}
    </div>
  );
}
