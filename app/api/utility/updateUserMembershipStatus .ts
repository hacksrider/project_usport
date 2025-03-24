import prisma from "@/lib/db";

export const updateUserMembershipStatus = async (user_ID: number) => {
  try {
    // ค้นหาออร์เดอร์ที่กำลังใช้บริการของ user นี้
    const activeOrders = await prisma.orders_exercise.findMany({
      where: {
        buying_exercise: {
          user_ID: user_ID,
          buying_status: true, // ตรวจสอบว่า buying_status เป็น true ด้วย
        },
        status_order: "กำลังใช้บริการ",
      },
    });

    // console.log(`User ID ${user_ID} has ${activeOrders.length} active orders`);

    // อัปเดตสถานะ membership ให้เป็น true หากมีออร์เดอร์ที่กำลังใช้งาน, false หากไม่มี
    const updatedUser = await prisma.users.update({
      where: { user_ID },
      data: { 
        status_of_Member: activeOrders.length > 0 
      },
    });

    console.log(`Updated user ${user_ID} status_of_Member to ${updatedUser.status_of_Member}`);

    return { success: true, hasActiveOrders: activeOrders.length > 0 };
  } catch (error) {
    console.error(`Error updating membership status for user ${user_ID}:`, error);
    throw error;
  }
};