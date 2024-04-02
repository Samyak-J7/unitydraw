"use client";
import React from "react";
import { Button } from "./ui/button";

const Settings = (props) => {
  const {color, stroke, fill, opacity } = props.properties;


  const propertyChange = (e, property) => {
    props.onPropertyChange(property,e.target.value);
  }
  return (
    // TODO: Implement styling for the settings panel
    <div className="absolute right-0 m-4 rounded-xl p-4 shadow-2xl top-32 flex flex-col border-2 border-slate-200  bg-slate-100 z-10">
      Stroke{" "}
      <input
        className="bg-transparent w-[20%]"
        value={color !== null ? color : "#000000"}
        type="color"
        onChange={(e) => propertyChange(e, "stroke")}
      />
      Fill{" "}
      <input
        className=" bg-transparent w-[20%]"
        value={fill !== null ? fill : "transparent"}
        type="color"
        onChange={(e) => propertyChange(e, "fill")}
      />
      <Button onClick={(e) => propertyChange(e, "transparent")}>Transparent</Button>
      Stoke Width{" "}
      <input
        className="w-[90%]"
        type="range"
        value={stroke !== null ? stroke : 1}
        min="1"
        max="10"
        onChange={(e) => propertyChange(e, "strokeWidth")}
      />
      Opacity{" "}
      <input
        className="w-[90%]"
        type="range"
        value={opacity !== null ? opacity : 1}
        min="0"
        max="1"
        step="0.1"
        onChange={(e) => propertyChange(e, "opacity")}
      />
    </div>
  );
};

export default Settings;
