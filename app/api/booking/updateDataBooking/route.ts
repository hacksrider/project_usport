import { NextResponse } from 'next/server';
//import { Request, Response } from 'express';

import prisma from '@/lib/db'; 
import { get } from 'http';
import e from 'express';

// export async function get(req :Request){
//     try{
//         const { searchParams } = new URL(req.url);
//         const order_ID = searchParams.get('order_ID');
//         const databooking = await prisma.bookings.findMany({
//           where: {
//             order_ID: Number(order_ID) 
//           }
//         })
//         return Response.json(databooking);
//     }catch(error) {
//       console.error(error);
//       return Response.json({ error: 'Internal Server Error' });
//     }
        
// }


export async function POST(req :Request){
  try {
    const { user_name, user_lastname, user_tel } = await req.json();
    if (!user_name || !user_lastname || !user_tel) {
      return NextResponse.json(
        { error: "Missing required fields: user_name, user_lastname, or user_tel" },
        { status: 400 }
      );
    }
    const newUser = await prisma.users.create({
      data: {
        user_name,
        user_lastname,
        user_tel,
        type_of_user:'external'
      }
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(req :Request){
    try{
        const { searchParams } = new URL(req.url);
        const order_ID = searchParams.get('order_ID');
        if (!order_ID) {
            return new Response('order_ID is required', { status: 400 });
          }
          // ลบข้อมูลในทั้งสองตาราง (bookings และ order_bookings)
          await prisma.$transaction([
            // ลบข้อมูลในตาราง bookings
            prisma.bookings.deleteMany({
              where: {
                order_ID: Number(order_ID),
              },
            }),
            // ลบข้อมูลในตาราง order_bookings
            prisma.order_Bookings.deleteMany({
              where: {
                order_ID: Number(order_ID),
              },
            }),
          ]);
          // ส่งข้อความตอบกลับว่าได้ลบข้อมูลเรียบร้อยแล้ว
          return new Response('ลบข้อมูลเรียบร้อยแล้ว', { status: 200 });
    } catch (error) {
        console.error('Error deleting data:', error);
        return new Response('เกิดข้อผิดพลาดในการลบข้อมูล', { status: 500 });
      }
}

export async function PUT(req: Request) {
  try{
         const getdata = await req.json();
         const caseWork = getdata[0].case_type;
         const  count = getdata.length ;
      if (caseWork === 'c1') {
           for (let i = 0; i < count; i++) {
            await prisma.bookings.update({
              where: {
                booking_ID: getdata[i].booking_ID,
              },
              data:{
                    Price: getdata[i].Price,
                    booking_status: 'chenged',
                    desired_booking_date: getdata[i].desired_booking_date,
                    end_Time: getdata[i].end_Time,
                    start_Time: getdata[i].start_Time,
                    field_ID: getdata[i].field_ID,
                    user_ID: getdata[i].user_ID,
                }
            })
           }
          await prisma.order_Bookings.update({
            where : {
              order_ID: getdata[0].order_ID,
            },
            data:{
              totalprice: getdata[0].totalPriceForOrder
            }
           })
    } else if(caseWork === 'c3'){
      const upStatusBooking = await prisma.bookings.updateMany({
        where :{
          order_ID : getdata[0].order_ID,
        },
        data :{
          booking_status: 'chenged',
        }
      })
      // const result = await prisma.bookings.createMany({
      //   data: getdata,
      //   skipDuplicates: true, // ข้ามข้อมูลที่ซ้ำ ถ้ามี
      // });
    }
    return Response.json({ message: 'update data is successfully' });
  } catch (error) {
    console.error('Error updating bookings:', error);
    return Response.json({ error: 'Internal Server Error' });
  }
}


 // for (const booking of dataUp) {
    //   await prisma.bookings.update({
    //     where: {
    //       booking_ID: booking.booking_ID, // ใช้ booking_ID เพื่อค้นหาเรคคอร์ด
    //     },
    //     data: {
    //       Price: booking.Price,
    //       booking_date: booking.booking_date,
    //       booking_status: booking.booking_status,
    //       desired_booking_date: booking.desired_booking_date,
    //       end_Time: booking.end_Time,
    //       start_Time: booking.start_Time,
    //       field_ID: booking.field_ID,
    //       user_ID: booking.user_ID,
    //     },
    //   });
    //   console.log(`Updated booking with ID ${booking.booking_ID}`);
    // }
    // // ส่งผลลัพธ์กลับ