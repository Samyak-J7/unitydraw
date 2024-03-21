import React from "react";
import { Tools } from "../constants";
import { useEffect, useRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const Tray = (props) => {
  const [active, setActive] = React.useState(null);
  useEffect(() => {
    if (props.editor) {
      active.action(props.editor, props.color, props.stroke, props.bgColor);
    }
  }, [props.color]);
  return (
    <div className="flex flex-col gap-2 absolute top-40 left-0 z-10 bg-red-500  ">
      {Tools.map((tool, index) => {
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  key={index}
                  onClick={() => {
                    tool.action(
                      props.editor,
                      props.color,
                      props.stroke,
                      props.bgColor
                    );
                    setActive(tool);
                  }}
                >
                  {tool.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent side='right'>
                <p>{tool.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      })}
    </div>
  );
};

export default Tray;
