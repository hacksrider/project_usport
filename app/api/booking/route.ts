import prisma from "@/lib/db";

export async function POST() {
    try {
      const dataFeild = await prisma.fields.findMany(); // ดึงข้อมูลจากฐานข้อมูล
      return Response.json(dataFeild); // ส่งข้อมูลกลับ
    } catch (error) {
        return Response.json("ไม่ถูกต้อง"); // ส่งข้อมูลกลับ // หากเกิดข้อผิดพลาด
    }
    console.log("asasasfafafsasfasfas")
  }


  