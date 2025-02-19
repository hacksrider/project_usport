/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { authOption } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOption);
    // @ts-expect-error
    if (!session || !session.user || !session.user.id)
      return NextResponse.json({ msg: "Unauthorized", status: 401 });

    const { service_ID, score, Text_review } = await request.json();

    if (
      typeof service_ID === "undefined" ||
      typeof score === "undefined" ||
      typeof Text_review === "undefined"
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate score (ต้องอยู่ระหว่าง 1-5)
    if (score < 1 || score > 5) {
      return NextResponse.json(
        { error: "Score must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Validate Text_review (ไม่ให้ว่าง)
    if (Text_review.trim().length === 0) {
      return NextResponse.json(
        { error: "Review text cannot be empty" },
        { status: 400 }
      );
    }

    const result = await prisma.reviews.create({
      data: {
    // @ts-expect-error
        user_ID: parseInt(session.user.id),
        service_ID: parseInt(service_ID),
        score,
        Text_review,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error in POST /reviews:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const service_ID = searchParams.get("service_ID");

    const data = await prisma.reviews.findMany({
      where: service_ID ? { service_ID: Number(service_ID) } : {},
      include: { users:true, service_of_exercise:true }
    });

    return NextResponse.json({ data, msg: "success", status: 200 });
  } catch (error) {
    console.error("Error in GET /reviews:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
