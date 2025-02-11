import prisma from "@/lib/db";
export async function POST(req: Request) {
    try {
        const data = await req.json();
        if(data){
            const insertOderTB = await  prisma.orders.create({
              data:{
                totalprice:data.totalprice,
                payment_confirmation:data.payment_confirmation,
                emp_ID:data.emp_ID
              },
            })
            return Response.json(insertOderTB.order_ID);
        }else{
            return Response.json("ไม่มีข้อมูล");
        } 
    } catch (error) {
      console.error('Error occurred:', error);
      return Response.json({ message: 'An error occurred during the request.' });
    } finally {
      //await prisma.$disconnect();
    }
}