"use server"
import { connectDB } from "@/lib/database";
import User from "@/lib/database/models/user.models";

export async function createUser(user){
    try {
        const db = await connectDB();
        const newUser = await User.create(user);

    } catch (error) {
        throw new Error(error);
    }
}

export async function getUserById(clerkId){
    try {
        await connectDB();
        const user = await User.findOne(clerkId);
        return JSON.stringify(user);
    } catch (error) {
        throw new Error(error);
    }
}