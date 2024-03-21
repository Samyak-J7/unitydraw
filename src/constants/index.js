import React from "react";
import {
  Hand,
  Circle,
  Square,
  Type,
  Brush,
  MousePointer,
  Eraser,
  Trash2,
  Minus,
  MoveRight,
  RectangleHorizontal,
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
  arrow,
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
    name: "Add Line",
    icon: <Minus />,
    action: addLine,
  },
  // {
  //   name: "Add Arrow",
  //   icon: <MoveRight />,
  //   action: arrow,
  // },
  {
    name: "Add Text",
    icon: <Type />,
    action: onAddText,
  },
  {
    name: "Paintbrush",
    icon: <Brush />,
    action: paintBrush,
  },
  {
    name: "Eraser",
    icon: <Eraser />,
    action: eraser,
  },
  {
    name: "Clear All",
    icon: <Trash2 />,
    action: clearAll,
  },
];

export { Tools };
