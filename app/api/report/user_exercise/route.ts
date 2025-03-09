/* eslint-disable @typescript-eslint/ban-ts-comment */
import prisma from "@/lib/db"; // Make sure to configure Prisma client correctly
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOption } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOption);
    // @ts-expect-error
    if (!session || !session.user)
      return NextResponse.json({ msg: "authen", status: 400 });
    // @ts-expect-error
    const userId = session.user.id;

    if (!userId) {
      return new Response("User ID is required", { status: 400 });
    }

    // Fetch all users with their buying exercises and orders
    // API part
    // API part - fetch users with their buying exercises and orders
// API part - fetch users with their buying exercises and orders
const allUsersWithPurchases = await prisma.users.findMany({
  include: {
    buying_exercise: {
      include: {
        orders_exercise: {
          select: {
            service_name: true,
            Price: true, // Add Price field to the selection
          },
        },
      },
    },
  },
});

// Process the data to count the purchases per user and breakdown by service
// คำนวณจำนวนการซื้อจากตาราง buying_exercise แทนการนับจำนวนบริการที่ซื้อ
const reportData = allUsersWithPurchases.map((user) => {
  // นับจำนวนการซื้อจากตาราง buying_exercise
  const totalPurchases = user.buying_exercise ? user.buying_exercise.length : 0;

  // ประมวลผลคำสั่งซื้อของผู้ใช้
  const userOrders = user.buying_exercise && Array.isArray(user.buying_exercise)
    ? user.buying_exercise.flatMap((buying) =>
        buying.orders_exercise ? buying.orders_exercise : []
      )
    : [];

  // ดึงชื่อบริการที่ซื้อ
  const servicesPurchased = userOrders.map(order => order.service_name);
  
  // คำนวณยอดรวมของราคา
  const totalPrice = userOrders.reduce((sum, order) => sum + (order.Price || 0), 0);
  
  const serviceBreakdown: { [key: string]: number } = {};

  // นับจำนวนครั้งที่แต่ละบริการถูกซื้อ
  servicesPurchased.forEach((serviceName) => {
    serviceBreakdown[serviceName] = (serviceBreakdown[serviceName] || 0) + 1;
  });

  return {
    user_ID: user.user_ID,
    user_name: `${user.user_name} ${user.user_lastname}`,
    totalPurchases: totalPurchases, // เปลี่ยนให้เป็นการนับจาก buying_exercise
    totalPrice: totalPrice, // เพิ่มราคาโดยรวมไปในผลลัพธ์
    serviceBreakdown,
  };
});
 

    return new Response(JSON.stringify(reportData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
