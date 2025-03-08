import prisma from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const { to } = await req.json();
  console.log("to ---> ", to);
  // ตรวจสอบว่ามีข้อมูลครบถ้วนหรือไม่
  if (!to) {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 }
    );
  }

  try {
    // ตั้งค่า SMTP Transporter
    // aqxw hchd rcgr xbtl รหัส app
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // ใช้ App Password ที่สร้างไว้
      },
    });
    console.log("transporter ---> ", transporter);
    // กำหนดรายละเอียดอีเมล
    const resetURL = `http://localhost:3000/pages/user/AAA/repassword/${to}`;

    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Reset Your Password",
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the button below to reset your password:</p>
        <a href="${resetURL}" 
           style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
    };
    // ส่งอีเมล
    console.log("mailOptions ---> ", mailOptions);

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "success" }, { status: 200 });
  } catch (error) {
    console.log("error ---> ", error);

    return NextResponse.json({ message: "error: " + error }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { email, password } = await request.json();
    const hashedPassword = await bcrypt.hash(password, 10);

    const updateUser = await prisma.users.update({
      where: { user_email: email },
      data: { user_password: hashedPassword },
    });

    return NextResponse.json({ data: updateUser, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}
