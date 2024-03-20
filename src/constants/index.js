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
} from "lucide-react";
import {
  onAddCircle,
  onAddRectangle,
  onAddText,
  paintBrush,
  selector,
  eraser,
  clearAll,
  pan
} from "./actions";

const Tools = [
  {
    name: "Pan",
    icon: <Hand />,
    action: pan,
  },
  {
    name: "Selector",
    icon: <MousePointer />,
    action: selector,
  },
  {
    name: "Add Circle",
    icon: <Circle />,
    action: onAddCircle,
  },
  {
    name: "Add Square",
    icon: <Square />,
    action: onAddRectangle,
  },
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
