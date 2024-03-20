import React from "react";
import { Tools } from "../constants";

const Tray = () => {
  console.log(Tools);
  return (
    <div>
      {Tools.map((tool, index) => {
        return (
          <button key={index} onClick={tool.action}>
            {tool.name} {tool.icon}
          </button>
        );
      })}
    </div>
  );
};

export default Tray;
