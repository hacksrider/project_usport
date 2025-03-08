import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(await params.id); // No await needed

    // ตรวจสอบจำนวนแถวที่ emp_job = true หรือ emp_job = 1
    const employeesWithJob = await prisma.employees.findMany({
      where: {
        emp_job: true, // หรือ emp_job: 1 ขึ้นอยู่กับการเก็บข้อมูล
      },
    });

    // ถ้าผลลัพธ์เหลือเพียง 1 แถว และกำลังจะลบแถวนั้น ไม่ให้ลบ
    if (employeesWithJob.length === 1 && employeesWithJob[0].emp_ID === id) {
      return NextResponse.json(
        { error: "Cannot delete the last employee with emp_job = true" },
        { status: 400 }
      );
    }

    // ดำเนินการลบข้อมูล
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
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Await the params object to extract the ID
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "admin ID is missing" }, { status: 400 });
    }

    const adminId = parseInt(id);
    if (isNaN(adminId)) {
      return NextResponse.json({ error: "Invalid admin ID" }, { status: 400 });
    }

    const admin = await prisma.employees.findUnique({
      where: { emp_ID: adminId },
    });

    if (!admin) {
      return NextResponse.json({ error: "admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin, { status: 200 });
  } catch (error) {
    console.error("Error fetching admin data:", error);
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
  }
}

// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const parm = await params;
//     const id = parseInt(parm.id); // No await needed
//     const data = await prisma.employees.findUnique({
//       where: {
//         emp_ID: id,
//       },
//       include: {
//         buying_exercise: true,
//         bookings: true,
//       },
//     });
//     return NextResponse.json({ data: data, msg: "success", status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Something went wrong: " + error },
//       { status: 500 }
//     );
//   }
// }

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const parm = await params;
    const id = parseInt(parm.id); 

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid ID parameter" },
        { status: 400 }
      );
    }

    const { emp_name, emp_lastname, emp_sex, emp_tel, emp_username, emp_password, emp_email, emp_job } = await request.json();

    if (!emp_name || !emp_lastname || !emp_username || !emp_password || !emp_email) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(emp_password, 10);

    const updatedAdmin = await prisma.employees.update({
      where: { emp_ID: id },
      data: {
        emp_name,
        emp_lastname,
        emp_sex,
        emp_tel,
        emp_email,
        emp_job,
        emp_username,
        emp_password: hashedPassword,
      },
    });

    return NextResponse.json({res: updatedAdmin }, { status: 200 });
  } catch (error) {
    // console.error("Error:", error.message);
    return NextResponse.json(
      { error: "Something went wrong: " + error },
      { status: 500 }
    );
  }
}





