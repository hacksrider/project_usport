// import { NextResponse } from "next/server";
// import { Prisma, PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// // GET: ดึงข้อมูลพนักงานตาม emp_ID
// export async function GET(req: Request, context: { params: { id: string } }) {
//   try {
//     const emp_ID = parseInt(context.params.id);

//     const employee = await prisma.employees.findUnique({
//       where: { emp_ID },
//     });

//     if (!employee) {
//       return NextResponse.json({ error: "Employee not found" }, { status: 404 });
//     }

//     return NextResponse.json(employee);
//   } catch (error) {
//     console.error("Error fetching employee:", error);
//     return NextResponse.json({ error: "Error fetching employee" }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }



// // PUT: อัปเดตข้อมูลพนักงานตาม emp_ID
// export async function PUT(req: Request, { params }: { params: { id: string } }) {
//   try {
//     const emp_ID = parseInt(params.id);
//     const body = await req.json();

//     const updatedEmployee = await prisma.employees.update({
//       where: { emp_ID },
//       data: body,
//     });

//     return NextResponse.json(updatedEmployee);
//   } catch (error) {
//     console.error("Error updating employee:", error);
//     return NextResponse.json({ error: "Error updating employee" }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }


// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = await parseInt(params.id); //parseInt(params.id)
//     const employees = await prisma.employees.delete({
//       where: {
//         emp_ID: id,
//       },
//     });
//     return NextResponse.json({ msg: "delete employee: " + employees.emp_ID });
//   } catch (e) {
//     if (e instanceof Prisma.PrismaClientKnownRequestError) {
//       console.log(e.code);
//       console.log(e.message);
//     }
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }
// // export async function DELETE(req: Request, context: { params: { id: string } }) {
// //   try {
// //     // ใช้ context.params เพื่อเข้าถึงค่า id
// //     const { id } = context.params; // ดึง id จาก context.params
// //     const emp_ID = parseInt(id); // แปลง id เป็นตัวเลข

// //     await prisma.employees.delete({
// //       where: { emp_ID },
// //     });

// //     return NextResponse.json({ message: "Employee deleted successfully" });
// //   } catch (error) {
// //     console.error("Error deleting employee:", error);
// //     return NextResponse.json({ error: "Error deleting employee" }, { status: 500 });
// //   } finally {
// //     await prisma.$disconnect();
// //   }
// // }

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
        Buying_Exercise: true,
        Bookings: true,
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





