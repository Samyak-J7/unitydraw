// repeat function is used to remove the event listener from the canvas and set the isDrawingMode to false.
import { v4 as uuidv4 } from "uuid";
const repeat = (canvas) => {
  canvas.off("mouse:down");
  canvas.off("mouse:move");
  canvas.off("mouse:up");
  canvas.isDrawingMode = false;
  canvas.selection = false;
  canvas.hoverCursor = "move";
};

// selector function is used to remove the event listener from the canvas and set the isDrawingMode to false.
const selector = (editor) => {
  editor.canvas.defaultCursor = "default";
  repeat(editor.canvas);
  editor.canvas.selection = true;
};

const objectdraw = (canvas) => {
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.width = 0;
  canvas.freeDrawingBrush.color = "rgba(0,0,0,0)";
}
// onAddCircle function is used to add a circle to the canvas and call the repeat function.
const onAddCircle = (editor, color, stroke, bgColor, completed) => {
  const canvas = editor.canvas;
  canvas.defaultCursor = "crosshair";
  repeat(canvas);
  objectdraw(canvas);
  canvas.on("mouse:down", (event) => {
    canvas.isDrawingMode = false;
    const pointer = canvas.getPointer(event.e);
    const circle = new fabric.Circle({
      left: pointer.x,
      top: pointer.y,
      radius: 50,
      fill: bgColor,
      stroke: color,
      strokeWidth: stroke,
      shadow: "rgba(0,0,0,0.3) 2px 2px 2px",
      id: uuidv4(),
      // shadow:{
      //   color: 'red', // Shadow color
      //   blur: 0,                 // Shadow blur
      //   offsetX: 10,               // Horizontal offset
      //   offsetY: 5                // Vertical offset
      // },
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();

    canvas.on("mouse:move", (event) => {
      canvas.isDrawingMode = false;
      const pointer = canvas.getPointer(event.e);
      const radius = Math.abs(pointer.x - circle.left); // distance formula for radius
      circle.set({ radius });
      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      canvas.isDrawingMode = false;
      selector(editor);
      completed();
    });
  });
};

// onAddRectangle function is used to add a rectangle to the canvas and call the repeat function.
const onAddRectangle = (editor, color, stroke, bgColor, completed) => {
  const canvas = editor.canvas;
  canvas.defaultCursor = "crosshair";
  repeat(canvas);
  objectdraw(canvas);
  canvas.on("mouse:down", (event) => {
    canvas.isDrawingMode = false;
    const pointer = canvas.getPointer(event.e);
    const rect = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      fill: bgColor,
      stroke: color,
      strokeWidth: stroke,
      width: 50,
      height: 50,
      shadow: "rgba(0,0,0,0.3) 2px 2px 2px",
      id: uuidv4(),
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();

    canvas.on("mouse:move", (event) => {
      canvas.isDrawingMode = false;
      const pointer = canvas.getPointer(event.e);
      rect.set({
        width: Math.abs(pointer.x - rect.left),
        height: Math.abs(pointer.y - rect.top),
      });
      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      canvas.isDrawingMode = false;
      selector(editor);
      completed();
    });
  });
};

// addLine function is used to add a line to the canvas and call the repeat function.
const addLine = (editor, color, stroke, bgColor, completed) => {
  repeat(editor.canvas);
  const canvas = editor.canvas;
  canvas.defaultCursor = "crosshair";
  objectdraw(canvas);
  canvas.on("mouse:down", (event) => {
    canvas.isDrawingMode = false;
    const pointer = canvas.getPointer(event.e);
    const points = [pointer.x, pointer.y, pointer.x, pointer.y];
    const line = new fabric.Line(points, {
      strokeWidth: stroke,
      stroke: color,
      fill: bgColor,
      id: uuidv4(),
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();

    canvas.on("mouse:move", (event) => {
      canvas.isDrawingMode = false;
      const pointer = canvas.getPointer(event.e);
      line.set({ x2: pointer.x, y2: pointer.y });
      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      canvas.isDrawingMode = false;
      selector(editor);
      completed();
    });
  });
};

// onAddText function is used to add text to the canvas and call the repeat function.
const onAddText = (editor, color, stroke, bgColor, completed) => {
  const canvas = editor.canvas;
  repeat(canvas);
  canvas.defaultCursor = "text";
  canvas.hoverCursor = "text";
  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    const text = new fabric.Textbox("", {
      left: pointer.x,
      top: pointer.y,
      width: 100,
      height: 50,
      strokeWidth: stroke,
      stroke: color,
      fill: bgColor,
      textAlign: "center",
      id: uuidv4(),
    });
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
    canvas.off("mouse:down");
    selector(editor);
    completed();
  });
};
const paintBrush = (editor, color, stroke, bgColor, completed, isDrawing) => {
  const canvas = editor.canvas;
  repeat(canvas);
  canvas.defaultCursor = "crosshair";
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.width = stroke;
  canvas.freeDrawingBrush.color = color;

  canvas.on("mouse:down", () => {
    isDrawing(true);
  });
  canvas.on("mouse:up", () => {
    isDrawing(false);
  });
};

// eraser function is used to remove the object from the canvas when the mouse is clicked on the object.
const eraser = (editor, color, stroke, bgColor, completed, isDrawing,handleEraseObject) => {
  const canvas = editor.canvas;
  canvas.defaultCursor = "url('https://img.icons8.com/skeuomorphism/32/experimental-eraser-skeuomorphism.png'), auto"
  canvas.hoverCursor =   "url('https://img.icons8.com/skeuomorphism/32/experimental-eraser-skeuomorphism.png'), auto";
  canvas.isDrawingMode = false;
  canvas.on("mouse:down", (event) => {
    const target = event.target;
    if (target) {
      handleEraseObject(target.id);
      canvas.remove(target);
      canvas.renderAll();
    }
  });
};

// clearAll function is used to remove all the objects from the canvas.
const clearAll = (editor) => {
  editor.canvas.off("mouse:down");
  editor?.canvas.clear();
  localStorage.removeItem("canvasState");
  selector(editor);
};

// pan function is used to enable panning on the canvas.
const pan = (editor) => {
  const canvas = editor.canvas;
  canvas.defaultCursor = "grab";
  repeat(canvas);
  let isPanning = false;
  let lastPosX = 0;
  let lastPosY = 0;
  canvas.on("mouse:down", (event) => {
    canvas.defaultCursor = "grabbing";
    isPanning = true;
    lastPosX = event.e.clientX;
    lastPosY = event.e.clientY;
  });

  canvas.on("mouse:move", (event) => {
    if (isPanning) {
      const deltaX = event.e.clientX - lastPosX;
      const deltaY = event.e.clientY - lastPosY;
      canvas.relativePan({ x: deltaX, y: deltaY });
      lastPosX = event.e.clientX;
      lastPosY = event.e.clientY;
    }
  });

  canvas.on("mouse:up", () => {
    canvas.defaultCursor = "grab";
    isPanning = false;
  });
};

// arrow function is used to add an arrow to the canvas and call the repeat function.
const arrow = (editor, color, stroke, bgColor, completed) => {
  const canvas = editor.canvas;
  canvas.defaultCursor = "crosshair";
  repeat(canvas);
  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    const points = [pointer.x, pointer.y, pointer.x, pointer.y];
    const line = new fabric.Line(points, {
      strokeWidth: stroke,
      stroke: color,
      selectable: false,
      id: uuidv4(),
    });

    const arrow = new fabric.Triangle({
      width: 10,
      height: 20,
      fill: color,
      selectable: false,
      hasControls: false,
      angle: 90,
      originX: "center",
      originY: "center",
    });

    canvas.add(line, arrow);
    canvas.setActiveObject(line);
    canvas.renderAll();

    canvas.on("mouse:move", (event) => {
      const pointer = canvas.getPointer(event.e);
      line.set({ x2: pointer.x, y2: pointer.y });
      const angle =
        Math.atan2(pointer.y - line.y1, pointer.x - line.x1) * (180 / Math.PI); // angle formula for arrow
      arrow.set({ left: pointer.x, top: pointer.y, angle: angle + 90 }); // +90 to make the arrow point in the right direction
      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      selector(editor);
      completed();
    });
  });
};

// handleFileChange function is used to handle the file change event and add the image to the canvas.
const handleFileChange = (e, editor, completed) => {
  const file = e.target.files[0];
  if (!file) return;
  e.target.value = "";
  const reader = new FileReader();
  reader.onload = (event) => {
    const imageUrl = event.target.result;
    fabric.Image.fromURL(imageUrl, (img) => {
      editor.canvas.add(img);
    });
  };
  reader.readAsDataURL(file);
  completed();
  selector(editor);
};

const openFilePicker = (fileInputRef) => {
  fileInputRef.current.click();
};

// export all the functions.
export {
  onAddCircle,
  onAddRectangle,
  onAddText,
  paintBrush,
  selector,
  clearAll,
  eraser,
  pan,
  addLine,
  arrow,
  handleFileChange,
  openFilePicker,
};
