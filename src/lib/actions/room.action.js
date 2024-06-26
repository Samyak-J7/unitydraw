"use server";
import { connectDB } from "@/lib/database";
import Room from "@/lib/database/models/room.models";
import Canvas from "@/lib/database/models/canvas.models";
import User from "../database/models/user.models";

export async function validateRoom(roomId) {
  try {
    await connectDB();
    const room = await Room.findOne({ roomId });
    return room ? true : false;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createRoom(room) {
  try {
    await connectDB();
    await Room.create(room);
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchCanvasByroomId(roomId) {
  try {
    await connectDB();
    const data = await Canvas.findOne({ roomId });
    if (data) {
      return { canvasData: data.canvasData, canvasName: data.canvasName };
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function saveCanvasbyroomID(roomId, canvasData, canvasName) {
  try {
    await connectDB();
    await Canvas.updateOne({ roomId }, { canvasData, canvasName });
  } catch (error) {
    throw new Error(error);
  }
}

export async function saveUsertoRoom(roomId, clerkId) {
  try {
    await connectDB();
    const user = await User.findOneAndUpdate(
      { clerkId },
      { $addToSet: { joinedRooms: roomId } }
    );
    
    const room = await Room.findOne({ roomId });
    if (room) {
      // Check if the user is not in the editor list
      if (!room.editors.includes(user._id)) {
        // Add the user to the viewer list
        await Room.findOneAndUpdate(
          { roomId },
          { $addToSet: { viewers: user._id } }
        );
      }
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function fetchMembers(roomId) {
  try {
    // await connectDB();
    const room = await Room.findOne({ roomId });
    const members = room.editors.length + room.viewers.length;
    return members - 1 === 0
      ? "Only You"
      : members - 1 === 1
      ? "1 Member"
      : `${members - 1} Members`;
  } catch (error) {
    throw new Error(error);
  }
}
