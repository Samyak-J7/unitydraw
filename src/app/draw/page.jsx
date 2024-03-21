"use client";
import React, { useEffect, useState } from "react";
import { FabricJSCanvas } from "fabricjs-react";
import Tray from "@/components/tray";
import Settings from "@/components/settings";
import { ZoomIn, ZoomOut } from "lucide-react";

const Draw = () => {
  const [editor, setEditor] = useState(null);
  const [color, setColor] = useState("#000000" /* black */);
  const [stroke, setStroke] = useState(5);
  const [bgColor, setBgColor] = useState("transparent" /* white */);
  const [selectedObject, setSelectedObject] = useState(null);
  const [zoom, setZoom] = useState(1);
  const handleObjectSelection = () => {
    const activeObject = editor?.canvas?.getActiveObject();
    setSelectedObject(activeObject);
  };

  const clearSelection = () => {
    setSelectedObject(null);
  };

  useEffect(() => {
    if (editor) {
     
      // Add event listener for object selection
      editor.canvas.on("selection:created", handleObjectSelection);
      editor.canvas.on("selection:updated", handleObjectSelection);
      editor.canvas.on("selection:cleared", clearSelection);

      return () => {
        // Cleanup: remove event listeners
        editor.canvas.off("selection:created", handleObjectSelection);
        editor.canvas.off("selection:updated", handleObjectSelection);
        editor.canvas.off("selection:cleared", clearSelection);
      };
    }
  }, [editor]);

  const onColorChange = (newColor) => {
    setColor(newColor);
    if (selectedObject) {
      selectedObject.set("stroke", newColor);
      editor.canvas.renderAll(); // Render canvas to see the changes
    }
  };

  const onStrokeChange = (newStroke) => {
    setStroke(newStroke);
    if (selectedObject) {
      selectedObject.set("strokeWidth", newStroke);
      editor.canvas.renderAll(); // Render canvas to see the changes
    }
  };

  const onbgColor = (newBgColor) => {
    setBgColor(newBgColor);
    if (selectedObject) {
      selectedObject.set("fill", newBgColor);
      editor.canvas.renderAll(); // Render canvas to see the changes
    }
    
  }

  const zoomIn = () => {
    setZoom((prevZoom) => prevZoom + 0.1);
    editor.canvas.setZoom(editor.canvas.getZoom() + 0.1);
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.1));
    editor.canvas.setZoom(editor.canvas.getZoom() - 0.1);
  };  

  return (
    <div>
      <Tray editor={editor} color={color} stroke={stroke} bgColor={bgColor} />
      <button onClick={zoomIn}><ZoomIn/></button>
      <button onClick={zoomOut}><ZoomOut/></button>
      <Settings oncolor={onColorChange} onstroke={onStrokeChange} onbgColor={onbgColor} />
      <FabricJSCanvas
        className="h-[80vh] border-2 border-indigo-600"
        onReady={(canvas) => setEditor({ canvas })}
      />
    </div>
  );
};

export default Draw;
