"use client";
import React from "react";
import { Button } from "./ui/button";
const Settings = (props) => {
  const handleColorChange = (event) => {
    props.oncolor(event.target.value);
  };
  const handleStrokeChange = (event) => {
    props.onstroke(parseInt(event.target.value));
  };
  const handlebgColorChange = (event) => {
    props.onbgColor(event.target.value);
  };
  const setTransparent = () => {
    props.onbgColor("transparent");
  };
  const handleOpacityChange = (event) => {
    props.onOpacity(event.target.value);
  };
  return (
    // TODO: Implement styling for the settings panel
    <div className="absolute right-0 m-4 rounded-xl p-4 shadow-2xl top-32 flex flex-col border-2 border-slate-200  bg-slate-100 z-10">
      Stroke{" "}
      <input
        className="bg-transparent w-[20%]"
        value={props.color !== null ? props.color : "#000000"}
        type="color"
        onChange={handleColorChange}
      />
      Fill{" "}
      <input
        className=" bg-transparent w-[20%]"
        value={props.bgColor !== null ? props.bgColor : "transparent"}
        type="color"
        onChange={handlebgColorChange}
      />
      <Button onClick={setTransparent}>Transparent</Button>
      Stoke Width{" "}
      <input
        className="w-[90%]"
        type="range"
        value={props.stroke !== null ? props.stroke : 1}
        min="1"
        max="10"
        onChange={handleStrokeChange}
      />
      Opacity{" "}
      <input
        className="w-[90%]"
        type="range"
        value={props.opacity !== null ? props.opacity : 1}
        min="0"
        max="1"
        step="0.1"
        onChange={handleOpacityChange}
      />
    </div>
  );
};

export default Settings;
