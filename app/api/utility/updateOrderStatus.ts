// import prisma from "@/lib/db";

// export const updateOrderStatus = async (order_ID: number) => {
//     const order = await prisma.orders_exercise.findUnique({
//       where: { order_ID },
//     });
  
//     if (!order) {
//       throw new Error("Order not found");
//     }
  
//     const today = new Date(Date.now());

//     // console.log("today =>", today);
//     // console.log("order.desired_start_date =>", new Date(new Date(order.desired_start_date).getTime()));
//     // console.log("order.expire_date =>", new Date(new Date(order.expire_date).getTime()));
  
//     // No need to filter as there's only one order; we directly check its status.
//     if (today < new Date(new Date(order.desired_start_date).getTime())) {
//       await prisma.orders_exercise.update({
//         where: { order_ID: order.order_ID },
//         data: { status_order: "รอใช้บริการ" },
//       });
//     } 
//      if (
//       new Date(new Date(order.desired_start_date).getTime()) <= today &&
//       today <= new Date(new Date(order.expire_date).getTime())
//     ) {
//       await prisma.orders_exercise.update({
//         where: { order_ID: order.order_ID },
//         data: { status_order: "กำลังใช้บริการ" },
//       });
//     } 
    
//     if (today > new Date(new Date(order.expire_date).getTime())) {
//       await prisma.orders_exercise.update({
//         where: { order_ID: order.order_ID },
//         data: { status_order: "หมดอายุ" },
//       });   
//     }
  
//     return order;
//   };
  
import prisma from "@/lib/db";
import { updateUserMembershipStatus } from "./updateUserMembershipStatus ";

export const updateOrderStatus = async (order_ID: number) => {
    const order = await prisma.orders_exercise.findUnique({
      where: { order_ID },
      include: {
        buying_exercise: {
          include: {
            users: true
          }
        }
      }
    });
  
    if (!order) {
      throw new Error("Order not found");
    }
  
    const today = new Date(Date.now());
    let statusChanged = false;
    const currentStatus = order.status_order;
    let newStatus = currentStatus;
    
    if (today < new Date(new Date(order.desired_start_date).getTime())) {
      newStatus = "รอใช้บริการ";
    } 
    else if (
      new Date(new Date(order.desired_start_date).getTime()) <= today &&
      today <= new Date(new Date(order.expire_date).getTime())
    ) {
      newStatus = "กำลังใช้บริการ";
    } 
    else if (today > new Date(new Date(order.expire_date).getTime())) {
      newStatus = "หมดอายุ";
    }
    
    // อัปเดตสถานะเฉพาะเมื่อมีการเปลี่ยนแปลงจริง
    if (newStatus !== currentStatus) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      statusChanged = true;
      await prisma.orders_exercise.update({
        where: { order_ID: order.order_ID },
        data: { status_order: newStatus },
      });
      
      // console.log(`Order ${order_ID} status updated from "${currentStatus}" to "${newStatus}"`);
    }
  
    // อัปเดต user membership status ทุกครั้งที่มีการเรียกใช้ฟังก์ชัน
    // ไม่ว่าจะมีการเปลี่ยนแปลงสถานะหรือไม่ก็ตาม
    if (order.buying_exercise && order.buying_exercise.user_ID) {
      // console.log(`Updating membership status for user ${order.buying_exercise.user_ID}`);
      await updateUserMembershipStatus(order.buying_exercise.user_ID);
    }
  
    return order;
};