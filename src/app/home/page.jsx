"use client";
import { fetchAllCanvas } from "@/lib/actions/canvas.action";
import { getUserById } from "@/lib/actions/user.action";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

export default function Home() {
  const { userId } = useAuth();
  const [ user, setUser ] = useState({});

  useEffect(() => {
    if (!userId) return;
    getUserById({ clerkId: userId })
      .then((founduser) => setUser(JSON.parse(founduser)))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!user) return;
    console.log(user)
    fetchAllCanvas(user)
      .then((canvas) => console.log(canvas))
      .catch((error) => console.error(error));
  }, [user])

  return <div>Home of {user.username}</div>;
}
