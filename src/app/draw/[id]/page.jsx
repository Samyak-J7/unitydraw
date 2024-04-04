"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Canvas from "@/components/canvas";
import { Share } from "@/components/share";
import { Button } from "@/components/ui/button";
import { Save, Home, Loader2, VideoIcon } from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  fetchCanvasByroomId,
  saveCanvasbyroomID,
  saveUsertoRoom,
  validateRoom,
} from "@/lib/actions/room.action";
import { CanvasNameInput } from "@/components/CanvasNameInput";
import {
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import Loader from "@/components/Loader";
import VideoWrapper from "@/components/videos/VideoWrapper";
import VideoLayout from "@/components/videos/VideoLayout";
import Meeting from "@/components/videos/Meeting";

export default function Page({ params }) {
  const client = useStreamVideoClient();
  const { user, isLoaded } = useUser();
  const [calls, setCalls] = useState();
  const [participantCount, setParticipantCount] = useState(0);
  const date = new Date();
  const [show, setShow] = useState(false);
  const { toast } = useToast();
  const [isValidRoomId, setIsValidRoomId] = useState(false);
  const [showToast, setShowToast] = useState(false); // State to control when to show toast
  const router = useRouter();
  const [canvasData, setCanvasData] = useState(null);
  const [canvasName, setCanvasName] = useState(null);
  const { userId } = useAuth();
  const [saving, setSaving] = useState(false);
  //save button click
  const save = () => {
    setSaving(true);
    saveCanvasbyroomID(
      params.id,
      JSON.parse(localStorage.getItem("canvasState")),
      canvasName
    )
      .then(() => {
        setSaving(false);
        toast({
          duration: 1500,
          title: "Saved",
          description: "Your Canvas has been saved.",
        });
      })
      .catch((err) => {
        setSaving(false);
        setShowToast(true);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isValid = await validateRoom(params.id);
        if (isValid) {
          setIsValidRoomId(true);
          await saveUsertoRoom(params.id, userId);
          const data = await fetchCanvasByroomId(params.id);
          setCanvasData(data.canvasData);
        } else {
          setShowToast(true);
          router.push("/draw");
        }
      } catch (err) {
        setShowToast(true);
      }
    };

    fetchData();
  }, [params.id, router, userId]);

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
  }, [showToast, toast]);

  // Prevent rendering if room is invalid
  //todo set loader
  if (!isValidRoomId) {
    return <div> Loading Team Canvas </div>;
  }

  const createMeeting = async () => {
    if (!user || !client) return;
    try {
      const call = client.call("default", params.id);
      if (!call) throw new Error("Failed to create call");
      const startsAt = new Date(Date.now()).toISOString();
      await call.getOrCreate({
        data: {
          starts_at: startsAt,
        },
      });
      setCalls(call);
      setShow(true);
    } catch (error) {
      console.error(error);
      toast({ title: "Failed to create meeting" });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col ">
    <div className="py-2 px-3 flex justify-between items-center w-full bg-transparent border-2 border-b-slate-100">
        <span className="z-10 flex items-center gap-2">
          <Button
            onClick={() => router.push("/home")}
            className="flex items-center gap-1 bg-red-200 shadow-2xl text-black border-2 border-red-500 hover:bg-red-300 hover:border-black"
          >
            <Home /> Home
          </Button>
          <CanvasNameInput title={changeCanvasName} roomId={params.id} />
        </span>
        <span className="z-10 flex gap-2 ">
        <Button
            className="bg-green-200 shadow-2xl text-black border-2 border-green-500 hover:bg-green-400 hover:border-gray-600"
            onClick={save}
          >
            <Save className=" m-1" size={20} />
            {saving ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
          <Button 
            className="flex gap-1 shadow-2xl bg-violet-200 text-black border-2 border-violet-500 hover:bg-violet-400 hover:border-gray-600"
            onClick={() => {
              createMeeting();
            }}
          >
            <VideoIcon></VideoIcon> Join Call
          </Button>
         
          <Share link={`${process.env.NEXT_PUBLIC_DOMAIN}/draw/${params.id}`} />
        </span>
      </div>
      {canvasData && <Canvas data={canvasData} roomId={params.id} />}
      <div className="mb-1 z-10 absolute left-[100px] bottom-0 w-4/5 xl:min-h-0 mx-auto flex items-center  gap-3 text-white  ">
        {show ? (
          <VideoLayout  id={params.id} setShow={setShow} userId={userId} />
        ) : null}
      </div>
    </div>
  );
}

// {calls ? <Meeting id ={params.id} userId={userId} /> :null}

{
  /* <VideoWrapper userData = {user} callId = {params.id}>
                <VideoLayout setParticipantCount = {setParticipantCount} />
            </VideoWrapper> */
}
{
  /* <VideoLayout setParticipantCount={setParticipantCount} id={params.id} /> */
}
