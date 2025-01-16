import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  try {
    const {
      user_ID,
      service_ID,
      buying_date,
      amount_of_time,
      desired_start_date,
      expire_date,
      price,
      payment_confirmation,
      buying_status,
      emp_ID,
    } = await request.json();

    // Validate required fields
    if (
      !user_ID ||
      !service_ID ||
      !buying_date ||
      !amount_of_time ||
      !desired_start_date ||
      !expire_date ||
      !price ||
      !payment_confirmation ||
      buying_status === null ||
      buying_status === undefined ||
      !emp_ID
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Insert data into Buying_Exercise table
    const result = await prisma.buying_Exercise.create({
      data: {
        user_ID: Number(user_ID),
        service_ID: Number(service_ID),
        buying_date: new Date(buying_date),
        amount_of_time,
        desired_start_date: new Date(desired_start_date),
        expire_date: new Date(expire_date),
        Price: Number(price),
        payment_confirmation,
        buying_status: Boolean(buying_status),
        emp_ID: Number(emp_ID),
      },
    });

    return NextResponse.json({ result, msg: "Purchase saved successfully" }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}
