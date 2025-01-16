import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/db"; 
import { writeFile } from "fs/promises";
import path from "path";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await the params object to extract the ID
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
    }

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
      where: { user_ID: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}


export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    // Await the params to extract the ID
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
    }

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const formData = await request.formData();

    const user_name = formData.get("user_name")?.toString();
    const user_lastname = formData.get("user_lastname")?.toString();
    const user_date_of_birth = formData.get("user_date_of_birth")?.toString();
    const user_email = formData.get("user_email")?.toString();
    const user_tel = formData.get("user_tel")?.toString();
    const user_username = formData.get("user_username")?.toString();
    const status_of_VIP = formData.get("status_of_VIP") === "true";
    const isAccomPhotoDeleted = formData.get("isAccomPhotoDeleted") === "true";

    const uploadDir = path.join(process.cwd(), "public/account");

    const saveFile = async (file: File | null) => {
      if (file && typeof file.arrayBuffer === "function") {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filePath = `${uploadDir}/${file.name}`;
        await writeFile(filePath, buffer);
        return `account/${file.name}`;
      }
      return null;
    };

    const ID_card_photo = await saveFile(formData.get("ID_card_photo") as File);
    let accom_rent_contrac_photo;

    if (isAccomPhotoDeleted) {
      accom_rent_contrac_photo = null;
    } else {
      accom_rent_contrac_photo = await saveFile(formData.get("accom_rent_contrac_photo") as File);
    }

    const user_profile_picture = await saveFile(formData.get("user_profile_picture") as File);

    const updatedUser = await prisma.users.update({
      where: { user_ID: userId },
      data: {
        user_name,
        user_lastname,
        user_date_of_birth: user_date_of_birth ? new Date(user_date_of_birth) : undefined,
        user_email,
        user_tel,
        user_username,
        status_of_VIP,
        ID_card_photo: ID_card_photo || undefined,
        accom_rent_contrac_photo: accom_rent_contrac_photo,
        user_profile_picture: user_profile_picture || undefined,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}


export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
    }

    const userId = parseInt(id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
    }

    const service = await prisma.users.delete({
      where: { user_ID: userId },
    });

    return NextResponse.json({ msg: `Deleted user with ID: ${service.user_ID}` });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(e.code, e.message);
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
