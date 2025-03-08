import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
      const data = await prisma.service_of_exercise.findMany({
        where: {
          Status: true,
        },
        include: {
          buying_exercise: true,
          reviews: true,
          time_and_price: {
            orderBy: {
              quantity_of_days: "asc",
            }
          },
        },
      });      
      return NextResponse.json({ data: data, msg: "success", status: 200 });
    } catch (error) {
      return NextResponse.json(
        { error: "Something went wrong" + error },
        { status: 500 }
      );
    }
  }