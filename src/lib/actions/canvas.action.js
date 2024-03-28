"use server";
import { connectDB } from "@/lib/database";
import Canvas from "@/lib/database/models/canvas.models";
import User from "../database/models/user.models";

export async function saveCanvas(canvas) {
  try {
    await connectDB();
    const existingCanvas = await Canvas.findOne({ canvasId: canvas.canvasId });
    if (existingCanvas) {
      await Canvas.updateOne({ canvasId: canvas.canvasId }, canvas);
    } else {
      await Canvas.create(canvas);
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchAllCanvas(user) {
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  try {
    await connectDB();
    const canvasData = await Canvas.find({ createdBy: user });
    const plainCanvas = canvasData.map((canvas) => ({
      canvasName: canvas.canvasName,
      canvasId: canvas.canvasId,
      updatedAt: canvas.updatedAt.toLocaleString("en-US", options),
    }));
    return plainCanvas;
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchJoinedCanvas(userId) {
  const options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  try {
    await connectDB();
    const user = await User.findById(userId);
    const joinedRooms = await user.joinedRooms;
    if (!joinedRooms) return ["No joined rooms found"];
    const canvasData = await Canvas.find({ roomId: { $in: joinedRooms } });
    const plainCanvas = canvasData.map((canvas) => ({
      canvasName: canvas.canvasName,
      canvasId: canvas.canvasId,
      updatedAt: canvas.updatedAt.toLocaleString("en-US", options),
      roomId: canvas.roomId,
    }));
    return plainCanvas;
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchCanvasById(canvasId, userId) {
  try {
    await connectDB();
    const data = await Canvas.findOne({ canvasId, createdBy: userId });
    return data.canvasData;
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchCanvasName(canvasId) {
  try {
    await connectDB();
    const data = await Canvas.findOne({ canvasId });
    return data.canvasName;
  } catch (error) {
    throw new Error(error);
  }
}
