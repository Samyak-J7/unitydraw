"use client";
import React from "react";
import LocalParticipantVideo from "./LoacalParticipantVideo";
import RemoteParticipantVideoList from "./RemoteParticipantVideoList";
import Spinner from "./Spinner";
import {
  CancelCallButton,
  SpeakingWhileMutedNotification,
  ToggleAudioPublishingButton,
  ToggleVideoPublishingButton,
} from "@stream-io/video-react-sdk";
import {
  CallingState,
  useCall,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { PhoneOff } from "lucide-react";

const MeetingRoom = (props) => {
  const { setShow } = props;
  const {
    useCallCallingState,
    useParticipantCount,
    useLocalParticipant,
    useRemoteParticipants,
  } = useCallStateHooks();
  const { callingState } = useCallCallingState();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();
  // const participantCount = useParticipantCount();

  const router = useRouter();
  const call = useCall();

  // if(callingState !== CallingState.JOINED) return <Spinner />;

  const CallControls = ({ onLeave }) => (
    <div className="flex p-2 gap-2 items-center w-full overflow-hidden" >
      <div className="flex flex-col gap-2">
      <SpeakingWhileMutedNotification>
        <ToggleAudioPublishingButton />
      </SpeakingWhileMutedNotification>
      <ToggleVideoPublishingButton />
      </div>
      <div className="w-full">
      <CancelCallButton
        onClick={async() => {
            await call.leave();
            setShow(false)
        }}
        onLeave={onLeave}
      />
      </div>
    </div>
  );

  return (
    <div className="flex gap-2 items-center w-full  ">
      <LocalParticipantVideo participant={localParticipant} />
      <RemoteParticipantVideoList participants={remoteParticipants} />
      <div className="">
        {
          <CallControls
            onLeave={() => {
              // call.leave();
              setShow();
            }}
          />
        }
      </div>
    </div>
  );
};

export default MeetingRoom;
