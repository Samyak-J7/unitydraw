"use client";
import React from "react";

const Settings = (props) => {
  const handleColorChange = (event) => {
    props.onselect(event.target.value);
  }

  return (
    <div>
      <input type="color" onChange={handleColorChange} />
    </div>
  );
};

export default Settings;
