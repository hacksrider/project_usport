/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    // 1. Calculate total price by service_name in orders_exercise, grouped by year and month
    const serviceRevenue = await prisma.service_of_exercise.findMany({
      select: {
        service_name: true,
        orders_exercise: {
          select: {
            Price: true,
            desired_start_date: true,
          },
        },
      },
    });

    // Process service revenue data
    const serviceRevenueByYearMonth = {};
    
    serviceRevenue.forEach(service => {
      const serviceName = service.service_name;
      // @ts-expect-error
      if (!serviceRevenueByYearMonth[serviceName]) {
        // @ts-expect-error
        serviceRevenueByYearMonth[serviceName] = {};
      }
      
      service.orders_exercise.forEach(order => {
        const date = new Date(order.desired_start_date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // JavaScript months are 0-indexed
        // @ts-expect-error
        if (!serviceRevenueByYearMonth[serviceName][year]) {
          // @ts-expect-error
          serviceRevenueByYearMonth[serviceName][year] = {};
        }
        // @ts-expect-error
        if (!serviceRevenueByYearMonth[serviceName][year][month]) {
          // @ts-expect-error
          serviceRevenueByYearMonth[serviceName][year][month] = 0;
        }
        // @ts-expect-error
        serviceRevenueByYearMonth[serviceName][year][month] += order.Price;
      });
    });

    // 2. Calculate total price by field_name in bookings, grouped by year and month
    const fieldRevenue = await prisma.fields.findMany({
      select: {
        field_name: true,
        bookings: {
          select: {
            Price: true,
            booking_date: true,
          },
        },
      },
    });

    // Process field revenue data
    const fieldRevenueByYearMonth = {};
    
    fieldRevenue.forEach(field => {
      const fieldName = field.field_name;
      // @ts-expect-error
      if (!fieldRevenueByYearMonth[fieldName]) {
        // @ts-expect-error
        fieldRevenueByYearMonth[fieldName] = {};
      }
      
      field.bookings.forEach(booking => {
        const date = new Date(booking.booking_date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // JavaScript months are 0-indexed
        // @ts-expect-error
        if (!fieldRevenueByYearMonth[fieldName][year]) {
          // @ts-expect-error
          fieldRevenueByYearMonth[fieldName][year] = {};
        }
        // @ts-expect-error
        if (!fieldRevenueByYearMonth[fieldName][year][month]) {
          // @ts-expect-error
          fieldRevenueByYearMonth[fieldName][year][month] = 0;
        }
        // @ts-expect-error
        fieldRevenueByYearMonth[fieldName][year][month] += booking.Price;
      });
    });

    return NextResponse.json({
      message: "Revenue data retrieved successfully",
      data: {
        serviceRevenue: serviceRevenueByYearMonth,
        fieldRevenue: fieldRevenueByYearMonth
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return NextResponse.json({
      message: "Error fetching revenue data",
      error: error
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}