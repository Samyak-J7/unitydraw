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
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (editor) {
      // Add event listener for object selection
      editor.canvas.on("selection:created", handleObjectSelection);
      editor.canvas.on("selection:updated", handleObjectSelection);
      editor.canvas.on("selection:cleared", clearSelection);

      // Add keyboard event listener for backspace key
      const handleKeyPress = (event) => {
        if (event.code === "Backspace" && selectedObjects.length > 0) {
          selectedObjects.forEach((obj) => editor.canvas.remove(obj));
          setSelectedObjects([]);
          editor.canvas.renderAll();
        }
      };

      window.addEventListener("keydown", handleKeyPress);

      return () => {
        // Cleanup: remove event listeners
        editor.canvas.off("selection:created", handleObjectSelection);
        editor.canvas.off("selection:updated", handleObjectSelection);
        editor.canvas.off("selection:cleared", clearSelection);
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [editor, selectedObjects]);

  const handleObjectSelection = () => {
    const activeObjects = editor?.canvas?.getActiveObjects() || [];
    setSelectedObjects(activeObjects);
  };

  const clearSelection = () => {
    setSelectedObjects([]);
  };

  const onColorChange = (newColor) => {
    setColor(newColor);
    selectedObjects.forEach((obj) => {
      obj.set("stroke", newColor);
    });
    editor.canvas.renderAll();
  };

  const onStrokeChange = (newStroke) => {
    setStroke(newStroke);
    selectedObjects.forEach((obj) => {
      obj.set("strokeWidth", newStroke);
    });
    editor.canvas.renderAll();
  };

  const onBgColorChange = (newBgColor) => {
    setBgColor(newBgColor);
    selectedObjects.forEach((obj) => {
      obj.set("fill", newBgColor);
    });
    editor.canvas.renderAll();
  };

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
      <button onClick={zoomIn}>
        <ZoomIn />
      </button>
      <button onClick={zoomOut}>
        <ZoomOut />
      </button>
      <Settings
        oncolor={onColorChange}
        onstroke={onStrokeChange}
        onbgColor={onBgColorChange}
      />
      <FabricJSCanvas
        className="h-[80vh] border-2 border-indigo-600"
        onReady={(canvas) => setEditor({ canvas })}
      />
    </div>
  );
};

export default Draw;
