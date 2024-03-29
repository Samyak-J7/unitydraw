"use server";
import { connectDB } from "@/lib/database";
import Canvas from "@/lib/database/models/canvas.models";
import User from "../database/models/user.models";
import { getUsernameById } from "./user.action";
import { fetchMembers } from "./room.action";

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

export async function fetchAllCanvas(userId) {
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
    const createdCanvasData = await Canvas.find({ createdBy: userId });
    const plainCanvas1 = createdCanvasData.map((canvas) => ({
      canvasName: canvas.canvasName,
      canvasId: canvas.canvasId,
      updatedAt: canvas.updatedAt.toLocaleString("en-US", options),
      createdBy: getUsernameById(canvas.createdBy)
        .then((data) => {
          return data;
        })
        .catch((error) => {
          return "Unknown";
        }),
      roomId: canvas.roomId || null,
      members: canvas.roomId ? fetchMembers(canvas.roomId).then((data) => {return data}).catch((error) => {return "Could not find"}) : "Not Shared",
    }));
    const user = await User.findById(userId);
    const joinedRooms = await user.joinedRooms;
    const joinedCanvasData = await Canvas.find({
      roomId: { $in: joinedRooms },
    });
    const plainCanvas2 = joinedCanvasData.map((canvas) => ({
      canvasName: canvas.canvasName,
      canvasId: canvas.canvasId,
      updatedAt: canvas.updatedAt.toLocaleString("en-US", options),
      createdBy: getUsernameById(canvas.createdBy)
        .then((data) => {
          return data;
        })
        .catch((error) => {
          return "Unknown";
        }),
      roomId: canvas.roomId,
      members: fetchMembers(canvas.roomId).then((data) => {return data}).catch((error) => {return "Could not find"}),
    }));
    const finalData = [...plainCanvas1, ...plainCanvas2];

    // Remove duplicates based on canvasId
    const uniqueFinalData = Array.from(
      new Set(finalData.map((canvas) => canvas.canvasId))
    ).map((canvasId) => {
      return finalData.find((canvas) => canvas.canvasId === canvasId);
    });
    return uniqueFinalData;
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
