// import prisma from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   console.log("POST /api/buyingexercise called");
//   try {
//     const {
//       user_ID,
//       service_ID,
//       buying_date,
//       amount_of_time,
//       units,
//       desired_start_date,
//       expire_date,
//       Price,
//       payment_confirmation,
//       buying_status,
//       emp_ID
//     } = await request.json();

//     // Validate required fields
//     if (
//       !user_ID ||
//       !service_ID ||
//       !buying_date ||
//       !amount_of_time ||
//       !units ||
//       !desired_start_date ||
//       !expire_date ||
//       !Price ||
//       payment_confirmation == null ||
//       buying_status == null ||
//       !emp_ID
//     ) {
//       return NextResponse.json(
//         { error: "All fields are required" },
//         { status: 400 }
//       );
//     }

//     // Create new Buying Exercise record
//     const newBuyingExercise = await prisma.buying_exercise.create({
//       data: {
//         user_ID: parseInt(user_ID),
//         service_ID: parseInt(service_ID),
//         buying_date: new Date(buying_date),
//         amount_of_time,
//         units,
//         desired_start_date: new Date(desired_start_date),
//         expire_date: new Date(expire_date),
//         Price: parseFloat(Price),
//         payment_confirmation,
//         buying_status: Boolean(buying_status),
//         emp_ID: parseInt(emp_ID),
//       },
//     });

//     return NextResponse.json({ data: newBuyingExercise, msg: "success" }, { status: 200 });
//   } catch (error) {
//     console.error("Error saving Buying Exercise:", error);
//     return NextResponse.json(
//       { error: "Something went wrong: " + error },
//       { status: 500 }
//     );
//   }
// }


import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  console.log("POST /api/buyingexercise called");
  try {
    const formData = await request.formData();

    const user_ID = formData.get("user_ID")?.toString();
    const service_ID = formData.get("service_ID")?.toString();
    const buying_date = formData.get("buying_date")?.toString();
    const amount_of_time = formData.get("amount_of_time")?.toString();
    const units = formData.get("units")?.toString();
    const desired_start_date = formData.get("desired_start_date")?.toString();
    const expire_date = formData.get("expire_date")?.toString();
    const Price = formData.get("Price")?.toString();
    const payment_confirmation = formData.get("payment_confirmation");
    const buying_status = formData.get("buying_status")?.toString();
    const emp_ID = formData.get("emp_ID")?.toString();

    // Validate required fields
    if (
      !user_ID ||
      !service_ID ||
      !buying_date ||
      !amount_of_time ||
      !units ||
      !desired_start_date ||
      !expire_date ||
      !Price ||
      !payment_confirmation ||
      buying_status == null ||
      !emp_ID
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Ensure payment_confirmation is a File
    if (payment_confirmation instanceof File) {
      const buffer = Buffer.from(await payment_confirmation.arrayBuffer());
      const fileName = `payment_${Date.now()}_${user_ID}.jpg`;
      const filePath = path.join(process.cwd(), "public","account", fileName);

      await fs.writeFile(filePath, buffer);

      // Create new Buying Exercise record
      const newBuyingExercise = await prisma.buying_exercise.create({
        data: {
          user_ID: parseInt(user_ID),
          service_ID: parseInt(service_ID),
          buying_date: new Date(buying_date),
          amount_of_time,
          units,
          desired_start_date: new Date(desired_start_date),
          expire_date: new Date(expire_date),
          Price: parseFloat(Price),
          payment_confirmation: filePath,
          buying_status: Boolean(JSON.parse(buying_status)), // Ensure boolean conversion
          emp_ID: parseInt(emp_ID),
        },
      });

      return NextResponse.json(
        { data: newBuyingExercise, msg: "success" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid file format for payment confirmation" },
        { status: 400 }
      );
    }
  } catch (error) {
    // console.error("Error saving Buying Exercise:", error);
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}
