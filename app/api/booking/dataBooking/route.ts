import prisma from "@/lib/db";
import { NextApiRequest, NextApiResponse } from 'next';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url); // สร้าง URL จาก req.url
    const field_ID = url.searchParams.get('field_ID');  // ดึงค่าจาก query parameter 'field_ID'

    // ตรวจสอบว่า field_ID มีค่าและไม่เป็น undefined
    if (field_ID === null || field_ID === undefined) {
      return NextResponse.json({ error: 'field_ID is required' }); // ถ้าไม่มีค่า field_ID ส่งข้อความผิดพลาด
    }

    // แปลงค่า field_ID เป็นตัวเลข
    const fieldIdNumber = Number(field_ID);

    // ตรวจสอบว่า fieldIdNumber เป็นตัวเลขที่ถูกต้อง
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
          !booking.user_ID ||
          !booking.field_ID ||
          !booking.booking_date ||
          !booking.desired_booking_date ||
          !booking.Price ||
          !booking.end_Time ||
          !booking.start_Time ||
          !booking.booking_status ||
          !booking.order_ID
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