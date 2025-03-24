import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Get the current date to determine years to analyze
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    // 1. Analytics for buying_exercise and service_of_exercise
    const exerciseAnalytics = await getExerciseAnalytics(currentYear);

    // 2. Analytics for order_Bookings and bookings with field_name
    const bookingsAnalytics = await getBookingsAnalytics(currentYear);

    return NextResponse.json({
      success: true,
      data: {
        exerciseAnalytics,
        bookingsAnalytics
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}

async function getExerciseAnalytics(currentYear: number) {
  // Get total count of buying_exercise records
  const totalBuyingExercise = await prisma.buying_exercise.count({
    where: { buying_status: true }
  });

  // Get total count of distinct service_name in service_of_exercise
  const totalServiceTypes = await prisma.service_of_exercise.count();

  // Get service purchases grouped by year and month
  const yearlyMonthlyData = [];
  
  // Analyze current year and previous year
  for (let year = currentYear - 1; year <= currentYear; year++) {
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      // For the current year, only include months up to the current month
      if (year === currentYear && month > new Date().getMonth() + 1) {
        continue;
      }
      
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of the month
      
      // Count buying_exercise records for this month
      const buyingCount = await prisma.buying_exercise.count({
        where: {
          buying_date: {
            gte: startDate,
            lte: endDate
          },
          buying_status: true
        }
      });
      
      // Count distinct services purchased in this month
      const purchasedServices = await prisma.orders_exercise.findMany({
        where: {
          buying_exercise: {
            buying_date: {
              gte: startDate,
              lte: endDate
            },
            buying_status: true
          }
        },
        select: {
          service_ID: true
        },
        distinct: ['service_ID']
      });
      
      monthlyData.push({
        month,
        buyingCount,
        distinctServicesPurchased: purchasedServices.length
      });
    }
    
    yearlyMonthlyData.push({
      year,
      monthlyData
    });
  }
  
  // Get top services by purchase count
  const topServices = await prisma.service_of_exercise.findMany({
    select: {
      service_ID: true,
      service_name: true,
      _count: {
        select: {
          orders_exercise: true
        }
      }
    },
    orderBy: {
      orders_exercise: {
        _count: 'desc'
      }
    },
    take: 5
  });
  
  return {
    totalBuyingExercise,
    totalServiceTypes,
    yearlyMonthlyData,
    topServices: topServices.map(service => ({
      service_name: service.service_name,
      purchaseCount: service._count.orders_exercise
    }))
  };
}

async function getBookingsAnalytics(currentYear: number) {
  // Get total count of order_Bookings records
  const totalOrderBookings = await prisma.order_Bookings.count();
  
  // Get total count of distinct fields
  const totalFieldTypes = await prisma.fields.count({
    where: { status: true }
  });
  
  // Get booking data grouped by year and month
  const yearlyMonthlyData = [];
  
  // Analyze current year and previous year
  for (let year = currentYear - 1; year <= currentYear; year++) {
    const monthlyData = [];
    
    for (let month = 1; month <= 12; month++) {
      // For the current year, only include months up to the current month
      if (year === currentYear && month > new Date().getMonth() + 1) {
        continue;
      }
      
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0); // Last day of the month
      
      // Count bookings for this month
      const bookingCount = await prisma.bookings.count({
        where: {
          booking_date: {
            gte: startDate,
            lte: endDate
          },
          booking_status: "จองสำเร็จ" 
        }
      });
      
      // Count distinct fields booked in this month
      const bookedFields = await prisma.bookings.findMany({
        where: {
          booking_date: {
            gte: startDate,
            lte: endDate
          },
          booking_status: "จองสำเร็จ"
        },
        select: {
          field_ID: true
        },
        distinct: ['field_ID']
      });
      
      // Count order_Bookings for this month
      const orderCount = await prisma.order_Bookings.count({
        where: {
          bookings: {
            some: {
              booking_date: {
                gte: startDate,
                lte: endDate
              }
            }
          }
        }
      });
      
      monthlyData.push({
        month,
        bookingCount,
        orderCount,
        distinctFieldsBooked: bookedFields.length
      });
    }
    
    yearlyMonthlyData.push({
      year,
      monthlyData
    });
  }
  
  // Get top fields by booking count
  const topFields = await prisma.fields.findMany({
    select: {
      field_ID: true,
      field_name: true,
      _count: {
        select: {
          bookings: true
        }
      }
    },
    orderBy: {
      bookings: {
        _count: 'desc'
      }
    },
    take: 5
  });
  
  return {
    totalOrderBookings,
    totalFieldTypes,
    yearlyMonthlyData,
    topFields: topFields.map(field => ({
      field_name: field.field_name,
      bookingCount: field._count.bookings
    }))
  };
}