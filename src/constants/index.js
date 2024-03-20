import React from "react";
import { Hand, Circle, Square, Type, Brush } from "lucide-react";
import { onAddCircle, onAddRectangle, onAddText } from "./actions";

const Tools = [
  {
    name: "Panning Hand",
    icon: <Hand />,
    action: "panningHand",
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
    name: "Toggle Paintbrush",
    icon: <Brush />,
    action: "togglePaintbrush",
  },
];

export {Tools};
