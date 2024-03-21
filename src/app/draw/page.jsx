"use client";
import React, { useEffect, useState, useRef } from "react";
import { FabricJSCanvas } from "fabricjs-react";
import Tray from "@/components/tray";
import Settings from "@/components/settings";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
const Draw = () => {
  const [editor, setEditor] = useState(null);
  const [color, setColor] = useState("#000000" /* black */);
  const [stroke, setStroke] = useState(5);
  const [bgColor, setBgColor] = useState("transparent" /* white */);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [opacity, setOpacity] = useState(1);
  useEffect(() => {
    if (editor) {
      // Add event listener for object selection
      editor.canvas.on("selection:created", handleObjectSelection);
      editor.canvas.on("selection:updated", handleObjectSelection);
      editor.canvas.on("selection:cleared", clearSelection);

      // Add keyboard event listener for backspace key
      const handleKeyPress = (event) => {
        if (
          (event.code === "Backspace" || event.code === "Delete") &&
          selectedObjects.length > 0
        ) {
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

  const onOpacityChange = (newOpacity) => {
    setOpacity(newOpacity);
    selectedObjects.forEach((obj) => {
      obj.set("opacity", newOpacity);
    });
    editor.canvas.renderAll();
  }

  return (
    <div>
      <Tray editor={editor} color={color} stroke={stroke} bgColor={bgColor} opacity={opacity} />
      <div className="flex  bg-slate-100 gap-2 absolute bottom-0 z-10 m-4 items-center border-gray-300 rounded-lg border-2 shadow-2xl ">
        <button onClick={zoomIn} className="hover:bg-gray-300 p-4 rounded-md">
          <ZoomIn />
        </button>
        <p className=" font-semibold text-md">
          {!isNaN((editor?.canvas.getZoom() * 100) / 1)
            ? Math.trunc((editor?.canvas.getZoom() * 100) / 1)+'%'
            : '100%'}
        </p>
        <button onClick={zoomOut} className="hover:bg-gray-300 p-4 rounded-md">
          <ZoomOut />
        </button>
      </div>
      {selectedObjects.length>0 && (
        <Settings
        oncolor={onColorChange}
        onstroke={onStrokeChange}
        onbgColor={onBgColorChange}
        onOpacity={onOpacityChange}
      />
      )}
      
      <FabricJSCanvas
        className="h-[100vh] bg-gray-100"
        onReady={(canvas) => setEditor({ canvas })}
      />
    </div>
  );
};

export default Draw;
