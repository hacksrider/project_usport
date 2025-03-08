// import prisma from "@/lib/db";

// export const updateOrderStatus = async () => {
//     try{
//         //await prisma.orders.updateMany()
//         const orderUpdate = await prisma.orders.updateMany({
//             where: {
//                 status_order: 1,
//                 expire_date: {
//                     lte: new Date(Date.now())
//                 }
//             },
//             data: {
//                 status_order: 2
//             }
//         })
//         // console.log(orderUpdate)
//     }
//     catch(e){
//         console.error(e.message)
//     }
// }

import prisma from "@/lib/db";

export const updateOrderStatus = async (order_ID: number) => {
    const order = await prisma.orders_exercise.findUnique({
      where: { order_ID },
    });
  
    if (!order) {
      throw new Error("Order not found");
    }
  
    const today = new Date(Date.now());

    // console.log("today =>", today);
    // console.log("order.desired_start_date =>", new Date(new Date(order.desired_start_date).getTime()));
    // console.log("order.expire_date =>", new Date(new Date(order.expire_date).getTime()));
  
    // No need to filter as there's only one order; we directly check its status.
    if (today < new Date(new Date(order.desired_start_date).getTime())) {
      await prisma.orders_exercise.update({
        where: { order_ID: order.order_ID },
        data: { status_order: "รอใช้บริการ" },
      });
    } 
     if (
      new Date(new Date(order.desired_start_date).getTime()) <= today &&
      today <= new Date(new Date(order.expire_date).getTime())
    ) {
      await prisma.orders_exercise.update({
        where: { order_ID: order.order_ID },
        data: { status_order: "กำลังใช้บริการ" },
      });
    } 
    
    if (today > new Date(new Date(order.expire_date).getTime())) {
      await prisma.orders_exercise.update({
        where: { order_ID: order.order_ID },
        data: { status_order: "หมดอายุ" },
      });   
    }
  
    return order;
  };
  
