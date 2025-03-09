import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Assuming you have a Prisma client setup

export async function GET() {
  try {
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
      // Get all bookings for this user, grouped by field
      const userBookings = await prisma.bookings.groupBy({
        by: ['field_ID'],
        where: {
          user_ID: user.user_ID,
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