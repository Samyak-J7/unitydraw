"use server"
import { connectDB } from "@/database";
import User from "@/database/models/user.models";

export async function createUser(user){
    try {
        const db = await connectDB();
        const newUser = await User.create(user);

    } catch (error) {
        console.log(error);
    }
}