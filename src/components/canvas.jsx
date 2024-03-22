"use client";
import { FabricJSCanvas } from "fabricjs-react";
import { ZoomIn, ZoomOut } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import Tray from "./tray";
import Settings from "./settings";

const Canvas = () => {
    const [editor, setEditor] = useState(null);
    const [color, setColor] = useState("#000000" /* black */);
    const [stroke, setStroke] = useState(1);
    const [bgColor, setBgColor] = useState("transparent" /* white */);
    const [selectedObjects, setSelectedObjects] = useState([]);
    const [zoom, setZoom] = useState(1);
    const [opacity, setOpacity] = useState(1);
    const [isPainting, setIsPainting] = useState(false);
    

    useEffect(() => {
      const savedCanvasState = localStorage.getItem('canvasState');
      if (editor && savedCanvasState) {
        const json = JSON.parse(savedCanvasState);
        editor.canvas.loadFromJSON(json, () => {
          editor.canvas.renderAll();
        });
      }
    }, [editor]);
  
  
    useEffect(() => {
      if (editor) {
        const json = JSON.stringify(editor.canvas.toJSON());
        localStorage.setItem('canvasState', json);
      }
    },[selectedObjects , isPainting, color, stroke, bgColor,opacity]);
  
  
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
    
        // Get color of the first selected object, assuming all selected objects have the same color
        if (activeObjects.length > 0) {
          const color = activeObjects[0].get("stroke");
          const stroke = activeObjects[0].get("strokeWidth");
          const bgColor = activeObjects[0].get("fill");
          const opacity = activeObjects[0].get("opacity");
          setColor(color);
          setStroke(stroke);
          setBgColor(bgColor);
          setOpacity(opacity);
        }
      };
    
      const clearSelection = () => {
        setSelectedObjects([]);
      };
    
      const handleDrawing = (val) => {
        setIsPainting(val);
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
      };
    
      return (
        <div>
          <Tray
            editor={editor}
            color={color}
            stroke={stroke}
            bgColor={bgColor}
            opacity={opacity}
            handleDrawing={handleDrawing}
          />
          <div className="flex  bg-slate-100 gap-2 absolute bottom-0 z-10 m-4 items-center border-gray-300 rounded-lg border-2 shadow-2xl ">
            <button onClick={zoomIn} className="hover:bg-gray-300 p-4 rounded-md">
              <ZoomIn />
            </button>
            <p className=" font-semibold text-md">
              {!isNaN((editor?.canvas.getZoom() * 100) / 1)
                ? Math.trunc((editor?.canvas.getZoom() * 100) / 1) + "%"
                : "100%"}
            </p>
            <button onClick={zoomOut} className="hover:bg-gray-300 p-4 rounded-md">
              <ZoomOut />
            </button>
          </div>
          {selectedObjects.length > 0 || isPainting ? (
            <Settings
              color={color}
              stroke={stroke}
              bgColor={bgColor}
              opacity={opacity}
              oncolor={onColorChange}
              onstroke={onStrokeChange}
              onbgColor={onBgColorChange}
              onOpacity={onOpacityChange}
            />
          ) : null}
    
          <FabricJSCanvas
            className="h-[100vh] bg-gray-100"
            onReady={(canvas) => setEditor({ canvas })}

          />
          
        </div>
      );
    };

export default Canvas