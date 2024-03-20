// repeat function is used to remove the event listener from the canvas and set the isDrawingMode to false.
const repeat = (canvas) => {
  canvas.off("mouse:down");
  canvas.isDrawingMode = false;
};

// selector function is used to remove the event listener from the canvas and set the isDrawingMode to false.
const selector = (editor) => {
  repeat(editor.canvas);
};

// onAddCircle function is used to add a circle to the canvas and call the repeat function.
const onAddCircle = (editor) => {
  editor?.addCircle();
  repeat(editor.canvas);
};

// onAddRectangle function is used to add a rectangle to the canvas and call the repeat function.
const onAddRectangle = (editor) => {
  editor?.addRectangle();
  repeat(editor.canvas);
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
};
