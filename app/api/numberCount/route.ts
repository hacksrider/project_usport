import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // นับผู้ใช้ทั้งหมด

    // นับเฉพาะผู้ใช้ที่เป็น VIP
    const buyingCount = await prisma.buying_exercise.count({
      where: {
        buying_status: false, // เงื่อนไขที่เพิ่มเข้ามา
      },
    });
    const bookingCount = await prisma.bookings.count({
      where: {
        booking_status: "รอการตรวจสอบ", // เงื่อนไขที่เพิ่มเข้ามา
      },
    });
    const userVipCount = await prisma.users.count({
      where: {
        AND: [
          { accom_rent_contrac_photo: { not: null } }, // ไม่เป็น null
          { accom_rent_contrac_photo: { not: "" } }, // ไม่ใช่ค่าว่าง
          { status_of_VIP: false }, // ค่า VIP ต้องเป็น false
        ],
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        buying: buyingCount,
        booking: bookingCount,
        vip: userVipCount,
      },
    });
  } catch (error) {
    console.error("Error fetching user count:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch user count",
      },
      { status: 500 }
    );
  }
}
