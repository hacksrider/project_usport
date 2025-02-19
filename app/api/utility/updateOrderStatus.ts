import prisma from "@/lib/db";

export const updateOrderStatus = async () => {
    try{
        //await prisma.orders.updateMany()
        const orderUpdate = await prisma.orders.updateMany({
            where: {
                status_order: 1,
                expire_date: {
                    lte: new Date(Date.now())
                }
            },
            data: {
                status_order: 2
            }
        })
        // console.log(orderUpdate)
    }
    catch(e){
        console.error(e.message)
    }
}