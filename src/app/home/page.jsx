"use client";
import { fetchAllCanvas } from "@/lib/actions/canvas.action";
import { getUserById } from "@/lib/actions/user.action";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";


export default function Home() {
  const { userId } = useAuth();
  const [user, setUser] = useState({});
  const [allCanvas, setAllCanvas] = useState([]);
  const router = useRouter();
  useEffect(() => {
    if (!userId) return;
    getUserById({ clerkId: userId })
      .then((founduser) => setUser(JSON.parse(founduser)))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!user || !user._id) return;
    fetchAllCanvas(user._id)
      .then((canvas) => setAllCanvas(canvas))
      .catch((error) => console.error(error));
  }, [user._id]);

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
