import prisma from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url); // สร้าง URL จาก req.url
    const field_ID = url.searchParams.get('field_ID');  // ดึงค่าจาก query parameter 'field_ID'

    if (field_ID === null || field_ID === undefined) {
      return NextResponse.json({ error: 'field_ID is required' }); // ถ้าไม่มีค่า field_ID ส่งข้อความผิดพลาด
    }

    const fieldIdNumber = Number(field_ID);

    if (isNaN(fieldIdNumber)) {
      return NextResponse.json({ error: 'Invalid field_ID' }); // ถ้าแปลงไม่ได้ให้ส่งข้อความผิดพลาด
    }

    const dataFeild = await prisma.bookings.findMany({
      where: {
        field_ID: fieldIdNumber, // กรองข้อมูลจาก bookings ตาม field_ID
      },
      include: {
        fields: {
          include: {
            pricefield: true,
            }
          }
        }
      });
    return NextResponse.json(dataFeild);  
   } catch (error) {
        return Response.json(error); // ส่งข้อมูลกลับ // หากเกิดข้อผิดพลาด
    }
  }

  export async function POST(req: Request) {
    try {
      // รับข้อมูลจาก request
      const bookingData = await req.json();
      console.log("Received booking data:", bookingData);
  
      // ตรวจสอบว่า bookingData เป็น array หรือไม่
      if (!Array.isArray(bookingData)) {
        return new Response(
          JSON.stringify({ message: "Invalid data format. Expected an array." }),
          { status: 400 }
        );
      }
  
      for (const booking of bookingData) {
        if (
          booking.user_ID === 0  ||
          booking.field_ID === 0 ||
          booking.order_ID === 0
        ) {
          return new Response(
            JSON.stringify({ message: "Missing required fields." }),
            { status: 400 }
          );
        }
      }
      // บันทึกข้อมูลลงในฐานข้อมูล
      const result = await prisma.bookings.createMany({
        data: bookingData,
        skipDuplicates: true, // ข้ามข้อมูลที่ซ้ำ ถ้ามี
      });
  
      console.log("Successfully booked data:", result);
      return new Response(
        JSON.stringify({ message: "Success", data: result }),
        { status: 201 }
      );
    } catch (error) {
      console.error("Error occurred during booking:", error);
      return new Response(
         JSON.stringify({ message: "Error5555555555555"}),
        { status: 500 }
      );
    } finally {
      await prisma.$disconnect(); // ปิดการเชื่อมต่อกับ Prisma Client
    }
  }

  export async function PUT(req: Request) {
    const { searchParams } = new URL(req.url);
    const order_ID = searchParams.get('order_ID');
    const emp_ID = searchParams.get('emp_ID');
    const status = searchParams.get('status');

    if (!order_ID) {
      return NextResponse.json({ error: 'Missing order_ID' }, { status: 400 });
    }
    try {
      const updateBooking = await prisma.$transaction([
        prisma.bookings.updateMany({
          where: {
            order_ID: Number(order_ID),
          },
          data: {
            booking_status: status?.toString(),
          },
        }),
        prisma.order_Bookings.update({
          where:{
            order_ID: Number(order_ID),
          },
          data:{
            emp_ID: Number(emp_ID)
          }
        })
      ]);
      
      return NextResponse.json("อัปเดตแล้วจ้าาาา ข้อมูล : "+ updateBooking);
    } catch (error) {
      console.error('Error fetching booking:', error);
      return NextResponse.json({ error: 'Error fetching booking' }, { status: 500 });
    }
  }

  // export async function POST(req: Request) {
  //   try {
  //     const bookingData = await req.json(); 
  //     const result = await prisma.bookings.createMany({
  //       data: bookingData, // ข้อมูลที่เราต้องการบันทึก
  //       skipDuplicates: true, // ข้ามข้อมูลที่ซ้ำ ถ้ามี
  //     });
  //     console.log("Success booking data:", bookingData);
  //     return Response.json(bookingData);
  //   } catch (error) {
  //     return Response.json({ message: "Error", error }, { status: 500 });
  //   }
  // }

  // export default async function handler(
  //   req: NextApiRequest,
  //   res: NextApiResponse
  // ) {
  //   if (req.method === 'POST') {
  //     try {
  //       const {fieldId, userId, currentDate, bookingDate, startTime, endTime, price} = req.body;
  //       if (!fieldId ||!userId || !currentDate || !bookingDate || !startTime || !endTime || !price ) {
  //         return res.status(400).json({ error: 'Missing required fields' });
  //       }
  //       // สร้างการจองใหม่ในฐานข้อมูล
  //       const booking = await prisma.bookings.create({
  //         data: {
  //           field_ID: fieldId,
  //           user_ID :userId,
  //           booking_date :currentDate,
  //           desired_booking_date :bookingDate,
  //           start_Time:startTime,
  //           end_Time:endTime,
  //           Price: price ,// แปลง price เป็น float
  //           payment_confirmation:'n/a',
  //           booking_status:'Inspecting',
  //           emp_ID : 5
  //         },
  //       });
  //       // ส่ง response กลับ
  //       res.status(201).json({ message: 'Booking created successfully', booking });
  //     } catch (error) {
  //       console.error('Error creating booking:', error);
  //       res.status(500).json({ error: 'Failed to create booking' });
  //     }
  //   } else {
  //     res.setHeader('Allow', ['POST']);
  //     res.status(405).json({ error: `Method ${req.method} not allowed` });
  //   }
  // }