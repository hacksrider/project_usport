/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
    const prisma = new PrismaClient();

  try {
    // Get all orders
    const orders = await prisma.orders_exercise.findMany({
      select: {
        service_name: true,
        desired_start_date: true,
      },
    });

    // Create a map to count services by date
    const servicesByDate = {};

    // Process each order
    orders.forEach(order => {
      // Format date as DD/MM/YYYY
      const date = new Date(order.desired_start_date);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`; // Converting to Thai Buddhist calendar by adding 543 years
      
      // @ts-expect-error
      if (!servicesByDate[formattedDate]) {
        // @ts-expect-error
        servicesByDate[formattedDate] = {};
      }
      
      // @ts-expect-error
      if (!servicesByDate[formattedDate][order.service_name]) {
        // @ts-expect-error
        servicesByDate[formattedDate][order.service_name] = 1;
      } else {
        // @ts-expect-error
        servicesByDate[formattedDate][order.service_name]++;
      }
    });

    // Format the result
    const result = [];
    
    for (const date in servicesByDate) {
        // @ts-expect-error
      for (const service in servicesByDate[date]) {
        result.push({
          date,
          service_name: service,
          // @ts-expect-error
          count: servicesByDate[date][service]
        });
      }
    }

    // Close the Prisma connection
    await prisma.$disconnect();

    // Return the formatted response
    return NextResponse.json({
      success: true,
      data: {
        servicesByDate: servicesByDate,
        formattedResults: result
      }
    });
  } catch (error) {
    // Handle errors
    console.error('Error fetching service counts:', error);
    
    // Close the Prisma connection
    await prisma.$disconnect();
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch service counts',
      details: error
    }, { status: 500 });
  }
}