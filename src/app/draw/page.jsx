import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

const FabricCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current);

    // Example usage: add a rectangle to the canvas
    const rect = new fabric.Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 100,
      height: 100
    });
    canvas.add(rect);

    // Cleanup function
    return () => {
      canvas.dispose();
    };
  }, []); // Empty dependency array ensures the effect runs only once after initial render

  return <canvas ref={canvasRef} />;
};

export default FabricCanvas;