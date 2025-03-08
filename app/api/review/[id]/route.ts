/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

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
