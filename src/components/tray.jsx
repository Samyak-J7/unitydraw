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
  const fileInputRef = useRef(null);
  const [active, setActive] = React.useState(Tools[1]);

  useEffect(() => {
    if (props.editor) {
      active.action(props.editor, props.color, props.stroke, props.bgColor);
    }
  }, [props.color]);

  const handleclick = (tool) => {
    tool.action.name === "openFilePicker"
      ? tool.action(fileInputRef)
      : tool.action(props.editor, props.color, props.stroke, props.bgColor);
    setActive(tool);
  };

  return (
    <div className="flex flex-col absolute top-40 left-0 z-10 bg-white border-2  shadow-[0_10px_25px_rgba(8,_132,_184,_0.3)]  mx-3 rounded-xl  ">
      {Tools.map((tool, index) => {
        return (
          <TooltipProvider delayDuration={100}>
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <button className={`hover:bg-blue-200 p-2 rounded-md  ${ active.name === tool.name  ? "bg-blue-300":"bg-transparent"} `} key={index} onClick={() => handleclick(tool)}>
                  {tool.icon}
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
        onChange={(e) => handleFileChange(e, props.editor)}
      />
    </div>
  );
};

export default Tray;
