import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    
    const userCount = await prisma.users.count();
    return NextResponse.json({
      success: true,
      data: userCount,
    });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to fetch user count",
    }, { status: 500 });
  }
}
