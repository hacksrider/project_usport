import { NextResponse } from "next/server";
import prisma from "@/lib/db";

interface Detail {
  unit: string;
  quantity_of_days: number;
  price: number;
}

export async function POST(request: Request) {
  try {
    const { service_name, capacity_of_room, Status, detail } =
      await request.json();

    // Validate all required fields
    if (
      !service_name ||
      !capacity_of_room ||
      Status === null ||
      Status === undefined ||
      !detail
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Transaction to insert data into all three tables
    const result = await prisma.$transaction(async (prisma) => {
      // Insert into Service of Exercise
      const service = await prisma.service_of_exercise.create({
        data: {
          service_name,
          capacity_of_room: Number(capacity_of_room),
          Status,
        },
      });

      // Insert into time_and_price with service_ID
      const timeServices = await Promise.all(
        detail.map((v: Detail) =>
          prisma.time_and_price.create({
            data: {
              service_ID: Number(service.service_ID),
              quantity_of_days: Number(v.quantity_of_days),
              unit: v.unit,
              price: Number(v.price),
            },
          })
        )
      );


           return { service, timeServices };
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
    const data = await prisma.service_of_exercise.findMany({
      where: {
        deleted: 1,
      },
      include: {
        buying_exercise: true,
        reviews: true,
        time_and_price: true,
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
