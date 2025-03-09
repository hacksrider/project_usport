/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get query parameters from URL
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    // Base query conditions
    const whereCondition: any = {
      booking_status: "จองสำเร็จ",  // กรองเฉพาะ booking ที่มีสถานะ "จองสำเร็จ"
    };

    // Add date filtering if year and month are provided
    if (year) {
      if (month && month !== 'ทั้งหมด') {
        // Convert Thai month abbreviation to numeric month
        const monthMap: { [key: string]: number } = {
          'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5,
          'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11
        };
        
        const monthIndex = monthMap[month];
        
        if (monthIndex !== undefined) {
          const startDate = new Date(parseInt(year), monthIndex, 1);
          const endDate = new Date(parseInt(year), monthIndex + 1, 0);
          
          whereCondition.desired_booking_date = {
            gte: startDate,
            lte: endDate
          };
        }
      } else {
        const startDate = new Date(parseInt(year), 0, 1);
        const endDate = new Date(parseInt(year), 11, 31);
        
        whereCondition.desired_booking_date = {
          gte: startDate,
          lte: endDate
        };
      }
    }

    // Query to get all fields
    const fields = await prisma.fields.findMany({
      select: {
        field_name: true,
        field_ID: true
      }
    });

    // Query to get all bookings with field information
    const bookings = await prisma.bookings.findMany({
      where: whereCondition,
      include: {
        fields: true, // Include related field data
      },
    });

    // Group bookings by field_name
    const fieldCountMap: { [key: string]: number } = {};

    bookings.forEach(booking => {
      const fieldName = booking.fields.field_name;
      if (fieldCountMap[fieldName]) {
        fieldCountMap[fieldName] += 1;
      } else {
        fieldCountMap[fieldName] = 1;
      }
    });

    // Get total count
    const totalCount = bookings.length;

    // Prepare result with percentage for all fields, including those with no bookings
    const result = fields.map(field => {
      const fieldName = field.field_name;
      const count = fieldCountMap[fieldName] || 0;
      const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
      return { field_name: fieldName, count, percentage };
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}
