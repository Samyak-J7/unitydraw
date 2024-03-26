"use client";
import { getUserById } from "@/lib/actions/user.action";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect } from "react";

export default function Home() {
  const { userId } = useAuth();
  console.log(userId);

  useEffect(async () => {
    if (!userId) return;
    if (!userId) return;
    getUserById({ clerkId: userId })
        .then(foundUser => console.log(foundUser))
        .catch(error => console.error(error));
    // console.log(foundUser);
  }, [userId]);

  return <div>Home</div>;
}
