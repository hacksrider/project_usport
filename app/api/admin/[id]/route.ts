import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id); // No await needed
    const admin = await prisma.employees.delete({
      where: {
        emp_ID: id,
      },
    });
    return NextResponse.json({ msg: "delete service: " + admin.emp_ID });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      console.log(e.code);
      console.log(e.message);
    }
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id); // No await needed
    const data = await prisma.employees.findUnique({
      where: {
        emp_ID: id,
      },
      include: {
        buying_exercise: true,
        bookings: true,
      },
    });
    return NextResponse.json({ data: data, msg: "success", status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id); // No await needed

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID parameter" },
        { status: 400 }
      );
    }

    const { emp_name, emp_lastname, emp_sex, emp_tel, emp_username, emp_password } = await request.json();

    if (!emp_name || !emp_lastname || emp_sex == null || !emp_tel || !emp_username || !emp_password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const updatedAdmin = await prisma.employees.update({
      where: { emp_ID: id },
      data: {
        emp_name,
        emp_lastname,
        emp_sex,
        emp_tel,
        emp_username,
        emp_password,
      },
    });

    return NextResponse.json({ updatedAdmin }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}





