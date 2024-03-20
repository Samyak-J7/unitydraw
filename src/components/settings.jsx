"use client";
import React from "react";
import { useState } from "react";

export const colorState = React.createContext();

const Settings = () => {
  const [color, setColor] = useState("#000000");

  const handleColorChange = (event) => {
    setColor(event.target.value);
  }

  return (
    <div>
      <input type="color" value={color} onChange={handleColorChange} />
    </div>
  );
};

export default Settings;
