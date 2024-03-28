"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Canvas from "@/components/canvas";
import { Share } from "@/components/share";
import { Button } from "@/components/ui/button";
import { Save, Home } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import {
  fetchCanvasByroomId,
  saveCanvasbyroomID,
  saveUsertoRoom,
  validateRoom,
} from "@/lib/actions/room.action";
import { CanvasNameInput } from "@/components/CanvasNameInput";

export default function Page({ params }) {
  const { toast } = useToast();
  const [isValidRoomId, setIsValidRoomId] = useState(false);
  const [showToast, setShowToast] = useState(false); // State to control when to show toast
  const router = useRouter();
  const [canvasData, setCanvasData] = useState(null);
  const [canvasName, setCanvasName] = useState(null);
  const { userId } = useAuth();

  //save button click
  const save = () => {
    saveCanvasbyroomID(
      params.id,
      JSON.parse(localStorage.getItem("canvasState")),
    )
      .then(() => {
        toast({
          duration: 1500,
          title: "Saved",
          description: "Your Canvas has been saved.",
        });
      })
      .catch((err) => {
        setShowToast(true);
      });
  };

  useEffect(() => {
    validateRoom(params.id)
      .then((res) => {
        if (res) {
          setIsValidRoomId(true);
          saveUsertoRoom(params.id, userId);
          fetchCanvasByroomId(params.id)
            .then((data) => setCanvasData(data.canvasData))
            .catch((err) => {
              setShowToast(true);
            });
        } else {
          setShowToast(true);
          router.push("/draw");
        }
      })
      .catch((err) => {
        setShowToast(true);
      });
  }, []);

  const changeCanvasName = (name) => {
    setCanvasName(name);
  };

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
    return <div> Loading Team Canvas </div>;
  }

  return (
    <div>
      <div className="px-4 py-2 flex justify-between w-full absolute top-0 my-1">
        <span className="z-10">
          <Button
            onClick={() => router.push("/home")}
            className=" bg-red-200 shadow-2xl text-black border-2 border-red-500 hover:bg-red-300 hover:border-black"
          >
            <Home />
          </Button>
        </span>
        <span className="z-10">
          <CanvasNameInput title={changeCanvasName} roomId={params.id} />
        </span>
        <span className="z-10 flex gap-2">
          <Button
            className="bg-green-200 shadow-2xl text-black border-2 border-green-500 hover:bg-green-400 hover:border-gray-600"
            onClick={save}
          >
            <Save className=" m-1" size={20} />
            Save
          </Button>
          <Share link={`http://localhost:3000/draw/${params.id}`} />
        </span>
      </div>
      {canvasData && <Canvas data={canvasData} roomId={params.id} />}
    </div>
  );
}
