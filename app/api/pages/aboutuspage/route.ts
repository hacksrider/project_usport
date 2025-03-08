/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const prisma = new PrismaClient();

async function writeImageToPublic(fileName: string, imageBuffer: Buffer) {
  const filePath = path.join(process.cwd(), "public", "account", fileName);
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, imageBuffer);
  } catch (err) {
    console.error("Error writing image:", err);
    throw new Error("Unable to write image");
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title")?.toString();
    const detail = formData.get("detail")?.toString();
    const detail_usport1 = formData.get("detail_usport1")?.toString();
    const detail_usport2 = formData.get("detail_usport2")?.toString();
    const exercises = JSON.parse(formData.get("exercises")?.toString() || "[]");

    const banner = formData.get("banner") as File | null;
    const video = formData.get("video") as File | null;

    if (
      !title ||
      !detail ||
      !detail_usport1 ||
      !detail_usport2 ||
      !banner ||
      !video
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const filePath = `account/${banner.name}`;
    const buffer = Buffer.from(await banner.arrayBuffer());
    await writeImageToPublic(banner.name, buffer);

    const filePath2 = video ? `account/${video.name}` : "";
    if (video) {
      const buffer2 = Buffer.from(await video.arrayBuffer());
      await writeImageToPublic(video.name, buffer2);
    }

    // ตรวจสอบว่ามีการส่งข้อมูล exercises มาหรือไม่
    const exerciseData = exercises.map((exercise: any) => ({
      title: exercise.title, // กำหนด title ที่ต้องการ
      detail: exercise.detail, // กำหนด detail ที่ต้องการ
    }));

    const data = await prisma.page_about.create({
      data: {
        title,
        detail,
        detail_usport1,
        detail_usport2,
        banner: filePath,
        video: filePath2,
        exercise_about: {
          create: exerciseData, // ส่งข้อมูล exercise_about ที่ปรับแล้ว
        },
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    // ดึงข้อมูลจากตาราง page_about พร้อมกับข้อมูลที่เกี่ยวข้องใน exercise_about
    const data = await prisma.page_about.findMany({
      include: {
        exercise_about: true, // ดึงข้อมูลจากตาราง exercise_about ที่เกี่ยวข้อง
      },
    });

    // ส่งข้อมูลกลับในรูปแบบ JSON
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const page_about_id = parseInt(formData.get("page_about_id")?.toString() || "0");
    const title = formData.get("title")?.toString();
    const detail = formData.get("detail")?.toString();
    const detail_usport1 = formData.get("detail_usport1")?.toString();
    const detail_usport2 = formData.get("detail_usport2")?.toString();
    const exercises = JSON.parse(formData.get("exercises")?.toString() || "[]");

    const banner = formData.get("banner") as File | null;
    const video = formData.get("video") as File | null;

    if (!page_about_id) {
      return NextResponse.json(
        { error: "Page ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      title,
      detail,
      detail_usport1,
      detail_usport2,
    };

    if (banner) {
      const filePath = `account/${banner.name}`;
      const buffer = Buffer.from(await banner.arrayBuffer());
      await writeImageToPublic(banner.name, buffer);
      updateData.banner = filePath;
    }

    if (video) {
      const filePath2 = `account/${video.name}`;
      const buffer2 = Buffer.from(await video.arrayBuffer());
      await writeImageToPublic(video.name, buffer2);
      updateData.video = filePath2;
    }

    await prisma.page_about.update({
      where: { page_about_id },
      data: updateData,
    });

    // จัดการข้อมูล exercises
    await prisma.exercise_about.deleteMany({ where: { page_about_id } });
    if (exercises.length > 0) {
      await prisma.exercise_about.createMany({
        data: exercises.map((exercise: any) => ({
          title: exercise.title,
          detail: exercise.detail,
          page_about_id,
        })),
      });
    }

    return NextResponse.json({ message: "Updated successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}


