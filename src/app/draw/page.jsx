"use client";
import React, { useEffect, useState, useRef } from "react";
import { FabricJSCanvas } from "fabricjs-react";
import Tray from "@/components/tray";
import Settings from "@/components/settings";
import { Image, ZoomIn, ZoomOut } from "lucide-react";

const Draw = () => {
  const [editor, setEditor] = useState(null);
  const [color, setColor] = useState("#000000" /* black */);
  const [stroke, setStroke] = useState(5);
  const [bgColor, setBgColor] = useState("transparent" /* white */);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [zoom, setZoom] = useState(1);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editor) {
      // Add event listener for object selection
      editor.canvas.on("selection:created", handleObjectSelection);
      editor.canvas.on("selection:updated", handleObjectSelection);
      editor.canvas.on("selection:cleared", clearSelection);

      // Add keyboard event listener for backspace key
      const handleKeyPress = (event) => {
        if ((event.code === "Backspace" || event.code === "Delete") && selectedObjects.length > 0) {
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      fabric.Image.fromURL(imageUrl, (img) => {
        editor.canvas.add(img);
      });
    };
    reader.readAsDataURL(file);
  };

  const openFilePicker = () => {
    fileInputRef.current.click();
  };

  return (
    <div>
      <Tray editor={editor} color={color} stroke={stroke} bgColor={bgColor} />
      <div className="flex gap-2 absolute bottom-0 left-50 z-10 bg-red-500">
        <button onClick={zoomIn}>
        <ZoomIn />
      </button>
      <button onClick={zoomOut}>
        <ZoomOut />
      </button>
      <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button onClick={openFilePicker}><Image /></button>
      </div>
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
