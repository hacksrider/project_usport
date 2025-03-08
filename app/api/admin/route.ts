import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { emp_name, emp_lastname, emp_sex, emp_username, emp_password, emp_tel, emp_job, emp_email } = body;

    if (!emp_username || !emp_password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const existingAdmin = await prisma.employees.findUnique({
      where: { emp_username },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(emp_password, 10);

    const newAdmin = await prisma.employees.create({
      data: {
        emp_name,
        emp_lastname,
        emp_sex,
        emp_username,
        emp_email,
        emp_password: hashedPassword,
        emp_tel,
        emp_job,
      },
    });

    return NextResponse.json(newAdmin);
  } catch (error) {
    console.log("Error in creating admin:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the admin" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    // ดึงข้อมูลพนักงานทั้งหมดจากตาราง employees
    const employees = await prisma.employees.findMany();
    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching employees" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const emp_username = searchParams.get("emp_username"); // Optional filter by username

//     let employees;

//     if (emp_username) {
//       // Fetch a specific employee by username
//       employees = await prisma.employees.findUnique({
//         where: { emp_username },
//       });

//       if (!employees) {
//         return NextResponse.json(
//           { error: "Employee not found" },
//           { status: 404 }
//         );
//       }
//     } else {
//       // Fetch all employees
//       employees = await prisma.employees.findMany();
//     }

//     return NextResponse.json(employees);
//   } catch (error) {
//     console.error("Error fetching employees:", error);
//     return NextResponse.json(
//       { error: "An error occurred while fetching employees" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }
  
