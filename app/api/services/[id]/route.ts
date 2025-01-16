/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await parseInt(params.id); //parseInt(params.id)
    const service = await prisma.service_of_Exercise.delete({
      where: {
        service_ID: id,
      },
    });
    return NextResponse.json({ msg: "delete service: " + service.service_ID });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e.code);
      console.log(e.message);
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = await parseInt(params.id); //parseInt(params.id)
    const data = await prisma.service_of_Exercise.findUnique({
      where: {
        service_ID: id,
      },
      include: {
        Buying_Exercise: true,
        Reviews: true,
        Price_Exercise: {
          include: {
            Time_Of_Service: true,
          },
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


export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    // Await params from context
    const params = await context.params;
    const id = await parseInt(params.id);

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

    // Update Service data
    const updatedService = await prisma.service_of_Exercise.update({
      where: { service_ID: id },
      data: {
        service_name,
        capacity_of_room: Number(capacity_of_room),
        Status,
      },
    });

    // Collect existing price_IDs from the request
    const incomingPriceIDs = detail.map((v: any) => v.price_ID).filter((id: any) => id);

    // Delete Price_Exercise entries not in the incoming detail
    await prisma.price_Exercise.deleteMany({
      where: {
        service_ID: id,
        NOT: {
          price_ID: { in: incomingPriceIDs },
        },
      },
    });

    // Process `detail` array for update/add
    const updatedDetails = await Promise.all(
      detail.map(async (v: any) => {
        if (v.price_ID && v.time_ID) {
          // Update existing entries
          const updatedTime = await prisma.time_Of_Service.update({
            where: { time_ID: v.time_ID },
            data: { quantity_of_days: Number(v.quantity_of_days), unit: v.unit },
          });

          const updatedPrice = await prisma.price_Exercise.update({
            where: { price_ID: v.price_ID },
            data: { price: Number(v.price) },
            
          });

          return { updatedTime, updatedPrice };
        } else if (!v.price_ID && !v.time_ID) {
          // Add new entries
          const newTime = await prisma.time_Of_Service.create({
            data: { quantity_of_days: Number(v.quantity_of_days), unit: v.unit },
          });

          const newPrice = await prisma.price_Exercise.create({
            data: {
              service_ID: id,
              time_ID: newTime.time_ID,
              price: Number(v.price),
            },
          });

          return { newTime, newPrice };
        } else {
          console.error("Invalid data structure for detail:", v);
          throw new Error("Invalid data structure for detail");
        }
      })
    );

    return NextResponse.json({ updatedService, updatedDetails }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}



