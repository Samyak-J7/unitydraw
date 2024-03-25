"use client";
import { FabricJSCanvas } from "fabricjs-react";
import { ZoomIn, ZoomOut } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import Tray from "./tray";
import Settings from "./settings";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useAuth, useUser } from "@clerk/nextjs";

const Canvas = (props) => {
  const [editor, setEditor] = useState(null);
  const [color, setColor] = useState("#000000" /* black */);
  const [stroke, setStroke] = useState(1);
  const [bgColor, setBgColor] = useState("transparent" /* white */);
  const [selectedObjects, setSelectedObjects] = useState([]);
  const [zoom, setZoom] = useState(1);
  const [opacity, setOpacity] = useState(1);
  const [isPainting, setIsPainting] = useState(false);
  const [Drawing, setDrawing] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [realtimeObject, setRealtimeObject] = useState(null);
  const [update, setUpdate] = useState(false);
  const [enableConnection, setEnableConnection] = useState(
    props.roomId ? true : false
  );
  const { userId } = useAuth();
  //set socket connection and emit cursor and realtime object

  useEffect(() => {
    if (!enableConnection) return;
    try {
      const socket = io("http://localhost:4001");
      socket.emit("joinRoom", props.roomId, userId);
      socket.on("userJoined", (data) => {
        console.log("User joined:", data);
      });
      const handleMouseMove = (event) => {
        const { clientX: x, clientY: y } = event;
        setCursorPosition({ x, y });
        socket.emit("cursor", { x, y }, props.roomId);

        const activeObjects = editor?.canvas?.getActiveObjects() || [];
        if (activeObjects.length > 0) {
          const activeObjectsData = activeObjects.map((obj) => {
            return {
              ...obj.toObject(), // Convert Fabric.js object to plain JavaScript object
              id: obj.id, // Include the id property
            };
          });

          socket.emit(
            "realtimeObject",
            JSON.stringify(activeObjectsData),
            props.roomId
          );
        }
      };

      document.addEventListener("mousemove", handleMouseMove);

      socket.on("cursor", (data) => {
        setCursorPosition(data);
      });

      // to receive realtime object from other clients
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
              obj = new fabric.Path(`${objData.path}`, { ...objData });
              break;
            case "line":
              obj = new fabric.Line(
                [objData.x1, objData.y1, objData.x2, objData.y2],
                { ...objData }
              );
              break;
            case "textbox":
              obj = new fabric.Textbox(objData.text, { ...objData });
              break;
            default:
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
    } catch (error) {
      console.log(" Error in setting up socket connection");
    }
  }, [editor]);

  const isDrawing = (val) => {
    setDrawing(val);
  };

  useEffect(() => {
    if (!enableConnection) return;
    const socket = io("http://localhost:4001");
    if (isPainting && !Drawing) {
      const objects = editor?.canvas?.getObjects() || [];
      if (objects.length > 0) {
        const pathdata = objects
          .filter((obj) => obj.type === "path") // Filter only objects of type "path"
          .map((obj) => {
            obj.set({
              type: obj.type,
              path: obj.path,
              id: obj.id ? obj.id : uuidv4(),
              ...obj,
            });
            return {
              type: obj.type,
              path: obj.path,
              id: obj.id ? obj.id : uuidv4(),
              ...obj.toObject(),
            };
          });
        console.log(pathdata);
        if (pathdata.length > 0) {
          socket.emit("realtimeObject", JSON.stringify(pathdata), props.roomId);
        }
      }
    }
  }, [Drawing]);

  //update the object in the canvas
  useEffect(() => {
    let isIdMatched = false;
    if (update && editor && realtimeObject) {
      editor.canvas.getObjects().forEach((obj) => {
        realtimeObject.forEach((realtimeObject) => {
          if (realtimeObject.id === obj.id) {
            isIdMatched = true;
            switch (realtimeObject.type) {
              case "line":
                obj.set({
                  x1: realtimeObject.x1,
                  y1: realtimeObject.y1,
                  x2: realtimeObject.x2,
                  y2: realtimeObject.y2,
                  ...realtimeObject,
                });
                break;
              case "path":
                obj.set({ path: obj.path, ...realtimeObject });
                break;
              case "textbox":
                obj.set({ text: realtimeObject.text, ...realtimeObject });
                break;
              default:
                obj.set({ ...realtimeObject });
                break;
            }
            obj.setCoords(); // Update object coordinates
            editor.canvas.renderAll();
          } else {
            isIdMatched = false;
          }
        });
      });

      // Add new object to the canvas if id is not matched
      if (!isIdMatched) {
        if (realtimeObject[0].type === "path" && realtimeObject.length > 0) {
          console.log(realtimeObject);
          let newObject = realtimeObject[realtimeObject.length - 1];
          newObject.id = realtimeObject[realtimeObject.length - 1].id;
          editor.canvas.add(newObject);
        } else {
          let newObject = realtimeObject[0];
          newObject.id = realtimeObject[0].id;
          if (
            !editor.canvas.getObjects().some((obj) => obj.id === newObject.id)
          ) {
            editor.canvas.add(newObject);
          }
        }
      }
    }
  }, [update, editor, realtimeObject]);

  //load the canvas state from local storage
  // useEffect(() => {
  //   const savedCanvasState = localStorage.getItem("canvasState");
  //   if (editor && savedCanvasState) {
  //     const json = JSON.parse(savedCanvasState);
  //     editor.canvas.loadFromJSON(json, () => {
  //       editor.canvas.renderAll();
  //     });
  //   }
  // }, [editor]);

  // //save the canvas state to local storage
  // useEffect(() => {
  //   if (editor) {
  //     const json = JSON.stringify(editor.canvas.toJSON());
  //     localStorage.setItem("canvasState", json);
  //   }
  // }, [selectedObjects, isPainting, color, stroke, bgColor, opacity]);

  //add event listener for keyboard events
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

  //handle object selection
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
        isDrawing={isDrawing}
      />
      <div className="flex  bg-slate-100 gap-2 absolute right-0 bottom-0 z-10 m-4 items-center border-gray-300 rounded-lg border-2 shadow-2xl ">
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
