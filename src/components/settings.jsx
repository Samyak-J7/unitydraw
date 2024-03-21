"use client";
import React from "react";
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
  const handleOpacityChange = (event) => {
    props.onOpacity(event.target.value);
  };

  return (
    // TODO: Implement styling for the settings panel
    <div className="absolute right-0 m-4 rounded-xl p-4 shadow-2xl top-32 flex flex-col border-2 border-slate-200  bg-slate-100 z-10">
      Stroke <input className="bg-transparent w-[20%]" type="color" onChange={handleColorChange} />
      Fill <input className=" bg-transparent w-[20%]" type="color" onChange={handlebgColorChange} />
      Stoke Width <input className="w-[90%]" type="range" min="1" max="10" onChange={handleStrokeChange} />
      Opacity <input className="w-[90%]" type="range" min="0" max="1" step="0.1" onChange={handleOpacityChange} />
      

    </div>
  );
};

export default Settings;
