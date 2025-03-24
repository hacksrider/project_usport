import prisma from "../../../../lib/db";
import * as cron from 'node-cron';
const fiveMinutesAgo: Date = new Date(Date.now() - 2 * 60 * 1000);

const checkAndUpdateBookings = async () => {
  try {
    const bookings = await prisma.bookings.findMany({
      where: {
        order: {
          payment_confirmation: 'n/a',
        },
        booking_date: {
          lte: fiveMinutesAgo, // เวลาจองน้อยกว่าหรือเท่ากับ 5 นาทีที่แล้ว
        },
      },
      include: {
        order: true, // รวมข้อมูลจากตาราง order_Bookings
      },
    });
    // อัปเดต booking_status เป็น 'เกินกำหนดจ่าย'
    for (const booking of bookings) {
      await prisma.bookings.update({
        where: { booking_ID: booking.booking_ID },
        data: { booking_status: 'เกินกำหนดจ่าย' },
      });
      console.log(`อัปเดต booking ID ${booking.booking_ID} เป็น 'เกินกำหนดจ่าย'`);
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปเดตสถานะการจอง:', error);
  }
};

cron.schedule('*/2 * * * *', () => {
  console.log('กำลังตรวจสอบการจอง...');
  checkAndUpdateBookings();
});
console.log('Background job scheduler เริ่มทำงานแล้ว...');