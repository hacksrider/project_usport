import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { updateOrderStatus } from "../../utility/updateOrderStatus";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // รับค่า order_ID จาก query parameters
    const { searchParams } = new URL(request.url);
    const order_ID = searchParams.get("order_ID");

    if (!order_ID) {
      return NextResponse.json(
        { error: "Missing order_ID parameter" },
        { status: 400 }
      );
    }

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

    // เรียกใช้ฟังก์ชัน updateOrderStatus ก่อนดึงข้อมูล
    // await updateOrderStatus(Number(order_ID));

    // ดึงข้อมูลจากฐานข้อมูล
    const data = await prisma.orders_exercise.findMany({
      where: { order_ID: Number(order_ID) },
      orderBy: { order_ID: "desc" },
      include: {
        buying_exercise: true,
        service_of_exercise: { include: { time_and_price: true } },
      },
    });

    return NextResponse.json({ data: data, status: 200, msg: "success" });
  } catch (error) {
    console.error("Error fetching Buying Exercise:", error);
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}
