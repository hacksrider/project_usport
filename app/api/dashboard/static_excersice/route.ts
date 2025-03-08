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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereCondition: any = {};

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
          // Filter by specific year and month
          const startDate = new Date(parseInt(year), monthIndex, 1);
          const endDate = new Date(parseInt(year), monthIndex + 1, 0);
          
          whereCondition.desired_start_date = {
            gte: startDate,
            lte: endDate
          };
        }
      } else {
        // Filter by year only
        const startDate = new Date(parseInt(year), 0, 1);
        const endDate = new Date(parseInt(year), 11, 31);
        
        whereCondition.desired_start_date = {
          gte: startDate,
          lte: endDate
        };
      }
    }

    // Query to count occurrences of each service_name with date filtering
    const serviceCounts = await prisma.orders_exercise.groupBy({
      by: ['service_name'],
      _count: { service_name: true },
      where: whereCondition
    });

    // Query to get total count with the same filter
    const totalCount = await prisma.orders_exercise.count({
      where: whereCondition
    });

    // Get unique service names (to include all services even when count is 0)
    const allServices = await prisma.orders_exercise.findMany({
      distinct: ['service_name'],
      select: { service_name: true }
    });

    // Create a map of all service names with counts initialized to 0
    const serviceMap = new Map();
    allServices.forEach(service => {
      serviceMap.set(service.service_name, 0);
    });

    // Update counts for services that have data
    serviceCounts.forEach(item => {
      serviceMap.set(item.service_name, item._count.service_name);
    });

    // Format the final result
    const result = Array.from(serviceMap.entries()).map(([serviceName, count]) => ({
      service_name: serviceName,
      count: count,
      percentage: totalCount > 0 ? (count / totalCount) * 100 : 0,
    }));

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, message: String(error) }, { status: 500 });
  }
}