"use client";
import React, { useRef, useEffect, useState } from 'react';
import { fabric } from 'fabric';

const FabricCanvas = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: false // Initially set to false, we will toggle this later
    });

    // Set up event listeners for mouse down, move, and up events
    canvas.on('mouse:down', (options) => {
      setIsDrawing(true);
      const pointer = canvas.getPointer(options.e);
      const brush = new fabric.CircleBrush(canvas);
      brush.color = 'red'; // Set brush color
      brush.width = 10; // Set brush width
      brush.shadow = new fabric.Shadow(); // Optional: add shadow
      brush.shadow.blur = 10;
      brush.shadow.color = 'rgba(0,0,0,0.5)';
      canvas.freeDrawingBrush = brush;
      canvas.freeDrawingBrush.onMouseDown(pointer);
    });

    canvas.on('mouse:move', (options) => {
      if (isDrawing) {
        const pointer = canvas.getPointer(options.e);
        canvas.freeDrawingBrush.onMouseMove(pointer);
      }
    });

    canvas.on('mouse:up', () => {
      setIsDrawing(false);
      canvas.freeDrawingBrush.onMouseUp();
    });

    // Cleanup function
    return () => {
      canvas.dispose();
    };
  }, [isDrawing]); // Re-run effect when isDrawing state changes

  return <canvas ref={canvasRef} style={{ border: '2px solid black' }} />;
};

export default FabricCanvas;

