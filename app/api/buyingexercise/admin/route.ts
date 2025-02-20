/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOption } from "../../auth/[...nextauth]/route";
import { updateOrderStatus } from "../../utility/updateOrderStatus";

export async function GET() {
    console.log("GET /api/buyingexercise called");
    updateOrderStatus()
    try {
      const session = await getServerSession(authOption)
      // @ts-expect-error
      if(!session || !session.user)
        return NextResponse.json({msg: "authen", status: 400 });
      const buying = await prisma.buying_exercise.findMany({
        include:{ orders: true , users: true, service_of_exercise: true },
        orderBy: [
          {
            buying_status: "asc"
          },
          { 
            buying_date: "desc" ,
          },
          
        ],
      });
      console.log("test")
      return NextResponse.json({ data: buying, msg: "success", status: 200 });
    } catch (error) {
      // console.error("Error:", error);
      return NextResponse.json(
        { error: "Something went wrong: " + error },
        { status: 500 }
      );
    }
  }