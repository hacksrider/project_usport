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
    updateOrderStatus()
    const session = await getServerSession(authOption);
    // @ts-expect-error
    if (!session || !session.user)
      return NextResponse.json({ msg: "authen", status: 400 });
    const par = await params;
    const buying = await prisma.buying_exercise.findUnique({
      where: { buying_ID: parseInt(par.id) },
      include: { orders_exercise: true, users: true },
    });

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
  const par = await params;
  try {
    updateOrderStatus()
    const buyingUpdate = await prisma.buying_exercise.update({
      where: { buying_ID: parseInt(par.id) },
      data: { buying_status: true },
    })


    const buying = await prisma.buying_exercise.findUnique({
      where: { buying_ID: parseInt(par.id) },
      include: { orders_exercise: true, users: true },
    });

    if (!buying || !buyingUpdate) {
      return NextResponse.json({ msg: "not found", status: 404 });
    }

    const currentDate = new Date();
    const shouldBeMember = buying.orders_exercise.some(
      (order) =>{
        // console.log(order)
        return new Date(order.desired_start_date) <= currentDate &&
        currentDate <= new Date(order.expire_date)}
    );

    if (shouldBeMember) {
      await prisma.orders_exercise.updateMany({
        where: { buying_ID: parseInt(par.id) },
        data: { status_order: 1 },
      });
    }

    return NextResponse.json({ msg: "Updated successfully", status: 200 });
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
    const par = await params;
    await prisma.buying_exercise.delete({
      where: { buying_ID: parseInt(par.id) },
    });
    return NextResponse.json({ msg: "Deleted successfully", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}
