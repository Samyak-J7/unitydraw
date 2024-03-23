"use client";
import { FabricJSCanvas } from "fabricjs-react";
import { ZoomIn, ZoomOut } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import Tray from "./tray";
import Settings from "./settings";
import io from "socket.io-client";

const Canvas = () => {
  const [editor, setEditor] = useState(null);
  const [color, setColor] = useState("#000000" /* black */);
  const [stroke, setStroke] = useState(1);
  const [bgColor, setBgColor] = useState("transparent" /* white */);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [isPainting, setIsPainting] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [realtimeObject, setRealtimeObject] = useState(null);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const socket = io("http://localhost:4001");

    const handleMouseMove = (event) => {
      const { clientX: x, clientY: y } = event;
      setCursorPosition({ x, y });
      socket.emit("cursor", { x, y });
      const activeObjects = editor?.canvas?.getActiveObjects() || [];
      if (activeObjects.length > 0) {
        const activeObjectsData = activeObjects.map((obj) => {
          return {
            ...obj.toObject(), // Convert Fabric.js object to plain JavaScript object
            id: obj.id, // Include the id property
          };
        });
        socket.emit("realtimeObject", JSON.stringify(activeObjectsData));
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    socket.on("cursor", (data) => {
      setCursorPosition(data);
    });

    socket.on("realtimeObject", (data) => {
      const receivedObjectsData = JSON.parse(data);
      const receivedObjects = receivedObjectsData.map((objData) => {
        let obj;
        switch (objData.type) {
          case "circle":
            obj = new fabric.Circle(objData);
            break;
          case "rect":
            obj = new fabric.Rect(objData);
            break;
          case "path":
            obj = new fabric.Path(objData);
            break;
          case "line":
            obj = new fabric.Line(objData);
            break;
          // Add more cases for other types if needed
          default:
            // Handle unknown types or throw an error
            throw new Error(`Invalid object type: ${objData.type}`);
        }
        obj.id = objData.id; // Ensure id property is set
        return obj;
      });
      setRealtimeObject(receivedObjects);
      setUpdate(true);
    });
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      socket.disconnect();
    };
  }, [editor]);

  useEffect(() => {
    let isIdMatched = false;
    if (update && editor && realtimeObject) {
      editor.canvas.getObjects().forEach((obj) => {
        if (realtimeObject[0].id === obj.id) {
          isIdMatched = true;
          // console.log(realtimeObject[0], "realtimeObject[0]")
          // console.log(obj , "obj")
          obj.set({
            left: realtimeObject[0].left,
            top: realtimeObject[0].top,
            angle: realtimeObject[0].angle,
            width: realtimeObject[0].width,
            height: realtimeObject[0].height,
            scaleX: realtimeObject[0].scaleX,
            scaleY: realtimeObject[0].scaleY,
            fill: realtimeObject[0].fill,
            backgroundColor: realtimeObject[0].backgroundColor,
            radius: realtimeObject[0].radius,
            strokeWidth: realtimeObject[0].strokeWidth,
            stroke: realtimeObject[0].stroke,
            opacity: realtimeObject[0].opacity,
            
        });

        obj.setCoords(); // Update object coordinates

          editor.canvas.renderAll();
        }
      });

      if (!isIdMatched) {
        const obj = realtimeObject[0];
        //console.log(obj)
        let newObject;
        switch (obj.type) {
          case "circle":
            newObject = new fabric.Circle(obj);
            newObject.id = obj.id;
            console.log("obj", obj);
            console.log("new ", newObject);
            break;
          case "rect":
            newObject = new fabric.Rect(obj);
            newObject.id = obj.id;
            break;
          case "path":
            newObject = new fabric.Path(obj);
            newObject.id = obj.id;
            break;
          case "line":
            newObject = new fabric.Line(obj);
            newObject.id = obj.id;
            break;
          default:
            return;
        }
        editor.canvas.add(newObject);
      }
    }
  }, [update, editor, realtimeObject]);
  useEffect(() => {
    const savedCanvasState = localStorage.getItem("canvasState");
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
      localStorage.setItem("canvasState", json);
    }
  }, [selectedObjects, isPainting, color, stroke, bgColor, opacity]);

  useEffect(() => {
    if (editor) {
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
      <div
        style={{
          position: "absolute",
          left: cursorPosition.x,
          top: cursorPosition.y,
          width: 20,
          height: 20,
          backgroundColor: "red",
          borderRadius: "50%",
        }}
      ></div>
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

export default Canvas;