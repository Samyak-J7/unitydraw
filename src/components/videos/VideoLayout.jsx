"use client";
import {
  CallingState,
  StreamCall,
  StreamTheme,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import React, { useEffect, useState } from "react";
import Spinner from "./Spinner";
import LocalParticipantVideo from "./LoacalParticipantVideo";
import RemoteParticipantVideoList from "./RemoteParticipantVideoList";
import Meeting from "./Meeting";
import useCallGetById from "../../../hooks/useCallGetById";
import { useUser } from "@clerk/nextjs";
import MeetingRoom from "./MeetingRoom";
import MeetingSetup from "./MeetingSetup";

const VideoLayout = (props) => {
  const{setShow} =props;
  const {
    useCallCallingState,
    useParticipantCount,
    useLocalParticipant,
    useRemoteParticipants,
  } = useCallStateHooks();

  const { id } = props;
  const { call, isCallLoading } = useCallGetById(id);
  const { user, isLoaded } = useUser();
  const [isSetup, setIsSetup] = useState();

  if (!isLoaded || isCallLoading) return <Spinner />;
  return (
    <StreamCall  call={call}>
      <StreamTheme>
        {isSetup ? <MeetingRoom setShow={setShow} /> : <MeetingSetup setIsSetup={setIsSetup} />}
      </StreamTheme>
    </StreamCall>
  );
};

export default VideoLayout;

{
  /* <div className="grid grid-cols-2 xl:grid-cols-1 gap-10 xl:gap-4 text-white capitalize">
        <LocalParticipantVideo participant={localParticipant} />
        <RemoteParticipantVideoList participants={remoteParticipants} />
      </div> */
}
//   if (callingState !== CallingState.JOINED) {
//     return (
//       <div className="mt-2 h-32 w-full flex justify-center items-center">
//         <Spinner />
//       </div>
//     );
//   }

// useEffect(() => {
//   props.setParticipantCount(participantCount);
// }, [participantCount, props]);
{
  /* <Meeting
        participant={localParticipant}
        participants={remoteParticipants}
        id={id}
      /> */
}
