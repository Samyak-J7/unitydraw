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
  editor?.addText("Text here");
  repeat(editor.canvas);
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

// export all the functions.
export {
  onAddCircle,
  onAddRectangle,
  onAddText,
  paintBrush,
  selector,
  clearAll,
  eraser,
};
