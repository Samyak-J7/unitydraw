"use client";
import HomeTable from "@/components/HomeTable";
import HomeHeader from "@/components/homeHeader";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useToast } from "@/components/ui/use-toast";
import { getUserById } from "@/lib/actions/user.action";
import { useAuth } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

export default function Home() {
  const { toast } = useToast();
  const { userId } = useAuth();
  const [user, setUser] = useState(null);

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

  return (
    <div className="bg-zinc-950 h-screen text-white">
      {user &&<><HomeHeader username={user.firstName + " " + user.lastName} /><HomeTable userId={user._id} /></> }
      <BackgroundBeams/>
    </div>
  );
}
