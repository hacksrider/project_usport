import prisma from "@/lib/db";
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req:NextRequest) {
    const url = new URL(req.url); // สร้าง URL จาก req.url
    const field_ID = url.searchParams.get('field_ID');  // ดึงค่าจาก query parameter 'field_ID'
    try {
        const data = await prisma.pricefield.findMany({
            where:{
                field_ID: Number(field_ID)
            }
        })
        return Response.json(data);
        
    } catch (error) {
        console.error('Error fetching data:', error);
        return Response.json(
            { message: 'เกิดข้อผิดพลาดในการดึงข้อมูลจากฐานข้อมูล' },
            { status: 500 }
        ); 
    }
}