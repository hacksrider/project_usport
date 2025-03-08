/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const param = await params;
    const id = parseInt(param.id);

    // ลบ time_and_price ที่เกี่ยวข้อง
    await prisma.time_and_price.deleteMany({
      where: { service_ID: id },
    });

    // ลบ service_of_exercise
    const service = await prisma.service_of_exercise.update({
      where: { service_ID: id },
      data: {
        deleted: 0
      }
    });

    return NextResponse.json({ msg: "Deleted service: " + service.service_ID });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code == "P2003") {
        return NextResponse.json(
          { error: "P2003 - Foreign key constraint failed" },
          { status: 500 }
        );
      }
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const par = await params;
    const id = parseInt(par.id);
    const data = await prisma.service_of_exercise.findUnique({
      where: { service_ID: id, deleted: 1 },
      include: {
        buying_exercise: true,
        reviews: true,
        time_and_price: true,  // ดึงข้อมูลจาก time_and_price ที่เชื่อมโยงกับ service_ID
      },
    });

    if (!data) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    data.time_and_price.sort((a, b) => a.quantity_of_days! - b.quantity_of_days!);

    return NextResponse.json({ data, msg: "success", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const id = parseInt(context.params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID parameter" },
        { status: 400 }
      );
    }

    const { service_name, capacity_of_room, Status, detail } = await request.json();

    if (!service_name || !capacity_of_room || Status == null || !detail) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedService = await prisma.service_of_exercise.update({
      where: { service_ID: id },
      data: {
        service_name,
        capacity_of_room: Number(capacity_of_room),
        Status,
      },
    });

    const incomingTimeIDs = detail.map((v: any) => v.time_ID).filter((id: any) => id);

    await prisma.time_and_price.deleteMany({
      where: {
        service_ID: id,
        NOT: { time_ID: { in: incomingTimeIDs } },
      },
    });

    const updatedDetails = await Promise.all(
      detail.map(async (v: any) => {
        if (v.time_ID) {
          const updatedTime = await prisma.time_and_price.update({
            where: { time_ID: v.time_ID },
            data: { quantity_of_days: Number(v.quantity_of_days), unit: v.unit },
          });

          return { updatedTime };
        } else {
          const newTime = await prisma.time_and_price.create({
            data: {
              service_ID: id,
              quantity_of_days: Number(v.quantity_of_days),
              unit: v.unit,
              price: Number(v.price),
            },
          });

          return { newTime };
        }
      })
    );

    return NextResponse.json({ updatedService, updatedDetails }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}
