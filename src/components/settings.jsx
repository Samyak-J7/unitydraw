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

  return (
    <div>
      <input type="color" onChange={handleColorChange} />
      <input type="range" min="1" max="10" onChange={handleStrokeChange} />
      <input type="color" onChange={handlebgColorChange} />
    </div>
  );
};

export default Settings;
