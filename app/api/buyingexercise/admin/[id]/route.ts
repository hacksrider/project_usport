/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOption } from "../../../auth/[...nextauth]/route";
import { updateOrderStatus } from "@/app/api/utility/updateOrderStatus";
import { updateUserMembershipStatus } from "@/app/api/utility/updateUserMembershipStatus ";

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

    if (buying) {
      // อัปเดตสถานะของทุกออร์เดอร์
      if (buying.orders_exercise && buying.orders_exercise.length > 0) {
        for (const order of buying.orders_exercise) {
          await updateOrderStatus(order.order_ID);
        }
      }
      
      // อัปเดตสถานะ membership ของผู้ใช้ (ทำทุกครั้ง)
      if (buying.user_ID) {
        await updateUserMembershipStatus(buying.user_ID);
      }
    }

    return NextResponse.json({ data: buying, msg: "success", status: 200 });
  } catch (error) {
    console.error("GET error:", error);
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

    if (buying) {
      // อัปเดตสถานะของทุกออร์เดอร์
      if (buying.orders_exercise && buying.orders_exercise.length > 0) {
        for (const order of buying.orders_exercise) {
          await updateOrderStatus(order.order_ID);
        }
      }
      
      // อัปเดตสถานะ membership ของผู้ใช้ (ทำทุกครั้ง)
      if (buying.user_ID) {
        await updateUserMembershipStatus(buying.user_ID);
      }
    }

    return NextResponse.json({ data: buyingUpdate, msg: "Updated successfully", status: 200 });
  } catch (error) {
    console.error("PUT error:", error);
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
    
    // เก็บ user_ID ก่อนลบ buying record
    const buying = await prisma.buying_exercise.findUnique({
      where: { buying_ID: parseInt(par.id) },
      select: { user_ID: true }
    });
    
    const user_ID = buying?.user_ID;
    
    // ลบ buying record
    const deletedBuying = await prisma.buying_exercise.delete({
      where: { buying_ID: parseInt(par.id) },
    });
    
    // อัปเดตสถานะ membership ของผู้ใช้หลังจากลบ
    if (user_ID) {
      // console.log(`After DELETE: updating membership status for user ${user_ID}`);
      await updateUserMembershipStatus(user_ID);
    }

    return NextResponse.json({ data: deletedBuying, msg: "Deleted successfully", status: 200 });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}