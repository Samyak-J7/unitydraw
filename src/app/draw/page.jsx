"use client";
import React from "react";
import { useState, useEffect } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import Tray from "@/components/tray";

const Draw = () => {
  const { editor, onReady } = useFabricJSEditor(); // Get the editor instance

  const [isDrawing, setIsDrawing] = useState(false); // State to toggle drawing mode

  useEffect(() => {
    if (!editor) return;

    const canvas = editor.canvas;
    canvas.isDrawingMode = isDrawing;
    canvas.freeDrawingBrush.width = 5; // Adjust brush width as needed
    canvas.freeDrawingBrush.color = "black"; // Adjust brush color as needed
  }, [editor, isDrawing]);

  const handleMouseDown = () => {
    setIsDrawing(true);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };
  return (
    <div className="h-screen">
      <Tray editor={editor}/>
      <button onClick={() => setIsDrawing(!isDrawing)}>
        Toggle Paintbrush
      </button>
      <FabricJSCanvas 
        className="h-screen"
        onReady={onReady}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      /> 
    </div>
  );
};

export default Draw;
