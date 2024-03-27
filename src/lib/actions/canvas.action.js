"use server";
import { connectDB } from "@/lib/database";
import Canvas from "@/lib/database/models/canvas.models";

export async function saveCanvas(canvas) {
  try {
    await connectDB();
    await Canvas.create(canvas);
  } catch (error) {
    console.log(error);
  }
}

export async function fetchAllCanvas(user) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
   
  };
  try {
    await connectDB();
    const canvasData = await Canvas.find({ createdBy: user });
    const plainCanvas = canvasData.map(canvas => ({
      canvasName: canvas.canvasName,
      canvasId: canvas.canvasId,
      createdAt : canvas.createdAt.toLocaleString('en-US', options),
      updatedAt : canvas.updatedAt.toLocaleString('en-US', options)
    }));
    return plainCanvas;
  } catch (error) {
    console.log(error);
  }
}
