"use client";
import { FabricJSCanvas } from "fabricjs-react";
import { MousePointer2, ZoomIn, ZoomOut } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import Tray from "./tray";
import Settings from "./settings";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { useAuth } from "@clerk/nextjs";
import { handleKeyPress } from "@/helper";
import { getUserById } from "@/lib/actions/user.action";
import { useToast } from "@/components/ui/use-toast";
const Canvas = (props) => {
  const [editor, setEditor] = useState(null);
  const [properties, setProperties] = useState({color: "#000000",stroke: 1,fill: "rgba(0,0,0,0)",opacity: 1,});
  const [selectedObjects, setSelectedObjects] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [isPainting, setIsPainting] = useState(false);
  const [Drawing, setDrawing] = useState(false);
  const [cursorPositions, setCursorPositions] = useState({});
  const [realtimeObject, setRealtimeObject] = useState(null);
  const [update, setUpdate] = useState(false);
  const { userId } = useAuth();
  const [socket, setSocket] = useState(null);
  const [user, setUser] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const [canvasState, setCanvasState] = useState([]); // State to store the history of the canvas
  const { toast } = useToast();
  const randomcolor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  const [enableConnection, setEnableConnection] = useState(
    props.roomId ? true : false
  );

  useEffect(() => {
    if (!userId) return;
    getUserById({ clerkId: userId })
      .then((founduser) => setUser(JSON.parse(founduser)))
      .catch((error) => {
        toast({
          duration: 2000,
          title: "Cannot find User",
          description: "Please Login or Refresh the page.",
        });
      });
  }, []);

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
        if (!user) return;
        const { clientX: x, clientY: y } = event;
        socket.emit(
          "cursor",
          { x, y, userId: user.username, randomcolor },
          props.roomId
        );

        const activeObjects = editor?.canvas?.getActiveObjects() || [];
        if (activeObjects.length > 0) {
          const activeObjectsData = activeObjects.map((obj) => {
            const newObj = { ...obj.toObject(), id: obj.id };
            if ("src" in newObj) {
              delete newObj.src;
            }
            return newObj;
          });

          socket.emit(
            "realtimeObject",
            JSON.stringify(activeObjectsData),
            props.roomId
          );
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      socket.on("deleteObject", (data) => {
        const objects = editor?.canvas?.getObjects() || [];
        if (data === "all") {
          editor.canvas.clear();
          return;
        }
        const objectToDelete = objects.find((obj) => obj.id === data);
        if (objectToDelete) {
          editor.canvas.remove(objectToDelete);
          editor.canvas.renderAll();
        }
      });
      socket.on("cursor", (data) => {
        setCursorPositions((prevPositions) => ({
          ...prevPositions,
          [data.userId]: {
            x: data.x,
            y: data.y,
            randomcolor: data.randomcolor,
            userId: data.userId,
          },
        }));
      });

      socket.on("undo", (data) => {
        editor.canvas.loadFromJSON(
          data,
          editor.canvas.renderAll.bind(editor.canvas)
        );
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
            case "image":
              return objData;
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
      };
    } catch (error) {
      console.log("Error , Something went wrong");
      // connection with server failed redirect to draw toast try again later server error
    }
  }, [editor]);

  const isDrawing = (val) => {
    setDrawing(val);
  };

  useEffect(() => {
    if (editor) {
      saveCanvasState();
    }
  }, [editor, selectedObjects, realtimeObject]);

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
              case "image":
                obj.set({
                  src: obj.src,
                  width: realtimeObject.width,
                  height: realtimeObject.height,
                  ...realtimeObject,
                });
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
          if (newObject.type === "image") {
            fabric.Image.fromURL(newObject.src, (img) => {
              img.set({ ...newObject });
              editor.canvas.add(img);
            });
          } else {
            editor.canvas.add(newObject);
          }
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
  }, [
    editor,
    selectedObjects,
    Drawing,
    properties,
    realtimeObject,
  ]);

  //add event listener for keyboard events
  useEffect(() => {
    if (editor) {
      editor.canvas.on("selection:created", handleObjectSelection);
      editor.canvas.on("selection:updated", handleObjectSelection);
      editor.canvas.on("selection:cleared", clearSelection);

      const handleKeys = (event) => {
        if (event.ctrlKey && event.key === "c") {
          copyObjects();
        } else if (event.ctrlKey && event.key === "v") {
          pasteObjects();
        } else if (event.ctrlKey && event.key === "z") {
          undo();
        } else if (event.ctrlKey && event.key === "]") {
          const activeObjects = editor?.canvas?.getActiveObject();
          if (activeObjects) {
            activeObjects.bringForward();
            editor.canvas.discardActiveObject();
            editor.canvas.requestRenderAll();
          }
        } else if (event.ctrlKey && event.key === "[") {
          const activeObjects = editor?.canvas?.getActiveObject();
          if (activeObjects) {
            activeObjects.sendBackwards();
            editor.canvas.discardActiveObject();
            editor.canvas.requestRenderAll();
          }
        } else if (event.ctrlKey && event.key === "g") {
          const activeObjects = editor?.canvas?.getActiveObject();
          if (!activeObjects) return;
          if (activeObjects?.type === "activeSelection") {
            activeObjects.toGroup();
            editor.canvas.requestRenderAll();
          }
        }
      };

      // Add keyboard event listener for backspace key
      const deleteObject = (event) => {
        if (event.code === "Backspace" || event.code === "Delete") {
          if (!selectedObjects || (selectedObjects.type === "textbox" && selectedObjects.isEditing)) return;
          if (selectedObjects.type === "activeSelection") {
            selectedObjects._objects.forEach((obj) => {
              enableConnection && socket.emit("deleteObject", obj.id, props.roomId);
              editor.canvas.remove(obj);
            });
            editor.canvas.discardActiveObject();
            setSelectedObjects(null);
            editor.canvas.renderAll();
            return;
          }
          enableConnection && socket.emit("deleteObject", selectedObjects.id, props.roomId);
          editor.canvas.remove(selectedObjects);
          editor.canvas.discardActiveObject();
          setSelectedObjects(null);
          editor.canvas.renderAll();
        } 
      };
      window.addEventListener("keydown", handleKeys);
      window.addEventListener("keydown", handleKeyPress);
      window.addEventListener("keydown", deleteObject);
      return () => {
        // Cleanup: remove event listeners
        editor.canvas.off("selection:created", handleObjectSelection);
        editor.canvas.off("selection:updated", handleObjectSelection);
        editor.canvas.off("selection:cleared", clearSelection);
        window.removeEventListener("keydown", handleKeyPress);
        window.removeEventListener("keydown", deleteObject);
        window.removeEventListener("keydown", handleKeys);
      };
    }
  }, [editor, selectedObjects]);

   //handle object selection
  const handleObjectSelection = () => {
    const activeObjects = editor?.canvas?.getActiveObject();
    setSelectedObjects(activeObjects);

    // Get color of the first selected object, assuming all selected objects have the same color
    if (activeObjects) {
      if (activeObjects.type === "image") return;
      const color = activeObjects.get("stroke");
      const stroke = activeObjects.get("strokeWidth");
      const fill = activeObjects.get("fill");
      const opacity = activeObjects.get("opacity");
      setProperties({ color, stroke, fill, opacity });
    }
  };

  const clearSelection = () => {
    setSelectedObjects(null);
  };

  const handleDrawing = (val) => {
    setIsPainting(val);
  };

  const changeProperty = (property, value) => {
    if (!selectedObjects) return;
    if (selectedObjects._objects) {
      selectedObjects._objects.forEach((obj) => {
        obj.set(property, value);
      });
    } else {
      selectedObjects.set(property, value);
    }
    editor.canvas.renderAll();
  }

  const onPropertyChange = (property, value) => {
    switch (property) {
      case "stroke":
        setProperties({ ...properties, color: value });
        changeProperty(property, value);
        break;
      case "strokeWidth":
        setProperties({ ...properties, stroke: parseInt(value) });
        changeProperty(property, parseInt(value));
        break;
      case "fill":
        setProperties({ ...properties, fill: value });
        changeProperty(property, value);
        break;
      case "opacity":
        setProperties({ ...properties, opacity: parseFloat(value) });
        changeProperty(property, parseFloat(value));
        break;
      case "transparent":
        setProperties({ ...properties, fill: "transparent" });
        changeProperty("fill", value);
        break;
      default:
        break;
    }
  };

  const zoomIn = () => {
    setZoom((prevZoom) => prevZoom + 0.1);
    editor.canvas.setZoom(editor.canvas.getZoom() + 0.1);
  };

  const zoomOut = () => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.1));
    editor.canvas.setZoom(editor.canvas.getZoom() - 0.1);
  };

  const copyObjects = () => {
    if (editor.canvas.getActiveObject()) {
      setClipboard(fabric.util.object.clone(editor.canvas.getActiveObject()));
      editor.canvas.discardActiveObject().renderAll();
    }
  };

  const pasteObjects = () => {
    if (clipboard) {
      clipboard.clone((cloned) => {
        editor.canvas.discardActiveObject();
        cloned.set({
          left: cloned.left + 10,
          top: cloned.top + 10,
          evented: true,
        });
        if (cloned.type === "activeSelection") {
          // If multiple objects are selected, add them all
          cloned.canvas = editor.canvas;
          cloned.forEachObject((obj) => editor.canvas.add(obj));
          cloned.setCoords();
        } else {
          editor.canvas.add(cloned);
        }
        setClipboard(cloned);
        editor.canvas.setActiveObject(cloned);
        editor.canvas.renderAll();
      });
    }
  };

  // Function to save the current state of the canvas to history
  const saveCanvasState = () => {
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
      if (json === canvasState[canvasState.length - 1]) return; // Check if the current state is the same as the last state
      setCanvasState((prevState) => [...prevState, json]);
    }
  };

  // Function to undo the last action
  const undo = () => {
    if (canvasState.length > 0) {
      // ToDO: in realtime undo, we need to send the last state to the server and update the canvas
      const newCanvasState = canvasState;
      const lastCanvasState = newCanvasState.pop(); // Remove the last state from the history
      const parsedLastCanvasState = JSON.parse(lastCanvasState);
      editor.canvas.loadFromJSON(
        parsedLastCanvasState,
        editor.canvas.renderAll.bind(editor.canvas)
      ); // Load the last state to the canvas
      setCanvasState(newCanvasState);
      if (!enableConnection) return;
      socket.emit("undo", lastCanvasState, props.roomId); // Send the last state to the server to update other clients
    }
  };

  return (
    <div>
      {Object.values(cursorPositions).map(({ x, y, userId, randomcolor }) => (
        <div
          key={userId}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            position: "absolute",
            left: x,
            top: y,
            color: randomcolor || red,
          }}>
          <MousePointer2 style={{ fill: randomcolor || red }} />
          <span className="text-xs ml-3">{userId}</span>
        </div>
      ))}

      {user && (
        <Tray
          editor={editor}
          properties={properties}
          handleDrawing={handleDrawing}
          isDrawing={isDrawing}
          socket={socket}
          roomId={props.roomId}
        />
      )}
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
      {selectedObjects || isPainting ? (
        <Settings
          properties={properties}
          onPropertyChange={onPropertyChange}
        />
      ) : null}

      {user && (
        <FabricJSCanvas
          className="h-[100vh] bg-white"
          onReady={(canvas) => setEditor({ canvas })}
        />
      )}
    </div>
  );
};

export default Canvas;
