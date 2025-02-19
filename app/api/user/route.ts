import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import bcrypt from 'bcrypt';

async function writeImageToPublic(fileName: string, imageBuffer: Buffer) {
  const filePath = path.join(process.cwd(), "public", "account", fileName);
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true }); // สร้างโฟลเดอร์
    fs.writeFileSync(filePath, imageBuffer); // เขียนไฟล์
    // console.log("Image written successfully");
  } catch (err) {
    console.error("Error writing image:", err);
    throw new Error("Unable to write image");
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const user_name = formData.get("user_name")?.toString();
    const user_lastname = formData.get("user_lastname")?.toString();
    const user_date_of_birth = formData.get("user_date_of_birth")?.toString();
    const user_email = formData.get("user_email")?.toString();
    const user_tel = formData.get("user_tel")?.toString();
    const user_username = formData.get("user_username")?.toString();
    const user_password = formData.get("user_password")?.toString();
    const sex = formData.get("sex")?.toString();
    const status_of_VIP = formData.get("status_of_VIP")?.toString();
    const status_of_Member = formData.get("status_of_Member")?.toString();

    const ID_card_photo = formData.get("ID_card_photo") as File | null;
    const accom_rent_contrac_photo = formData.get("accom_rent_contrac_photo") as File | null;
    const user_profile_picture = formData.get("user_profile_picture") as File | null;

    // ตรวจสอบข้อมูลบังคับ
    if (
      !user_name ||
      !user_lastname ||
      !user_date_of_birth ||
      !user_tel ||
      !user_username ||
      !user_password ||
      !user_email ||
      !sex ||
      !ID_card_photo
    ) {
      return NextResponse.json(
        { error: "All required fields must be provided, including ID Card Photo" },
        { status: 400 }
      );
    }

    // เขียนไฟล์ลงใน Public Folder
    const filePath = `account/${ID_card_photo.name}`;
    const buffer = Buffer.from(await ID_card_photo.arrayBuffer());
    await writeImageToPublic(ID_card_photo.name, buffer);

    const filePath2 = accom_rent_contrac_photo
      ? `account/${accom_rent_contrac_photo.name}`
      : "";
    if (accom_rent_contrac_photo) {
      const buffer2 = Buffer.from(await accom_rent_contrac_photo.arrayBuffer());
      await writeImageToPublic(accom_rent_contrac_photo.name, buffer2);
    }

    const filePath3 = user_profile_picture
      ? `account/${user_profile_picture.name}`
      : "";
    if (user_profile_picture) {
      const buffer3 = Buffer.from(await user_profile_picture.arrayBuffer());
      await writeImageToPublic(user_profile_picture.name, buffer3);
    }
 const hashedPassword = await bcrypt.hash(user_password, 10);
    // บันทึกข้อมูลในฐานข้อมูล
    const data = await prisma.users.create({
      data: {
        user_name,
        user_lastname,
        user_date_of_birth: new Date(user_date_of_birth),
        user_tel,
        user_username,
        user_password: hashedPassword,
        status_of_VIP: status_of_VIP === "true",
        status_of_Member: status_of_Member === "false",
        user_email,
        sex,
        ID_card_photo: filePath,
        accom_rent_contrac_photo: filePath2,
        user_profile_picture: filePath3,
      },
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Unique constraint failed" },
          { status: 409 }
        );
      }
    }
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
    const user_ID = Number(formData.get("user_ID"));
    const user_name = formData.get("user_name")?.toString();
    const user_lastname = formData.get("user_lastname")?.toString();
    const user_tel = formData.get("user_tel")?.toString();

    const ID_card_photo = formData.get("ID_card_photo") as File | null;
    const accom_rent_contrac_photo = formData.get("accom_rent_contrac_photo") as File | null;
    const user_profile_picture = formData.get("user_profile_picture") as File | null;

    const filePath = ID_card_photo ? `account/${ID_card_photo.name}` : "";
    if (formData.get("isCardChange") === "true" && ID_card_photo) {
      const buffer = Buffer.from(await ID_card_photo.arrayBuffer());
      await writeImageToPublic(ID_card_photo.name, buffer);
    }

    const filePath2 = accom_rent_contrac_photo
      ? `account/${accom_rent_contrac_photo.name}`
      : "";
    if (formData.get("isContractChange") === "true" && accom_rent_contrac_photo) {
      const buffer2 = Buffer.from(await accom_rent_contrac_photo.arrayBuffer());
      await writeImageToPublic(accom_rent_contrac_photo.name, buffer2);
    }

    const filePath3 = user_profile_picture
      ? `account/${user_profile_picture.name}`
      : "";
    if (formData.get("isProfileChange") === "true" && user_profile_picture) {
      const buffer3 = Buffer.from(await user_profile_picture.arrayBuffer());
      await writeImageToPublic(user_profile_picture.name, buffer3);
    }

    // Initialize the data object with mandatory fields
    // eslint-disable-next-line prefer-const
    let data: Prisma.usersUpdateInput = {
      user_name,
      user_lastname,
      user_tel,
    };

    // Conditionally add the optional fields if changes are made
    if (formData.get("isCardChange") === "true" && filePath) {
      data.ID_card_photo = filePath;
    }
    if (formData.get("isContractChange") === "true" && filePath2) {
      data.accom_rent_contrac_photo = filePath2;
    }
    if (formData.get("isProfileChange") === "true" && filePath3) {
      data.user_profile_picture = filePath3;
    }

    // console.log("=========================");
    // console.log(data);

    const updateUser = await prisma.users.update({
      where: { user_ID },
      data: data
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
    const data = await prisma.users.findMany();
    return NextResponse.json({ data, msg: "success", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: `Something went wrong: ${error}` },
      { status: 500 }
    );
  }
}
