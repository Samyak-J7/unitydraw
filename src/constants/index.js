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
  ZoomIn,
  ZoomOut,
  MoveRight
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
  zoomIn,
  zoomOut,
  arrow
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
    name: "Add Line",
    icon: <Minus />,
    action: addLine,
  },
  {
    name: "Add Arrow",
    icon: <MoveRight />,
    action: arrow,
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
  {
    name: "Zoom In",
    icon: <ZoomIn />,
    action: zoomIn,
  },
  {
    name: "Zoom Out",
    icon: <ZoomOut />,
    action: zoomOut,
  }

];


export { Tools };
