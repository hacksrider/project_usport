/* eslint-disable @typescript-eslint/ban-ts-comment */
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOption } from "../auth/[...nextauth]/route";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const rawDataToCreate = formData.get("dataToCreate");
    const user_ID = formData.get("user_ID");
    const buying_date = formData.get("buying_date")?.toString();
    const payment_confirmation = formData.get("payment_confirmation");

    if (
      typeof rawDataToCreate !== "string" ||
      !user_ID ||
      !payment_confirmation
    ) {
      throw new Error(
        "dataToCreate must be a string or missing required fields"
      );
    }

    const dataToCreate = JSON.parse(rawDataToCreate);

    let paymentFilePath: string | null = null;

    if (payment_confirmation instanceof File) {
      const buffer = Buffer.from(await payment_confirmation.arrayBuffer());
      const fileName = `payment_${Date.now()}.jpg`;
      paymentFilePath = path.join("", "account", fileName);
      await fs.writeFile(
        path.join(process.cwd(), "public", paymentFilePath),
        buffer
      );
    } else {
      return NextResponse.json(
        { error: "Invalid file format for payment confirmation" },
        { status: 400 }
      );
    }

    // สร้าง buying_exercise
    const createdBuying = await prisma.buying_exercise.create({
      data: {
        user_ID: Number(user_ID),
        payment_confirmation: paymentFilePath,
        buying_date: new Date(buying_date as string),
        buying_status: false,
        emp_ID: null,
      },
    });

    // console.log("Created buying_exercise:", createdBuying);

    const buying_ID = createdBuying.buying_ID;

    // เตรียมข้อมูลสำหรับตาราง order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ordersData = dataToCreate.map((entry: any) => ({
      buying_ID,
      service_ID: parseInt(entry.service_ID),
      service_name: entry.service_name,
      amount_of_time: entry.amount_of_time.toString(),
      units: entry.units,
      desired_start_date: new Date(entry.desired_start_date),
      expire_date: new Date(entry.expire_date),
      Price: parseFloat(entry.Price),
    }));

    // console.log("Orders to create:", ordersData);

    // บันทึกข้อมูลลงตาราง order
    const createdOrders = await prisma.orders_exercise.createMany({
      data: ordersData,
    });

    return NextResponse.json({
      data: { buying: createdBuying, orders: createdOrders },
      msg: "success",
      status: 200,
    });
  } catch (error) {
    // console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}

export async function GET() {
  // console.log("GET /api/buyingexercise called");
  try {
    const session = await getServerSession(authOption);
    // @ts-expect-error
    if (!session || !session.user)
      return NextResponse.json({ msg: "authen", status: 400 });
    const buying = await prisma.buying_exercise.findMany({
      where: {
        // @ts-expect-error
        user_ID: Number(session.user.id),
      },
      include: { orders_exercise: true, users: true },
    });
    return NextResponse.json({ data: buying, msg: "success", status: 200 });
  } catch (error) {
    // console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}
