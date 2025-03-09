/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOption } from "../auth/[...nextauth]/route";
import { updateOrderStatus } from "../utility/updateOrderStatus";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOption);
    // @ts-expect-error
    if (!session || !session.user)
      return NextResponse.json({ msg: "authen", status: 400 });
    const formData = await request.formData();

    const rawDataToCreate = formData.get("dataToCreate");
    const user_ID = formData.get("user_ID");
    const buying_date = formData.get("buying_date")?.toString();
    const payment_confirmation = formData.get("payment_confirmation");

    if (
      typeof rawDataToCreate !== "string" ||
      !user_ID ||
      !payment_confirmation
    ) {
      throw new Error(
        "dataToCreate must be a string or missing required fields"
      );
    }

    const dataToCreate = JSON.parse(rawDataToCreate);
    await dataToCreate.forEach(async (item: any) => {
      let priceReal: number = 0;

      const res = await prisma.service_of_exercise.findUnique({
        where: {
          service_ID: item.service_ID,
        },
        include: {
          time_and_price: true,
          buying_exercise: true,
        },
      });

      res?.time_and_price.sort(
        // @ts-expect-error
        (a, b) => b.quantity_of_days - a.quantity_of_days
      );
      let amount = parseInt(item.amount_of_time);

      res?.time_and_price.forEach((price: any) => {
        // @ts-expect-error
        if (parseInt(amount / price.quantity_of_days) > 0) {
          // @ts-expect-error
          let temp = parseInt(amount / price.quantity_of_days);
          priceReal += temp * price.price;
          amount = amount % price.quantity_of_days;
          console.log("==<<", priceReal);
        }
      });

      const users = await prisma.users.findUnique({
        where: {
          user_ID: Number(user_ID),
        },
      });

      if (users?.status_of_VIP === true) {
        item.Price = priceReal * 0.5;
      } else {
        item.Price = priceReal;
      }
    });

    let paymentFilePath: string | null = null;
    if (payment_confirmation instanceof File) {
      const buffer = Buffer.from(await payment_confirmation.arrayBuffer());
      const fileName = `payment_${Date.now()}.jpg`;
      paymentFilePath = path.join("", "account", fileName);
      await fs.writeFile(
        path.join(process.cwd(), "public", paymentFilePath),
        buffer
      );
    } else {
      return NextResponse.json(
        { error: "Invalid file format for payment confirmation" },
        { status: 400 }
      );
    }

    const createdBuying = await prisma.buying_exercise.create({
      data: {
        user_ID: Number(user_ID),
        payment_confirmation: paymentFilePath,
        buying_date: new Date(buying_date as string),
        buying_status: false,
        emp_ID: null,
      },
      include: { orders_exercise: true, users: true, employees: true },
    });

    const buying_ID = createdBuying.buying_ID;

    const ordersData = dataToCreate.map((entry: any) => ({
      buying_ID,
      service_ID: parseInt(entry.service_ID),
      service_name: entry.service_name,
      amount_of_time: entry.amount_of_time.toString(),
      units: entry.units,
      status_order: entry.status_order,
      desired_start_date: new Date(
        new Date(entry.desired_start_date).getTime()
      ),
      expire_date: new Date(new Date(entry.expire_date).getTime() - 7 * 60 * 60 * 1000),
      Price: parseFloat(entry.Price),
    }));

    const createdOrders = await prisma.orders_exercise.createMany({
      data: ordersData,
    });

    return NextResponse.json({
      data: { buying: createdBuying, orders: createdOrders },
      msg: "success",
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOption);
    // @ts-expect-error
    if (!session || !session.user)
      return NextResponse.json({ msg: "authen", status: 400 });
    // const par = await params;

    const buying = await prisma.buying_exercise.findMany({
      where: {
        // @ts-expect-error
        user_ID: parseInt(session.user.id),
      },
      include: { orders_exercise: true, users: true },
    });

    // const buying = await prisma.buying_exercise.find({
    //   where: { buying_ID: parseInt(par.id) },
    //   include: {
    //     orders_exercise: true,
    //     users: true,
    //     service_of_exercise: { include: { time_and_price: true } },
    //   },
    // });

    if (buying && buying.length > 0) {
      // อัปเดตสถานะของทุกออร์เดอร์
      for (const order of buying) {
        for (const orders of order.orders_exercise) {
          await updateOrderStatus(orders.order_ID);
          console.log("order_ID", orders.status_order);
        }
      }
    }

    return NextResponse.json({ data: buying, msg: "success", status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}
