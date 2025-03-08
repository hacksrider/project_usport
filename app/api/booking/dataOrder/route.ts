import prisma from "@/lib/db";

export async function GET() {
  try {
    const fetchdataOrder = await prisma.order_Bookings.findMany({
      include: {
        bookings: {
          select: {
            booking_ID: true,
            users: {
              select: {
                user_ID: true,
                user_name: true,
                user_lastname: true,
                type_of_user: true,
              },
            },
            fields: {
              select: {
                field_ID:true,
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

    // เรียงลำดับข้อมูล
    const sortedData = fetchdataOrder.sort((a, b) => {
      const statusA = a.bookings[0]?.booking_status; // เข้าถึง booking_status ของ bookings ตัวแรก
      const statusB = b.bookings[0]?.booking_status; // เข้าถึง booking_status ของ bookings ตัวแรก
    
      // กำหนดลำดับของสถานะ
      const statusOrder = {
        "รอการตรวจสอบ": 1,
        "ถูกเปลี่ยนแปลง": 2,
        "เกินกำหนดจ่ายเงิน": 3,
        "จองสำเร็จ": 4,
        "ไม่อนุมัติ": 5,
      };
    
      // ตรวจสอบว่า statusA และ statusB เป็น key ของ statusOrder
      if (statusA && statusB && statusOrder[statusA as keyof typeof statusOrder] < statusOrder[statusB as keyof typeof statusOrder]) {
        return -1; // statusA มาก่อน statusB
      } else if (statusA && statusB && statusOrder[statusA as keyof typeof statusOrder] > statusOrder[statusB as keyof typeof statusOrder]) {
        return 1; // statusB มาก่อน statusA
      } else {
        // ถ้าสถานะเดียวกัน ให้เรียงตาม booking_ID จากน้อยไปมาก
        // return a.bookings[0]?.booking_ID - b.bookings[0]?.booking_ID ;
        return b.order_ID - a.order_ID   ;
      }
    });

    return Response.json(sortedData);
  } catch (error) {
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