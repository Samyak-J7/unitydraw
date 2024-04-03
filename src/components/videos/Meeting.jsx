"use client";

import { useState } from "react";
import MeetingRoom from "./MeetingRoom";
import MeetingSetup from "./MeetingSetup";

const Meeting = (props) => {
    const{participant,participants,id} = props;
    console.log("meeting",participant,participants,id);
  const [isSetup, setIsSetup] = useState(false);
  console.log("isSetup", isSetup);

  return (
    <main className="">
        {isSetup ? <MeetingRoom  participant={participant} participants={participants} id={id} /> : <MeetingSetup setIsSetup={setIsSetup} />}
    </main>     
  )
}
export default Meeting
