import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { updateOrderStatus } from "../../utility/updateOrderStatus";


export async function GET(request: Request) {
    // console.log("GET /api/buyingexercise called");
    try {
      updateOrderStatus()
      const { searchParams } = new URL(request.url);
      const order_ID = searchParams.get("order_ID");
  
      if (!order_ID) {
        return NextResponse.json(
          { error: "Missing user_ID parameter" },
          { status: 400 }
        );
      }
  
      const data = await prisma.orders_exercise.findMany({
        where: { order_ID: Number(order_ID) },
        orderBy: { order_ID: "desc" },
        include: { buying_exercise: true,service_of_exercise: true },
      });
  
      return NextResponse.json({ data: data, status: 200, msg: "success id" });
    } catch (error) {
      console.error("Error fetching Buying Exercise:", error);
      return NextResponse.json(
        { error: "Something went wrong: " + error },
        { status: 500 }
      );
    }
  }

