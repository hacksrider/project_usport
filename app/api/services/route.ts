import { NextResponse } from "next/server";
import prisma from "@/lib/db";

interface Detail {
  price: number;
  unit: string;
  quantity_of_days: number;
}
export async function POST(request: Request) {
  try {
    const { service_name, capacity_of_room, Status, detail } =
      await request.json();
    // quantity_of_days,
    // price,

    // Validate all required fields
    if (
      !service_name ||
      !capacity_of_room ||
      !Status === null ||
      !Status === undefined ||
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
      const service = await prisma.service_of_Exercise.create({
        data: {
          service_name,
          capacity_of_room: Number(capacity_of_room),
          Status,
        },
      });

      // Insert into quantity_of_days of Service
      const timeServices = await Promise.all(
        detail.map((v: Detail) =>
          prisma.time_Of_Service.create({
            data: {
              quantity_of_days: Number(v.quantity_of_days),
              unit: v.unit,
            },
          })
        )
      );

      const priceExercise = await Promise.all(
        detail.map((v: Detail, i: number) =>
          prisma.price_Exercise.create({
            data: {
              service_ID: service.service_ID, // Adjust key if schema uses different name
              time_ID: timeServices[i].time_ID, // Adjust key if schema uses different name
              price: Number(v.price),
            },
          })
        )
      );

      return { service, timeServices, priceExercise };
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
    const data = await prisma.service_of_Exercise.findMany(
        {
            include: {
                Buying_Exercise: true,
                Reviews: true,
                Price_Exercise: {
                    include: {
                        Time_Of_Service: true
                    }
                }
            }
        }
    );
    return NextResponse.json({ data: data, msg: "success", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" + error },
      { status: 500 }
    );
  }
}