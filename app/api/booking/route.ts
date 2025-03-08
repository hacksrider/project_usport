import prisma from "@/lib/db";

export async function POST() {
    try {
      const dataFeild = await prisma.fields.findMany(); // ดึงข้อมูลจากฐานข้อมูล
      return Response.json(dataFeild); // ส่งข้อมูลกลับ
    } catch (error) {
        return Response.json("ไม่ถูกต้อง"); // ส่งข้อมูลกลับ // หากเกิดข้อผิดพลาด
    }
  }
export async function GET(req:Request) {
  try{
    const { searchParams } = new URL(req.url);
    const user_ID = searchParams.get('user_ID');
    const fetchdataOrder = await prisma.order_Bookings.findMany({
      where: {
        bookings: {
          some: {
            user_ID: Number(user_ID),
          },
        },
      },
      include: {
        bookings:{
          include:{
            fields:true
          }
        }
      },
    });
    return Response.json(fetchdataOrder); // ส่งข้อมูลกลับ // หากเกิดข้อผิดพลาด
  }catch (error : any) {
    return Response.json("ไม่ถูกต้อง" , error); // ส่งข้อมูลกลับ // หากเกิดข้อผิดพลาด
}
}

  