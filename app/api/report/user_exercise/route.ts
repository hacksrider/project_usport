/* eslint-disable @typescript-eslint/ban-ts-comment */
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOption } from "../../auth/[...nextauth]/route";

export async function GET(request: Request) {
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

    // รับพารามิเตอร์ date จาก URL query
    const { searchParams } = new URL(request.url);
    const dateStart = searchParams.get("dateStart");
    const dateEnd = searchParams.get("dateEnd");
    
    // กำหนดเงื่อนไขการค้นหา
    let dateFilter = {};
    
    // ถ้ามีการระบุวันที่เริ่มต้นและวันที่สิ้นสุด
    if (dateStart && dateEnd) {
      dateFilter = {
        buying_date: {
          gte: new Date(dateStart),
          lte: new Date(`${dateEnd}T23:59:59`), // เพิ่มเวลา 23:59:59 เพื่อให้ครอบคลุมทั้งวัน
        }
      };
    }

    // ดึงข้อมูลผู้ใช้ทั้งหมดพร้อมข้อมูลการซื้อ
    const allUsersWithPurchases = await prisma.users.findMany({
      include: {
        buying_exercise: {
          where: dateFilter,
          include: {
            orders_exercise: {
              select: {
                service_name: true,
                Price: true,
              },
            },
          },
        },
      },
    });

    // ดึงข้อมูลทุกบริการที่มีในระบบ เพื่อให้แน่ใจว่าจะแสดงทุกบริการในรายงานแม้ไม่มีข้อมูลการซื้อ
    const allServices = await prisma.orders_exercise.findMany({
      distinct: ['service_name'],
      select: {
        service_name: true
      }
    });
    
    // สร้างรายการชื่อบริการทั้งหมด
    const allServiceNames = allServices.map(service => service.service_name);

    // ประมวลผลข้อมูลเพื่อนับการซื้อต่อผู้ใช้และแบ่งตามบริการ
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
      
      // เริ่มต้นด้วย serviceBreakdown ที่มีทุกบริการและค่าเป็น 0
      const serviceBreakdown: { [key: string]: number } = {};
      allServiceNames.forEach(serviceName => {
        serviceBreakdown[serviceName] = 0;
      });

      // นับจำนวนครั้งที่แต่ละบริการถูกซื้อ
      servicesPurchased.forEach((serviceName) => {
        serviceBreakdown[serviceName] = (serviceBreakdown[serviceName] || 0) + 1;
      });

      return {
        user_ID: user.user_ID,
        user_name: `${user.user_name} ${user.user_lastname}`,
        totalPurchases: totalPurchases,
        totalPrice: totalPrice,
        serviceBreakdown,
        // ส่งข้อมูล buying_exercise เพื่อให้ client สามารถแสดงวันที่ได้หากต้องการ
        buying_exercise: user.buying_exercise,
      };
    });

    // ส่งรายชื่อบริการทั้งหมดพร้อมกับข้อมูลรายงาน
    return new Response(JSON.stringify({
      reportData,
      allServiceNames
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}