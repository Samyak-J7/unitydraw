"use server"
import { connectDB } from "@/database";
import User from "@/database/models/user.models";

export async function createUser(user){
    try {
        const db = await connectDB();
        await User.create(user);
    } catch (error) {
        console.log(error);
    }
}