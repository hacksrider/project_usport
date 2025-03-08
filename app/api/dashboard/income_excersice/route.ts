import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    // คำนวณผลรวมของ Price จากตาราง orders_exercise
    const totalRevenue = await prisma.orders_exercise.aggregate({
      _sum: {
        Price: true,
      },
    });

    return NextResponse.json({
      success: true,
      totalRevenue: totalRevenue._sum.Price || 0, // ถ้าไม่มีค่า ให้คืน 0
    });
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch revenue",
      },
      { status: 500 }
    );
  }
};
