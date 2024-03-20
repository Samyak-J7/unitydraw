import { useFabricJSEditor } from "fabricjs-react";
const {editor, onReady} = useFabricJSEditor();

const onAddCircle = () => {
  editor?.addCircle();
};
const onAddRectangle = () => {
  editor?.addRectangle();
};
const onAddText = () => {
  editor?.addText("Text here");
};

export { onAddCircle, onAddRectangle, onAddText };
