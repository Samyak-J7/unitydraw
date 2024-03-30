"use client";
import { FabricJSCanvas } from "fabricjs-react";
import { ZoomIn, ZoomOut } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import Tray from "./tray";
import Settings from "./settings";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@clerk/nextjs";
import { handleKeyPress } from "@/helper";
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
  const [cursorPositions, setCursorPositions] = useState({});
  const [realtimeObject, setRealtimeObject] = useState(null);
  const [update, setUpdate] = useState(false);
  const { userId } = useAuth();
  const [socket, setSocket] = useState(null);
  // IF ROOM ID RECEIVED SET CONNECTION TRUE TO ESTABLISH WEBSOCKETS otherwise false and just load canvas skip websockets as single user
  const [enableConnection, setEnableConnection] = useState(
    props.roomId ? true : false
  );

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00']; // Sample colors

  function getColorForUser(userId) {
  const index = parseInt(userId.slice(-1), 16) % colors.length; // Use last character of ID for color index
  return colors[index];
  }



  useEffect(() => {
    if (!enableConnection) return;
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
      reconnectionAttempts: 3,
      reconnectionDelay: 3000,
    });
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (editor && props.data) {
      editor.canvas.loadFromJSON(props.data, () => {
        editor.canvas.renderAll();
      });
    }
    if (!enableConnection) return; // no room id that means single user so load normal canvas
    try {
      if (!socket) return;
      // attach listener event for joining
      socket.on("userJoined", (data) => {
        console.log("You joined:", data);
      });

      // attach listener event for joining
      socket.on("roomJoined", (data) => {
        console.log("User joined:", data);
        // toast to notify everyone that a user joined
      });

      // join room is the fist task
      socket.emit("joinRoom", props.roomId, userId);

      const handleMouseMove = (event) => {
        const { clientX: x, clientY: y } = event;
  socket.emit("cursor", { x, y, userId: userId }, props.roomId , userId);

        const activeObjects = editor?.canvas?.getActiveObjects() || [];
        if (activeObjects.length > 0) {
          const activeObjectsData = activeObjects.map((obj) => {
            return {
              ...obj.toObject(),
              id: obj.id,
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
        setCursorPositions(prevPositions => ({
          ...prevPositions,
          [data.userId]: { x: data.x, y: data.y , userId: data.userId}
        }));
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
      console.log("Error , Something went wrong");
      // connection with server failed redirect to draw toast try again later server error
    }
  }, [editor]);

  const isDrawing = (val) => {
    setDrawing(val);
  };

  //send paintbrush realtime data
  useEffect(() => {
    if (!enableConnection || !isPainting || Drawing) return;
    const objects = editor?.canvas?.getObjects() || [];
    if (objects.length > 0) {
      const pathdata = objects
        .filter((obj) => obj.type === "path") // Filter only objects of type "path"
        .map((obj) => {
          obj.set({
            type: obj.type,
            path: obj.path,
            id: obj.id ? obj.id : uuidv4(), //setting necessary things for object
            ...obj,
          });
          return {
            type: obj.type,
            path: obj.path,
            id: obj.id ? obj.id : uuidv4(), //returning object
            ...obj.toObject(),
          };
        });
      if (pathdata.length > 0) {
        socket.emit("realtimeObject", JSON.stringify(pathdata), props.roomId);
      }
    }
  }, [Drawing]);

  //update the object in the canvas if realtime objects changes
  useEffect(() => {
    if (update && editor && realtimeObject) {
      editor.canvas.getObjects().forEach((obj) => {
        //check over every object in canvas
        realtimeObject.forEach((realtimeObject) => {
          //check over every object in realtime object mostlly one object but can be multiple
          if (realtimeObject.id === obj.id) {
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
          }
        });
      });
      // Add new object to the canvas if id is not matched
      if (realtimeObject.length > 0) {
        let newObject = realtimeObject[0];
        if (newObject.type === "path") {
          // If it's a path, take the last path object from the real-time data becasue we are receiving all the path objects when drawn
          newObject = realtimeObject[realtimeObject.length - 1];
        }
        // Check if the object with the same ID exists in the canvas
        const isExistingObject = editor.canvas
          .getObjects()
          .some((obj) => obj.id === newObject.id);
        // If the object doesn't exist in the canvas, add it
        if (!isExistingObject) {
          editor.canvas.add(newObject);
        }
      }
    }
  }, [update, editor, realtimeObject]);

  //save the canvas state to local storage
  useEffect(() => {
    if (editor) {
      editor.canvas.getObjects().map((obj) => {
        if (!obj.id) {
          obj.id = uuidv4();
        }
      });
      const customToJSON = (canvas) => {
        return JSON.stringify(canvas.toJSON(["id"]));
      };

      const json = customToJSON(editor.canvas);
      localStorage.setItem("canvasState", json);
    }
  }, [editor, selectedObjects, Drawing, color, stroke, bgColor, opacity]);

  //add event listener for keyboard events
  useEffect(() => {
    if (editor) {
      editor.canvas.on("selection:created", handleObjectSelection);
      editor.canvas.on("selection:updated", handleObjectSelection);
      editor.canvas.on("selection:cleared", clearSelection);

      // Add keyboard event listener for backspace key

      const deleteObject = (event) => {
        if (event.code === "Backspace" || event.code === "Delete") {
          selectedObjects.filter((obj) => obj.type !== "textbox").forEach((obj) => editor.canvas.remove(obj));
          setSelectedObjects([]);
          editor.canvas.renderAll();
        }
      };
      window.addEventListener("keydown", handleKeyPress);
      window.addEventListener("keydown", deleteObject);
      return () => {
        // Cleanup: remove event listeners
        editor.canvas.off("selection:created", handleObjectSelection);
        editor.canvas.off("selection:updated", handleObjectSelection);
        editor.canvas.off("selection:cleared", clearSelection);
        window.removeEventListener("keydown", handleKeyPress);
        window.removeEventListener("keydown", deleteObject);
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
      {Object.values(cursorPositions).map(({ x, y, userId }) => (
      <div
        key={userId}
        style={{
          position: "absolute",
          left: x,
          top: y,
          width: 20,
          height: 20,
          backgroundColor: getColorForUser(userId),
          borderRadius: "50%"
        }}
      ></div>
    ))}

      <Tray
        editor={editor}
        color={color}
        stroke={stroke}
        bgColor={bgColor}
        opacity={opacity}
        handleDrawing={handleDrawing}
        isDrawing={isDrawing}
      />
      <div className="flex  bg-pink-200 gap-2 absolute right-0 bottom-0 z-10 m-4 items-center hover:border-black hover:bg-pink-300 border-pink-500 rounded-lg border-2 shadow-2xl ">
        <button onClick={zoomIn} className="hover:bg-pink-400 p-4 rounded-md">
          <ZoomIn />
        </button>
        <p className=" font-semibold text-md">
          {!isNaN((editor?.canvas.getZoom() * 100) / 1)
            ? Math.trunc((editor?.canvas.getZoom() * 100) / 1) + "%"
            : "100%"}
        </p>
        <button onClick={zoomOut} className="hover:bg-pink-400 p-4 rounded-md">
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
        className="h-[100vh] bg-white"
        onReady={(canvas) => setEditor({ canvas })}
      />
    </div>
  );
};

export default Canvas;
