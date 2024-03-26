"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { UserButton } from "@clerk/nextjs";
import Canvas from "@/components/canvas";
import { Share } from "@/components/share";

export default function Page({ params }) {
  const { toast } = useToast();

  //VERIFY ROOM ID (params.id exists in database)

  const isValidRoomId = true;

  const [showToast, setShowToast] = useState(false); // State to control when to show toast
  const router = useRouter();

  // ******************* RUN WHEN ROOM ID IS NOT VALID ***************  start

  // call toast and reroute
  useEffect(() => {
    if (!isValidRoomId) {
      setShowToast(true);
      router.push("/draw");
    }
  }, []);

  //show toast
  useEffect(() => {
    if (showToast) {
      toast({
        duration: 5000,
        variant: "destructive",
        title: "Something went wrong!",
        description: "Invalid Url or Server Error. Please try again.",
      });
    }
  }, [showToast]);

  // Prevent rendering if room is invalid
  if (!isValidRoomId) {
    return null;
  }

  // *******************************************************************  stop

  // IF ROOM ID VERIFIED LOAD THE CANVAS AND SEND ROOM ID TO CONNECT
  return (
    <div>
      <div className="px-8 py-2 flex justify-between w-full absolute top-0 my-1">
        <span className="z-10">
          <UserButton />
        </span>
        <span className="z-10">
          <Share link={`http://localhost:3000/draw/${params.id}`} />
        </span>
      </div>
      <Canvas roomId={params.id} />
    </div>
  );
}
