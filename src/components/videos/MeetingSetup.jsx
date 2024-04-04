"use client";
import { DeviceSettings, VideoPreview, useCall } from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

const MeetingSetup = (props) => {
  const { setIsSetup } = props;
  const [setup,setSetup] = useState(false);
  const call = useCall();
  if (!call) throw new Error("Use call outside of StreamCall");
  
  useEffect(()=>{
    if(setup){
        call?.camera.disable();
        call?.microphone.disable();
    }else{
        call?.camera.enable();
        call?.microphone.enable();
    }
  }),[setup,call?.camera, call?.microphone]

  return(
    <div className=" absolute top-[-700px] flex flex-col items-center justify-center gap-3 text-white bg-neutral-950 p-10 rounded-2xl border-4  z-50 px-20  ">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={setup}
            onChange={(e) => setSetup(e.target.checked)}
          />
          Join without audio and video
        </label>
        <DeviceSettings />
      </div>
      <Button className="rounded-md bg-green-500 px-4 py-2.5" onClick={async()=>{
        await call.join();
        setIsSetup(true);

      }}>
        Join meeting
      </Button>
    </div>    
  )
};

export default MeetingSetup;
