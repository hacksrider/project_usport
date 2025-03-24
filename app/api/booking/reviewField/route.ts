import prisma from "@/lib/db";
import { NextResponse } from "next/server";
export async function POST(req : Request) {
    try {
        const getData = await req.json();
        const dataReview = await prisma.reviews_field.create({
            data:{
                user_ID:getData.user_ID,
                field_ID:getData.field_ID,
                rating:getData.rating,
                comment:getData.comment
            }
        })
        return Response.json(dataReview);
    } catch (error) {
        return Response.json("Error นะจ๊ะ :"+ error);
    }
}


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const field_ID = searchParams.get("field_ID");

    if (field_ID && isNaN(Number(field_ID))) {
      return NextResponse.json(
        { error: "Invalid field_ID" },
        { status: 400 }
      );
    }

    const reviewCount = await prisma.reviews_field.count({
      where: field_ID ? { field_ID: Number(field_ID) } : {},
    });

    const data = await prisma.reviews_field.findMany({
      where: field_ID ? { field_ID: Number(field_ID) } : {},
      include: { user: true, field: true },
    });

    return NextResponse.json({ data: { reviewCount, data }, msg: "success", status: 200 });
  } catch (error) {
    console.error("Error in GET /reviews:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}


// export async function GET() {
//     try {
//         const reviewsWithUsersAndFields = await prisma.reviews_field.findMany({
//             include: {
//                 user: true,  // รวมข้อมูลจากตาราง users
//                 field: true, // รวมข้อมูลจากตาราง fields
//             }
//         });
        
//         return Response.json(reviewsWithUsersAndFields);
//     } catch (error) {
//         return Response.json("Error นะจ๊ะ: " + error);
//     }
// }
