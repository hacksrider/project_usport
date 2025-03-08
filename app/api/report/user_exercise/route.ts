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
const allUsersWithPurchases = await prisma.users.findMany({
    include: {
      buying_exercise: {
        include: {
          orders_exercise: {
            select: {
              service_name: true,
            },
          },
        },
      },
    },
  });
  
  // Process the data to count the purchases per user and breakdown by service
  const reportData = allUsersWithPurchases.map((user) => {
    // Check if buying_exercise exists and it's an array
    const servicesPurchased = user.buying_exercise && Array.isArray(user.buying_exercise)
      ? user.buying_exercise.flatMap((buying) =>
          buying.orders_exercise ? buying.orders_exercise.map((order) => order.service_name) : []
        )
      : [];
  
    const serviceBreakdown: { [key: string]: number } = {};
  
    // Count how many times each service is purchased
    servicesPurchased.forEach((serviceName) => {
      serviceBreakdown[serviceName] = (serviceBreakdown[serviceName] || 0) + 1;
    });
  console.log(servicesPurchased.length)
    return {
      user_ID: user.user_ID,
      user_name: `${user.user_name} ${user.user_lastname}`,
      totalPurchases: servicesPurchased.length,
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
