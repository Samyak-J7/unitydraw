"use client";
import React, { useEffect } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import Tray from "@/components/tray";
import Settings from "@/components/settings";
import { useState } from "react";
const Draw = () => {
  const { editor, onReady } = useFabricJSEditor();
  const [color, setColor] = useState("#000000" /* black */);
  const [stroke, setStroke] = useState(1);
  const oncolor = (c) => {
    setColor(c);
  }
  const onstroke = (s) => {
    setStroke(s);
  }
  return (
    <div>
      <Tray editor={editor} color={color} stroke={stroke} />
      <Settings oncolor={oncolor} onstroke={onstroke} />
      <FabricJSCanvas className="h-[80vh] border-2 border-indigo-600" onReady={onReady} />
    </div>
  );
};

export default Draw;
