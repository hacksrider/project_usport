/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOption } from "../../../auth/[...nextauth]/route";
import { updateOrderStatus } from "@/app/api/utility/updateOrderStatus";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOption);
    // @ts-expect-error
    if (!session || !session.user)
      return NextResponse.json({ msg: "authen", status: 400 });

    const par = await params;
    const buying = await prisma.buying_exercise.findUnique({
      where: { buying_ID: parseInt(par.id) },
      include: { orders_exercise: true, users: true, employees: true },
    });

    if (buying && buying.orders_exercise.length > 0) {
      // อัปเดตสถานะของทุกออร์เดอร์
      for (const order of buying.orders_exercise) {
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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOption);
    // @ts-expect-error
    if (!session || !session.user)
      return NextResponse.json({ msg: "authen", status: 400 });

    const par = await params;

    const buyingUpdate = await prisma.buying_exercise.update({
      where: { buying_ID: parseInt(par.id) },
      include: { employees: true },
      data: {
        buying_status: true,
        // @ts-expect-error
        employees: { connect: { emp_ID: parseInt(session.user.id) } },
      },
    });

    const buying = await prisma.buying_exercise.findUnique({
      where: { buying_ID: parseInt(par.id) },
      include: {
        orders_exercise: true,
        users: true,
        service_of_exercise: { include: { time_and_price: true } },
      },
    });

    if (buying && buying.orders_exercise.length > 0) {
      // อัปเดตสถานะของทุกออร์เดอร์
      for (const order of buying.orders_exercise) {
        await updateOrderStatus(order.order_ID);
      }
    }

    return NextResponse.json({ data: buyingUpdate, msg: "Updated successfully", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOption);
    // @ts-expect-error
    if (!session || !session.user)
      return NextResponse.json({ msg: "authen", status: 400 });
    const par = await params;
    const buying = await prisma.buying_exercise.delete({
      where: { buying_ID: parseInt(par.id) },
    });

    return NextResponse.json({ data: buying, msg: "Deleted successfully", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}
