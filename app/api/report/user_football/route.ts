import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    // Get query parameters for date filtering
    const { searchParams } = new URL(request.url);
    const dateStartParam = searchParams.get('dateStart');
    const dateEndParam = searchParams.get('dateEnd');

    // Set default date range if not provided
    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    
    // Parse dates or use defaults
    const dateStart = dateStartParam ? new Date(dateStartParam) : oneYearAgo;
    const dateEnd = dateEndParam ? new Date(dateEndParam) : today;
    
    // Make sure the end of the day is included
    dateEnd.setHours(23, 59, 59, 999);

    // First, get all fields to have a complete list
    const allFields = await prisma.fields.findMany({
      select: {
        field_ID: true,
        field_name: true,
      },
    });
    
    // Get all users
    const allUsers = await prisma.users.findMany({
      select: {
        user_ID: true,
        user_name: true,
        user_lastname: true,
      },
    });
    
    // Initialize results structure
    const results = [];
    
    // For each user, find their booking statistics per field
    for (const user of allUsers) {
      // Get all bookings for this user, grouped by field, within the date range
      const userBookings = await prisma.bookings.groupBy({
        by: ['field_ID'],
        where: {
          user_ID: user.user_ID,
          booking_date: {
            gte: dateStart,
            lte: dateEnd,
          },
        },
        _count: {
          booking_ID: true, // Count of bookings
        },
        _sum: {
          Price: true, // Sum of all prices
        },
      });
      
      // Map the field IDs to field names and format the response
      const fieldStats = await Promise.all(
        allFields.map(async (field) => {
          // Find this field's stats in the user's bookings
          const fieldBooking = userBookings.find(
            (booking) => booking.field_ID === field.field_ID
          );
          
          // Get booking count and total price (or 0 if no bookings found)
          const bookingCount = fieldBooking ? fieldBooking._count.booking_ID : 0;
          const totalPrice = fieldBooking ? fieldBooking._sum.Price || 0 : 0;
          
          return {
            field_name: field.field_name,
            booking_count: bookingCount,
            total_spent: totalPrice,
          };
        })
      );
      
      // Filter out users with no bookings in the date range if desired
      // Uncomment the following condition if you only want to show users with bookings
      // if (fieldStats.reduce((sum, stat) => sum + stat.booking_count, 0) === 0) continue;
      
      // Add the user and their field stats to the results
      results.push({
        user_ID: user.user_ID,
        user_name: `${user.user_name} ${user.user_lastname}`,
        field_statistics: fieldStats,
        total_bookings: fieldStats.reduce((sum, stat) => sum + stat.booking_count, 0),
        total_spent: fieldStats.reduce((sum, stat) => sum + stat.total_spent, 0),
      });
    }
    
    return NextResponse.json({
      status: 'success',
      data: results,
      dateRange: {
        start: dateStart,
        end: dateEnd,
      },
    });
  } catch (error) {
    console.error('Error fetching booking statistics:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to fetch booking statistics',
        error: error,
      },
      { status: 500 }
    );
  }
}