"use server";
import { StreamClient } from '@stream-io/node-sdk';
import { currentUser } from "@clerk/nextjs/server"
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const secret = process.env.STREAM_API_SECRET;

export const tokenProvider = async()=>{
    const user = await currentUser();
    console.log('user from stream action',user);

    if(!user) throw new Error('User not found');
    if(!apiKey) throw new Error('Stream API key not set');
    if(!secret) throw new Error('Stream API secret not set');

    const client = new StreamClient(apiKey,secret);
    const exp = Math.floor(new Date().getTime() / 1000) + 3600;
    const issued = Math.floor(Date.now() / 1000)-60;
    const token = client.createToken(user.id, exp,issued);
    console.log('token',token);
    return token;
}