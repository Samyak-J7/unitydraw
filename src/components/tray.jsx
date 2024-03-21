import React from "react";
import { Tools } from "../constants";
import { useEffect , useRef } from "react";
const Tray = (props) => {
  const [active , setActive] = React.useState(null);
  useEffect(() => {
    if (props.editor) {
      active.action(props.editor, props.color , props.stroke , props.bgColor);
    }   
  }, [props.color]);
  return (
    <div>
      {Tools.map((tool, index) => {
        return (
          <button key={index} onClick={() => { 
            tool.action(props.editor, props.color , props.stroke , props.bgColor);
            setActive(tool); 
          }}>
            {tool.icon}
          </button>
        );
      })}
    </div>
  );
};

export default Tray;
