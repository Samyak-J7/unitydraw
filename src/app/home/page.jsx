"use client";
import { useToast } from "@/components/ui/use-toast";
import { fetchAllCanvas } from "@/lib/actions/canvas.action";
import { getUserById } from "@/lib/actions/user.action";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


export default function Home() {
  const { toast } = useToast();
  const { userId } = useAuth();
  const [user, setUser] = useState({});
  const [allCanvas, setAllCanvas] = useState([]);
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

  //load canvas on click
  const open = (id) => {
    router.push(`/draw?${id}` );
  };

  return (
    <div>
      <p>Home of {user.username}</p>
      <div>
        Personal Canvas List :
        <ul>
          {allCanvas.map((canvas) => {
            return (
              <li key={canvas.canvasId}>
                <p>
                  {canvas.canvasName} {canvas.createdAt} {canvas.updatedAt}
                  <button onClick={()=>open(canvas.canvasId)}>Open Canvas</button>
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
