"use client";

import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

const StreamClientProvider = ({children}) => {
  const [videoClient, setVideoClient] = useState();
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }
    if (!apiKey) {
        throw new Error("Stream API key not set");
    }
    const client = new StreamVideoClient({
        apiKey,
        user: {
            id: user?.id,
            name: user?.username || user?.id,
            image: user?.imageUrl,
          },
        tokenProvider,
    });
    setVideoClient(client);
  }, [apiKey, isLoaded, user]);

  if(!videoClient) return <Loader />;

  return(
    <StreamVideo client={videoClient} >
        {children}
    </StreamVideo>
  )
};

export default StreamClientProvider;
