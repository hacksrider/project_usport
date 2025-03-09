// import { NextResponse } from 'next/server';
// import fs from 'fs';
// import path from 'path';

// export async function POST(request: Request) {
//   try {
//     // อ่านข้อมูลไฟล์จาก request
//     const formData = await request.formData();
//     const file = formData.get('file') as File;

//     if (!file) {
//       return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
//     }

//     // แปลงไฟล์เป็น Buffer
//     const buffer = Buffer.from(await file.arrayBuffer());

//     // กำหนดชื่อไฟล์และ path สำหรับบันทึก
//     const fileName = `payment-${Date.now()}-${file.name}`; // ตั้งชื่อไฟล์ใหม่
//     const filePath = path.join(process.cwd(), 'public', 'accountBacking', fileName);

//     // บันทึกไฟล์ลงในโฟลเดอร์ public/accountBacking
//     fs.writeFileSync(filePath, buffer);

//     // ส่ง response กลับไปยัง client
//     return NextResponse.json(
//       { message: 'File uploaded successfully!', filePath: `/accountBacking/${fileName}` },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Error uploading file:', error);
//     return NextResponse.json({ message: 'Failed to upload file' }, { status: 500 });
//   }
// }


import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.accountBank.findMany();
      //  const aaa = data.map((e)=>{
      //   return e.path_image_acc
      //  })
    console.log("ข้อมูลจากฐานข้อมูล:", data);
    return Response.json(data);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดนะจ๊ะ:", error);
  }
}

export async function POST(request: Request) {
  try {
    // อ่านข้อมูลไฟล์จาก request
    const url = new URL(request.url); // สร้าง URL จาก req.url
    const order_ID = Number (url.searchParams.get('order_ID'));

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
    }
    // แปลงไฟล์เป็น Buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    // กำหนดชื่อไฟล์และ path สำหรับบันทึก
    const fileName = `payment-${Date.now()}-${file.name}`; // ตั้งชื่อไฟล์ใหม่
    const filePath = path.join(process.cwd(), 'public', 'paymentBooking', fileName);

    // บันทึกไฟล์ลงในโฟลเดอร์ public/accountBacking
    fs.writeFileSync(filePath, buffer);

    // บันทึก path ของไฟล์ลงในฐานข้อมูลด้วย Prisma
    const updatedOrder = await prisma.order_Bookings.update({
      where: {
        order_ID: order_ID, // ใช้ orderId เพื่อค้นหา record ที่ต้องการอัปเดต
      },
      data: {
        payment_confirmation: `/paymentBooking/${fileName}`, // อัปเดต path ของไฟล์
      },
    });

    // ส่ง response กลับไปยัง client
    return NextResponse.json(
      {
        message: 'File uploaded successfully!',
        filePath: `/paymentBooking/${fileName}`,
        record: updatedOrder, // ส่งข้อมูลที่บันทึกลงฐานข้อมูลกลับไปด้วย
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ message: 'Failed to upload file' }, { status: 500 });
  }
}