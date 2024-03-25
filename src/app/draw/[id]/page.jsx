"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Canvas from "@/components/canvas";

export default function Page({ params }) {
  const { toast } = useToast();
  const roomId = ["edf66848-5da4-40ff-bf68-922d18a3c24c", "ll"];
  const isValidRoomId = true;
  const [showToast, setShowToast] = useState(false); // State to control when to show toast
  const router = useRouter();

  useEffect(() => {
    if (!isValidRoomId) {
      setShowToast(true); // Set state to true to show the toast
      router.push("/draw");
    }
  }, []); // Empty dependency array ensures this effect runs only once, like componentDidMount

  useEffect(() => {
    if (showToast) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "Something went wrong!",
        description: "Invalid Url or Server Error. Please try again.",
      });
    }
  }, [showToast]); // Effect to display toast when showToast state changes

  if (!isValidRoomId) {
    return null; // Prevent rendering if room is invalid
  }

  return (
    <div>
      <div className="px-8 py-2 z-10 flex justify-between w-full absolute top-0 h-20">
        <UserButton />
        <Button className="shadow-2xl bg-white text-black border-2 hover:bg-slate-300 hover:border-gray-600">
          <Users className="m-1" size={20} />
          Invite members
        </Button>
      </div>
      <Canvas roomId={params.id} />
    </div>
  );
}
