import prisma from "@/lib/db";

export async function GET() {
    try {
      const dataFeild = await prisma.fields.findMany({
        include:{
            pricefield:true,
        },
      }); // ดึงข้อมูลจากฐานข้อมูล
      return Response.json(dataFeild); // ส่งข้อมูลกลับ
    } catch (error) {
        console.error(error);
        return Response.json("ไม่ถูกต้อง"); // ส่งข้อมูลกลับ // หากเกิดข้อผิดพลาด
    }
  }

export async function POST(req:Request) {
    try {
        const getData = await req.json(); 
        const dataFeild = await prisma.fields.create({
        data:{
            field_name: getData.field_name,
            status:getData.status
        }
      }); 
       return Response.json("เพิ่มสนามสำเร็จแล้ว : "+ dataFeild);
    } catch (error) {
        console.log(error);
        return Response.json("ไม่ถูกต้อง"); 
    }
  }

  export async function PUT(req:Request) {
    try {
        const getData = await req.json(); 
        const dataFeild = await prisma.fields.update({
            where:{
                field_ID:getData.field_ID
            },
        data:{
            field_name: getData.field_name,
            status:getData.status
        }
      }); 
        return Response.json("แก้ไขข้อมูลสำหรับแล้ว : "+ dataFeild);
    } catch (error) {
        console.log(error);
        return Response.json("ไม่ถูกต้อง"); 
    }
  }

  export async function DELETE(req:Request) {
    try {
        const { searchParams } = new URL(req.url);
        const field_ID = searchParams.get('id');
       
        const dataFeild = await prisma.fields.delete({
            where:{
                field_ID:Number(field_ID)
            }
        })
        return Response.json("แก้ไขข้อมูลสำหรับแล้ว : "+ dataFeild);
    } catch (error) {
        console.log(error);
        return Response.json("ไม่ถูกต้อง"); 
    }
  }

