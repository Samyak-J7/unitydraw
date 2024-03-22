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
  const completed = () => {
    setActive(Tools[1]);    
  }
  useEffect(() => {
    if (active.name === "Paintbrush" ) {
      active.action(props.editor, props.color, props.stroke, props.bgColor );
    }
  }, [props.color,props.stroke, props.bgColor]);

  const handleclick = (tool) => {
    tool.action.name === "paintBrush" ? props.handleDrawing(true) : props.handleDrawing(false);
    tool.action.name === "openFilePicker"
      ? tool.action(fileInputRef)
      : tool.action(props.editor, props.color, props.stroke, props.bgColor,completed );
    setActive(tool);    
  };

 

  return (
    <div className="flex flex-col  absolute top-10 left-0 z-10 bg-white border-2  border-gray-200 py-2  shadow-[0_10px_25px_rgba(8,_132,_184,_0.3)]  mx-4 rounded-2xl  ">
      {Tools.map((tool, index) => {
        return (
          <TooltipProvider key={index} delayDuration={100}>
            <Tooltip >
              <TooltipTrigger asChild>
                <button className={`hover:bg-blue-100 p-3 m-1 rounded-xl  ${ active.name === tool.name  ? "bg-blue-300":"bg-transparent"} `} key={index} onClick={() => handleclick(tool)}>
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
        onChange={(e) => handleFileChange(e, props.editor,completed)}
      />
    </div>
  );
};

export default Tray;
