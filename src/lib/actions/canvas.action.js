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
  try {
    await connectDB();
    const canvas = await Canvas.find({ createdBy: user });
    return JSON.stringify(canvas);
  } catch (error) {
    console.log(error);
  }
}
