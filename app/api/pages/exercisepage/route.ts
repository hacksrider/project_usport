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
    const banner = formData.get("banner") as File | null;
    const exerciseDataJson = formData.get("exerciseData")?.toString() || "[]";
    const exerciseData = JSON.parse(exerciseDataJson);

    if (!title || !subtitle || !banner) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const filePath = `account/${banner.name}`;
    const buffer = Buffer.from(await banner.arrayBuffer());
    await writeImageToPublic(banner.name, buffer);

    // Process exercise data items
    const exerciseDataItems = [];
    for (const item of exerciseData) {
      let bannerPath = "";
      let picturePath = "";

      // Handle banner image
      const itemBanner = formData.get(`banner_${item.name}`) as File | null;
      if (itemBanner) {
        bannerPath = `account/${itemBanner.name}`;
        const bannerBuffer = Buffer.from(await itemBanner.arrayBuffer());
        await writeImageToPublic(itemBanner.name, bannerBuffer);
      } else if (item.banner && typeof item.banner === "string") {
        bannerPath = item.banner.startsWith("account/")
          ? item.banner
          : `account/${item.banner}`;
      }

      // Handle picture image
      const itemPicture = formData.get(`picture_${item.name}`) as File | null;
      if (itemPicture) {
        picturePath = `account/${itemPicture.name}`;
        const pictureBuffer = Buffer.from(await itemPicture.arrayBuffer());
        await writeImageToPublic(itemPicture.name, pictureBuffer);
      } else if (item.picture && typeof item.picture === "string") {
        picturePath = item.picture.startsWith("account/")
          ? item.picture
          : `account/${item.picture}`;
      }

      exerciseDataItems.push({
        name: item.name,
        banner: bannerPath,
        price: item.price,
        detail: item.detail,
        table_price: item.table_price,
        picture: picturePath,
      });
    }

    const data = await prisma.page_exercise.create({
      data: {
        title,
        subtitle,
        banner: filePath,
        exercise_data: {
          create: exerciseDataItems,
        },
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const data = await prisma.page_exercise.findMany({
      include: {
        exercise_data: true,
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
    // console.log("formData", formData);
    const page_exercise_ID = parseInt(
      formData.get("page_exercise_ID")?.toString() || "0"
    );
    const title = formData.get("title")?.toString();
    const subtitle = formData.get("subtitle")?.toString();
    const banner = formData.get("banner") as File | null;
    const exerciseDataJson = formData.get("exerciseData")?.toString() || "[]";
    const exerciseData = JSON.parse(exerciseDataJson);
    // console.log("exerciseData",exerciseData);
    // console.log("exerciseDataJson",exerciseDataJson);
    if (!page_exercise_ID) {
      return NextResponse.json(
        { error: "Page Exercise ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      title,
      subtitle,
    };

    if (banner) {
      const filePath = `account/${banner.name}`;
      const buffer = Buffer.from(await banner.arrayBuffer());
      await writeImageToPublic(banner.name, buffer);
      updateData.banner = filePath;
    }

    await prisma.page_exercise.update({
      where: { page_exercise_ID },
      data: updateData,
    });

    // Handle exercise_data updates
    await prisma.exercise_data.deleteMany({
      where: { page_exercise_ID },
    });

    if (exerciseData.length > 0) {
      const exerciseDataItems = [];

      for (const item of exerciseData) {
        let bannerPath = "";
        let picturePath = "";

        // Check if banner is a File object in formData
        const itemBanner = formData.get(`banner_${item.name}`) as File | null;
        if (itemBanner) {
          bannerPath = `account/${itemBanner.name}`;
          const bannerBuffer = Buffer.from(await itemBanner.arrayBuffer());
          await writeImageToPublic(itemBanner.name, bannerBuffer);
        } else if (item.banner && typeof item.banner === "string") {
          bannerPath = item.banner.startsWith("account/")
            ? item.banner
            : `account/${item.banner}`;
        }
        // console.log("banner", itemBanner);

        // Check if picture is a File object in formData
        const itemPicture = formData.get(`picture_${item.name}`) as File | null;
        if (itemPicture) {
          picturePath = `account/${itemPicture.name}`;
          const pictureBuffer = Buffer.from(await itemPicture.arrayBuffer());
          await writeImageToPublic(itemPicture.name, pictureBuffer);
        } else if (item.picture && typeof item.picture === "string") {
          picturePath = item.picture.startsWith("account/")
            ? item.picture
            : `account/${item.picture}`;
        }

        exerciseDataItems.push({
          name: item.name,
          banner: bannerPath,
          price: item.price,
          detail: item.detail,
          table_price: item.table_price,
          picture: picturePath,
          page_exercise_ID,
        });
        // console.log("123", exerciseDataItems);
      }

      await prisma.exercise_data.createMany({
        data: exerciseDataItems,
      });
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
