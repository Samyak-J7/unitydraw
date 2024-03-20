"use client";
import React from "react";
import { useState, useEffect } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

const Draw = () => {
  const { editor, onReady } = useFabricJSEditor(); // Get the editor instance
  const onAddCircle = () => {
    editor?.addCircle(); 
  };
  const onAddRectangle = () => {
    editor?.addRectangle();
  };
  const onAddText = () => {
    editor?.addText("Text here");
  };

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
      <button onClick={onAddCircle}>Add circle</button>
      <button onClick={onAddRectangle}>Add Rectangle</button>
      <button onClick={onAddText}>Add Text</button>
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
