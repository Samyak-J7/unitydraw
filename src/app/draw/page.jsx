"use client";
import React from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import Tray from "@/components/tray";
import Settings from "@/components/settings";

const Draw = () => {
  const { editor, onReady } = useFabricJSEditor();
  return (
    <div>
      <Tray editor={editor} />
      <Settings />
      <FabricJSCanvas className="h-[80vh] border-2 border-indigo-600" onReady={onReady} />
    </div>
  );
};

export default Draw;
