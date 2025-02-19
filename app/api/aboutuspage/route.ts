import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from "@prisma/client";
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

    if (!title || !detail || !detail_usport1 || !detail_usport2 || !banner || !video) {
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

    const data = await prisma.page_about.create({
      data: {
        title,
        detail,
        detail_usport1,
        detail_usport2,
        banner: filePath,
        video: filePath2,
        exercise_about: {
          create: exercises,
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

export async function PUT(request: Request) {
  try {
    const formData = await request.formData();
    const id = Number(formData.get("id"));
    const title = formData.get("title")?.toString();
    const detail = formData.get("detail")?.toString();
    const detail_usport1 = formData.get("detail_usport1")?.toString();
    const detail_usport2 = formData.get("detail_usport2")?.toString();
    const exercises = JSON.parse(formData.get("exercises")?.toString() || "[]");

    const data: Prisma.page_aboutUpdateInput = {
      title,
      detail,
      detail_usport1,
      detail_usport2,
      exercise_about: {
        deleteMany: {},
        create: exercises,
      },
    };

    const updateUser = await prisma.page_about.update({
      where: { page_about_id: id },
      data,
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

export async function GET() {
  try {
    const data = await prisma.page_about.findMany({
      include: { exercise_about: true },
    });
    return NextResponse.json({ data, msg: "success", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.page_about.delete({ where: { page_about_id: id } });
    return NextResponse.json({ msg: "Deleted successfully", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}
