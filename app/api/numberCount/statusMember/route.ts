import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT() {
  try {
    // ดึง users ทั้งหมดที่มีการซื้อบริการ
    const users = await prisma.users.findMany({
      include: {
        buying_exercise: {
          include: {
            orders_exercise: true, // ดึง orders_exercise ทุกอันที่เกี่ยวข้อง
          },
        },
      },
    });

    for (const user of users) {
      // ตรวจสอบว่ามี order_exercise ที่มี status_order เป็น "กำลังใช้งาน" หรือไม่
      const hasActiveOrder = user.buying_exercise.some((buying) =>
        buying.orders_exercise.some((order) => order.status_order === "กำลังใช้งาน")
      );

      // อัปเดตค่า status_of_Member ให้เป็น true ถ้ามี "กำลังใช้งาน" ถ้าไม่มีให้เป็น false
      await prisma.users.update({
        where: { user_ID: user.user_ID },
        data: { status_of_Member: hasActiveOrder },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Updated status_of_Member for all users",
    });
  } catch (error) {
    console.error("Error updating user membership status:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update user membership status",
      },
      { status: 500 }
    );
  }
}
