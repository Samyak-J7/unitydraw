"use server"
import { connectDB } from "@/lib/database";
import User from "@/lib/database/models/user.models";

export async function createUser(user){
    try {
        const db = await connectDB();
        const newUser = await User.create(user);

    } catch (error) {
        console.log(error);
    }
}