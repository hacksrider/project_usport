import prisma from "@/lib/db";
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
    } catch (error : any) {
        return Response.json("Error นะจ๊ะ :"+ error);
    }
}

// export async function GET() {
//     try {
//         const dataReview = await prisma.reviews_field.findMany();
//         return Response.json(dataReview);
//     } catch (error : any) {
//         return Response.json("Error นะจ๊ะ :"+ error);
//     }
// }