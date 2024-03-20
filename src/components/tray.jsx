import React from "react";
import { Tools } from "../constants";

const Tray = (props) => {
  return (
    <div>
      {Tools.map((tool, index) => {
        return (
          <button  key={index} onClick={() => tool.action(props.editor)}>
             {tool.icon}
          </button>
        );
      })}
    </div>
  );
};

export default Tray;
