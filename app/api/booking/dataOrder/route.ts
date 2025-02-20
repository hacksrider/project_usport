import prisma from "@/lib/db";

export async function GET() {
  try{
    const fetchdataOrder = await prisma.order_Bookings.findMany({
      include: {
        bookings: {
          select: {
            booking_ID: true, // ระบุให้คืนค่า booking_ID
            users: {
              select: {
                user_ID:true,
                user_name: true,
                user_lastname: true,
                type_of_user: true,
              },
            },
            fields: {
              select: {
                field_name: true,
              },
            },
            booking_date: true,
            desired_booking_date: true,
            end_Time: true,
            start_Time: true,
            booking_status: true,
            Price: true,
          },
        },
      },
    });
        return Response.json(fetchdataOrder);
  }catch{
    return Response.json("เกิดข้อผิดพลาดในการดึงข้อมูลการจองสนาม");
  }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        console.log(data)
        if(data){
            const insertOderTB = await  prisma.order_Bookings.create({
              data:{
                totalprice:data.totalprice,
                payment_confirmation:data.payment_confirmation,
                emp_ID:data.emp_ID
              },
            })
            return Response.json(insertOderTB.order_ID);
        }else{
            return Response.json("ไม่มีข้อมูล");
        } 
    } catch (error) {
      console.error('Error occurred:', error);
      return Response.json({ message: 'An error occurred during the request.' });
    } finally {
      //await prisma.$disconnect();
    }
}