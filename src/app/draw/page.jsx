"use client";
import React from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import Tray from "@/components/tray";

const Draw = () => {
  const { editor, onReady } = useFabricJSEditor(); // Get the editor instance

  return (
    <div>
      <Tray editor={editor} />
      <FabricJSCanvas className="h-[80vh] border-2 border-indigo-600" onReady={onReady} />
    </div>
  );
};

export default Draw;
