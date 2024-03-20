// repeat function is used to remove the event listener from the canvas and set the isDrawingMode to false.
const repeat = (canvas) => {
  canvas.off("mouse:down");
  canvas.off("mouse:move");
  canvas.off("mouse:up");
  canvas.isDrawingMode = false;
};

// selector function is used to remove the event listener from the canvas and set the isDrawingMode to false.
const selector = (editor) => {
  repeat(editor.canvas);
};

// onAddCircle function is used to add a circle to the canvas and call the repeat function.
const onAddCircle = (editor) => {
  const canvas = editor.canvas;
  repeat(canvas);
  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    const circle = new fabric.Circle({
      left: pointer.x,
      top: pointer.y,
      radius: 50,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
    });
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();

    canvas.on("mouse:move", (event) => {
      const pointer = canvas.getPointer(event.e);
      const radius = Math.abs(pointer.x - circle.left); // distance formula for radius
      circle.set({ radius });
      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      repeat(canvas);
    });
  });
};

// onAddRectangle function is used to add a rectangle to the canvas and call the repeat function.
const onAddRectangle = (editor) => {
  const canvas = editor.canvas;
  repeat(canvas);
  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    const rect = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      fill: "transparent",
      stroke: "black",
      strokeWidth: 2,
      width: 50,
      height: 50,
    });
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();

    canvas.on("mouse:move", (event) => {
      const pointer = canvas.getPointer(event.e);
      rect.set({ width: Math.abs(pointer.x - rect.left), height: Math.abs(pointer.y - rect.top) });
      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      repeat(canvas);
    });
  });
};

// addLine function is used to add a line to the canvas and call the repeat function.
const addLine = (editor) => {
  repeat(editor.canvas);
  const canvas = editor.canvas;
  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    const points = [pointer.x, pointer.y, pointer.x, pointer.y];
    const line = new fabric.Line(points, {
      strokeWidth: 2,
      stroke: "black",
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();

    canvas.on("mouse:move", (event) => {
      const pointer = canvas.getPointer(event.e);
      line.set({ x2: pointer.x, y2: pointer.y });
      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      repeat(canvas);
    });
  });
  
};

// onAddText function is used to add text to the canvas and call the repeat function.
const onAddText = (editor) => {
  const canvas = editor.canvas;
  repeat(canvas);
  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    const text = new fabric.Textbox("", {
      left: pointer.x,
      top: pointer.y,
      width: 100,
      height: 50,
      fontSize: 16,
      fill: "black",
    }); 
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    canvas.off("mouse:down");
  });
};

// paintBrush function is used to set the isDrawingMode to true and set the brush width and color.
const paintBrush = (editor) => {
  const canvas = editor.canvas;
  canvas.off("mouse:down");
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.width = 5;
  canvas.freeDrawingBrush.color = "black";
};


// eraser function is used to remove the object from the canvas when the mouse is clicked on the object.
const eraser = (editor) => {
  const canvas = editor.canvas;
  canvas.isDrawingMode = false;
  canvas.on("mouse:down", (event) => {
    const target = event.target;
    if (target) {
      canvas.remove(target);
      canvas.renderAll();
    }
  });
};

// clearAll function is used to remove all the objects from the canvas.
const clearAll = (editor) => {
  editor.canvas.off("mouse:down");
  editor?.deleteAll();
};

// pan function is used to enable panning on the canvas.
const pan = (editor) => {
  const canvas = editor.canvas;
  repeat(canvas);
  let isPanning = false;
  let lastPosX = 0;
  let lastPosY = 0;

  canvas.on("mouse:down", (event) => {
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
    isPanning = false;
  });
};

const zoomIn = (editor) => {
  editor.canvas.setZoom(editor.canvas.getZoom() * 1.1);
};

const zoomOut = (editor) => {
  editor.canvas.setZoom(editor.canvas.getZoom() / 1.1);
};

const arrow = (editor) => {
  const canvas = editor.canvas;
  repeat(canvas);
  canvas.on("mouse:down", (event) => {
    const pointer = canvas.getPointer(event.e);
    const points = [pointer.x, pointer.y, pointer.x, pointer.y];
    const line = new fabric.Line(points, {
      strokeWidth: 2,
      stroke: "black",
      // arrowhead: true,
    });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.renderAll();
    // line.set({ arrowhead: true });
    canvas.on("mouse:move", (event) => {
      const pointer = canvas.getPointer(event.e);
      line.set({ x2: pointer.x, y2: pointer.y });
      // line.set({ arrowhead: true });
      canvas.renderAll();
    });

    canvas.on("mouse:up", () => {
      repeat(canvas);
    });
  });
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
  zoomIn,
  zoomOut,
  arrow
};
