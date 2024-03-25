import { connectDB } from "@/database";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request) {
  try {
    //const conection = connectDB();
    return NextResponse.json({ conection: "establish" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
