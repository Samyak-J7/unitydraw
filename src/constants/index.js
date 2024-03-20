import React from "react";
import { Hand } from "lucide-react";

const Tools = [
  {
    name: "Panning Hand",
    icon: <Hand />,
    action: "panningHand",
  },
  {
    name: "Add Circle",
    icon: "circle",
    action: "addCircle",
  },
  {
    name: "Add Rectangle",
    icon: "rectangle",
    action: "addRectangle",
  },
  {
    name: "Add Text",
    icon: "text",
    action: "addText",
  },
  {
    name: "Toggle Paintbrush",
    icon: "brush",
    action: "togglePaintbrush",
  },
];

export {Tools};
