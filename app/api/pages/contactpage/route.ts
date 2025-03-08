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
    const subtitle = formData.get("subtitle")?.toString();
    const title_contact = formData.get("title_contact")?.toString();
    const subtitle_contact = formData.get("subtitle_contact")?.toString();
    const title_map = formData.get("title_map")?.toString();
    const link_map = formData.get("link_map")?.toString();

    const contactchanels = JSON.parse(
      formData.get("contactchanels")?.toString() || "[]"
    );

    const banner = formData.get("banner") as File | null;

    if (
      !title ||
      !subtitle ||
      !title_contact ||
      !subtitle_contact ||
      !title_map ||
      !link_map ||
      !banner
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const filePath = `account/${banner.name}`;
    const buffer = Buffer.from(await banner.arrayBuffer());
    await writeImageToPublic(banner.name, buffer);

    // ตรวจสอบว่ามีการส่งข้อมูล exercises มาหรือไม่
    const contactData = contactchanels.map((contactchanel: any) => ({
      name: contactchanel.name,
      data: contactchanel.data,
    }));

    const data = await prisma.page_contact.create({
      data: {
        title,
        subtitle,
        title_contact,
        subtitle_contact,
        title_map,
        link_map,
        banner: filePath,
        contact_channels: {
          create: contactData, // ส่งข้อมูล exercise_about ที่ปรับแล้ว
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
    // ดึงข้อมูลจากตาราง page_contact พร้อมกับข้อมูลที่เกี่ยวข้องใน contact_channels
    const data = await prisma.page_contact.findMany({
      include: {
        contact_channels: true, // ดึงข้อมูลจากตาราง contact_channels ที่เกี่ยวข้อง
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
    const page_contact_ID = parseInt(
      formData.get("page_contact_ID")?.toString() || "0"
    );
    const title = formData.get("title")?.toString();
    const subtitle = formData.get("subtitle")?.toString();
    const title_contact = formData.get("title_contact")?.toString();
    const subtitle_contact = formData.get("subtitle_contact")?.toString();
    const title_map = formData.get("title_map")?.toString();
    const link_map = formData.get("link_map")?.toString();
    const contactchannels = JSON.parse(
      formData.get("contactchannels")?.toString() || "[]"
    );

    const banner = formData.get("banner") as File | null;

    if (!page_contact_ID) {
      return NextResponse.json(
        { error: "Page ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      title,
      subtitle,
      title_contact,
      subtitle_contact,
      title_map,
      link_map,
    };

    if (banner) {
      const filePath = `account/${banner.name}`;
      const buffer = Buffer.from(await banner.arrayBuffer());
      await writeImageToPublic(banner.name, buffer);
      updateData.banner = filePath;
    }

    await prisma.page_contact.update({
      where: { page_contact_ID },
      data: updateData,
    });

    // Only process contact channels if explicitly included in the request
    if (formData.has("contactchannels")) {
      await prisma.contact_channels.deleteMany({ where: { page_contact_ID } });
      if (contactchannels.length > 0) {
        await prisma.contact_channels.createMany({
          data: contactchannels.map((contactchannel: any) => ({
            name: contactchannel.name,
            data: contactchannel.data,
            page_contact_ID: page_contact_ID,
          })),
        });
      }
    }

    return NextResponse.json(
      { message: "Updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}
