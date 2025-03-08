import prisma from '@/lib/db';

export async function POST(req: Request) {
  try {
    const getData = await req.json();
    let result = [];    
    const selector = getData[0]?.case_type;

    if (selector === 'insert') {
        for (let i = 0; i < getData.length; i++) {
                const item = getData[i];
                if (
                  !item.field_ID ||
                  !item.period_ID ||
                  item.price_per_1h === undefined ||
                  item.price_for_2h === undefined
                ) {
                  throw new Error(`ข้อมูลไม่ครบถ้วนสำหรับ period_ID: ${item.period_ID}`);
                }
                const addPrice = await prisma.pricefield.create({
                  data: {
                    field_ID: item.field_ID,
                    period_ID: item.period_ID,
                    price_per_1h: item.price_per_1h,
                    price_for_2h: item.price_for_2h,
                  },
                });
                result.push(addPrice); 
              }
    }else if (selector === 'update'){
        for (let i = 0; i < getData.length; i++) {
                const item = getData[i];
                if (
                  !item.field_ID ||
                  !item.period_ID ||
                  item.price_per_1h === undefined ||
                  item.price_for_2h === undefined
                ) {
                  throw new Error(`ข้อมูลไม่ครบถ้วนสำหรับ period_ID: ${item.period_ID}`);
                }
                const updatePrice = await prisma.pricefield.update({
                        where:{
                                price_ID: item.price_ID,
                        },
                        data:{
                                price_per_1h: item.price_per_1h,
                                price_for_2h: item.price_for_2h,
                        }
                })
                result.push(updatePrice)
        }
    }else{ throw new Error('กรุณาระบุ case_type เป็น insert');}
    return new Response(JSON.stringify({ message: 'Prices inserted successfully', data: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'เกิดข้อผิดพลาด' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
