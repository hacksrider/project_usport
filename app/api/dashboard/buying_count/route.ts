import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url, "http://localhost");
        const year = searchParams.get("year");
        console.log("API received year:", year);
        if (!year) {
            return NextResponse.json({ error: "Year parameter is required" }, { status: 400 });
        }
        const yearNum = parseInt(year, 10);
        if (isNaN(yearNum)) {
            return NextResponse.json({ error: "Invalid year format" }, { status: 400 });
        }
        const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
        const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
        const orders = await prisma.buying_exercise.findMany({
            where: {
                buying_date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                buying_date: true
            }
        });
        const monthlyCounts = Array(12).fill(0);
        orders.forEach(order => {
            const month = new Date(order.buying_date).getUTCMonth();
            monthlyCounts[month] += 1;
        });
        return NextResponse.json({ year: yearNum, monthlyCounts });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
