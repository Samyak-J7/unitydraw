import React from "react";
import { Tools } from "../constants";
import { useEffect, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { handleFileChange } from "@/constants/actions";

const Tray = (props) => {
  const {color, stroke, fill } = props.properties;
  const socket = props.socket;
  const fileInputRef = useRef(null);
  const [active, setActive] = React.useState(Tools[1]);
  const completed = () => {
    setActive(Tools[1]);
  };

  const sendImage = (obj) => {
    if (!socket) return;
    socket.emit("realtimeObject",JSON.stringify([{ ...obj.toObject(), id: obj.id, }]),props.roomId)}

  const handleEraseObject = (obj) => {
      if (!socket) return;
      socket.emit("deleteObject", obj, props.roomId);    
  }

  useEffect(() => {
    if (active.name === "Paintbrush") {
      active.action(
        props.editor,
        color,
        stroke,
        fill,
        completed,
        props.isDrawing
      );
    }
  }, [color, stroke, fill]);

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleclick = (tool) => {
    tool.name === "Paintbrush"
      ? props.handleDrawing(true)
      : props.handleDrawing(false);
    tool.action === "openFilePicker"
      ? openFilePicker()
      : tool.name === "Paintbrush"
      ? tool.action(
          props.editor,
          color,
          stroke,
          fill,
          completed,
          props.isDrawing
        )
      : tool.action(
          props.editor,
          completed,
          props.isDrawing,
          handleEraseObject
        );
    setActive(tool);
  };
  return (
    <div className="flex flex-col z-10  bg-white border-2  border-zinc-200 py-2  shadow-[0_10px_25px_rgba(8,_132,_184,_0.3)]   rounded-2xl  ">
      {Tools.map((tool, index) => {
        return (
          <TooltipProvider key={index} delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  name={tool.name}
                  className={`hover:bg-gray-200 py-3 px-2 m-1 rounded-xl flex justify-center items-end gap-1 ${
                    active.name === tool.name ? "bg-gray-300" : "bg-transparent"
                  } `}
                  key={index}
                  onClick={() => handleclick(tool)}>
                  {tool.icon}{" "}
                  <span className="text-xs text-slate-500 ">
                    {index < 9 ? index + 1 : 0}
                  </span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p key={index}>{tool.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) =>
          handleFileChange(e, props.editor, completed, sendImage)
        }
      />
    </div>
  );
};

export default Tray;
