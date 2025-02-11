import { NextResponse } from "next/server";
import prisma from "@/lib/db";

import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOption);
    if (!session || !session.user)
      return NextResponse.json({ msg: "authen", status: 400 });


    const { service_ID, score, Text_review } = await request.json();
    if (!service_ID || !score || !Text_review) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const result = await prisma.reviews.create({
      data: {
        user_ID: session.user.id,
        service_ID,
        score,
        Text_review,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const data = await prisma.reviews.findMany();
    return NextResponse.json({ data, msg: "success", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}