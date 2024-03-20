const selector = (editor) => {
  const canvas = editor.canvas;
  canvas.isDrawingMode = false;
};
const onAddCircle = (editor) => {
  editor?.addCircle();
  editor.canvas.isDrawingMode = false;
};
const onAddRectangle = (editor) => {
  editor?.addRectangle();
  editor.canvas.isDrawingMode = false;
};
const onAddText = (editor) => {
  editor?.addText("Text here");
  editor.canvas.isDrawingMode = false;
};
const paintBrush = (editor) => {
  const canvas = editor.canvas;
  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.width = 5;
  canvas.freeDrawingBrush.color = "black";
};

const deleteSel = (editor) => {};
const clearAll = (editor) => {
  editor?.deleteAll();
};
export {
  onAddCircle,
  onAddRectangle,
  onAddText,
  paintBrush,
  selector,
  clearAll,
  deleteSel,
};
