/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOption } from "../../auth/[...nextauth]/route";
import { updateOrderStatus } from "../../utility/updateOrderStatus";

export async function GET() {
  try {
    const session = await getServerSession(authOption);
    // @ts-expect-error
    if (!session || !session.user) {
      return NextResponse.json({ msg: "authen", status: 400 });
    }

    const buying = await prisma.buying_exercise.findMany({
      include: { orders_exercise: true, users: true, service_of_exercise: true },
      orderBy: [
        {
          buying_status: "asc",
        },
        { buying_date: "desc" },
      ],
    });

    // ตรวจสอบแต่ละออร์เดอร์และอัปเดตสถานะ
    for (const buy of buying) {
      for (const order of buy.orders_exercise) {
        await updateOrderStatus(order.order_ID);
      }
    }

    return NextResponse.json({ data: buying, msg: "success", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOption);
    // @ts-expect-error
    if (!session || !session.user) {
      return NextResponse.json({ msg: "authen", status: 400 });
    }

    const buying = await prisma.buying_exercise.delete({
      where: { buying_ID: parseInt(params.id) },
    });

    return NextResponse.json({ data: buying, msg: "success", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}