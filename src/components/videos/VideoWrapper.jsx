"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from "@stream-io/video-react-sdk";
import { tokenProvider } from "@/actions/stream.actions";
import { useUser } from "@clerk/nextjs";
import Spinner from "./Spinner";

const VideoWrapper = ({children}) => {
  const { user, isLoaded } = useUser();
  const [client, setClient] = useState(null);

  const initVideoCall = useCallback(async () => {
    try {
      const token = await tokenProvider();
      const video_client = new StreamVideoClient({
        apiKey: process.env.NEXT_PUBLIC_STREAM_API_KEY,
        user: {
          id: user?.id,
          name: user?.username || user?.id,
          image: user?.imageUrl,
        },
        token,
      });
      console.log(video_client ,"vclient");
      setClient(video_client);
      // const call = video_client.call("default", callId);
      // // await call.camera.disable();
      // // await call.microphone.disable();
      // call.join({create:true});
      // setCall(call);
    } catch (error) {
      console.error("Error initializing video call", error);
    }
  }, [user]);

  useEffect(() => {
    if (isLoaded && user) {
      console.log("hello");
      initVideoCall();
    }
  }, [initVideoCall, isLoaded, user]);

  if (!client) {
    return (
      <div className="mt-2 h-32 flex justify-center items-center">
        <Spinner />
      </div>
    );
  }
  return <StreamVideo client={client}>{children}</StreamVideo>;
};

export default VideoWrapper;

// <StreamCall call={call}>
//       </StreamCall>
