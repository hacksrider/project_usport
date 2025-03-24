import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // นับผู้ใช้ทั้งหมด
    const userCount = await prisma.users.count();

    // นับเฉพาะผู้ใช้ที่เป็น VIP
    const vipUserCount = await prisma.users.count({
      where: {
        status_of_VIP: true, // เงื่อนไขที่เพิ่มเข้ามา
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: userCount,
        vipUsers: vipUserCount,
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
