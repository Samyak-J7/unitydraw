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

const MeetingRoom = (props) => {
  const { setShow } = props;
  // const { participant, participants, id } = props;
  //   console.log("meeting room", participant, participants, id);
  const {
    useCallCallingState,
    useParticipantCount,
    useLocalParticipant,
    useRemoteParticipants,
  } = useCallStateHooks();
  const { callingState } = useCallCallingState();
  const localParticipant = useLocalParticipant();
  console.log("loca", localParticipant);
  const remoteParticipants = useRemoteParticipants();
  // const participantCount = useParticipantCount();

  console.log("calling", callingState);
  const router = useRouter();
  const call = useCall();
  console.log("meeting room");
  // if(callingState !== CallingState.JOINED) return <Spinner />;

  const CallControls = ({ onLeave }) => (
    <div className="str-video__call-controls">
      <SpeakingWhileMutedNotification>
        <ToggleAudioPublishingButton />
      </SpeakingWhileMutedNotification>
      <ToggleVideoPublishingButton />
      <CancelCallButton
        onClick={async() => {
            await call.leave();
            setShow(false)
        }}
        onLeave={onLeave}
      />
    </div>
  );

  return (
    <div className="flex flex-col">
      <LocalParticipantVideo participant={localParticipant} />
      <RemoteParticipantVideoList participants={remoteParticipants} />
      <div className=" absolute bottom-[-400px] left-[-700px] ">
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
