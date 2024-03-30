import React from "react";
import {
  Hand,
  Circle,
  Type,
  Brush,
  MousePointer,
  Eraser,
  Trash2,
  Minus,
  RectangleHorizontal,
  Image,
} from "lucide-react";
import {
  onAddCircle,
  onAddRectangle,
  onAddText,
  paintBrush,
  selector,
  eraser,
  clearAll,
  pan,
  addLine,
  openFilePicker,
} from "./actions";

const Tools = [
  {
    name: "Panning",
    icon: <Hand />,
    action: pan,
  },
  {
    name: "Selector",
    icon: <MousePointer />,
    action: selector,
  },
  {
    name: "Circle",
    icon: <Circle />,
    action: onAddCircle,
  },
  {
    name: "Rectangle",
    icon: <RectangleHorizontal />,
    action: onAddRectangle,
  },
  {
    name: "Line",
    icon: <Minus />,
    action: addLine,
  },
  {
    name: "Text",
    icon: <Type />,
    action: onAddText,
  },
  {
    name: "Paintbrush",
    icon: <Brush />,
    action: paintBrush,
  },
  {
    name: "Image",
    icon: <Image />,
    action: openFilePicker,
  },
  {
    name: "Eraser",
    icon: <Eraser />,
    action: eraser,
  },
  {
    name: "ClearAll",
    icon: <Trash2 />,
    action: clearAll,
  },
];

export { Tools };
