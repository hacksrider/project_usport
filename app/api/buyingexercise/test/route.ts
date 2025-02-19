import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOption } from "../../auth/[...nextauth]/route";


export async function GET() {
  try {
    // const { searchParams } = new URL(request.url);
    const session = await getServerSession(authOption)
    // console.log(session)
    // Fetch buying_exercise IDs associated with the user
    const buyingExercises = await prisma.buying_exercise.findMany({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      where: { user_ID: Number(session?.users.user_ID) },
      include:{ orders_exercise: true , users: true },
      
    });

    if (!buyingExercises.length) {
      return NextResponse.json(
        { error: "No orders found for this user", data: [] },
        { status: 404 }
      );
    }

    const buyingIDs = buyingExercises.map((exercise) => exercise.buying_ID);

    // Fetch orders associated with the buying_exercise IDs
    const data = await prisma.orders_exercise.findMany({
      where: { buying_ID: { in: buyingIDs } },
      include: { buying_exercise: true },
      orderBy: { order_ID: "desc" },
    });

    return NextResponse.json({ data: data, status: 200, msg: "success" });
  } catch (error) {
    // console.error("Error fetching Buying Exercise:", error);
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}
