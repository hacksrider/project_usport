"use client"; // Add this directive to make it a Client Component
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";
import { buyingExerciseInterface, BuyingService } from "@/app/interface/buyingExercise";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ExerciseOrder() {
    const router = useRouter();
    const [buyingService, setBuyingService] = useState<BuyingService[]>([]);

    // Fetch Buying Exercise Data
    const fetchBuyingExercise = async () => {
        try {
            const response = await axios.get('/api/buyingexercise/admin');
            const data: buyingExerciseInterface = await response.data;
            setBuyingService(data.data);
        } catch (error) {
            console.error('Error fetching buying exercise:', error);
        }
    };


    useEffect(() => {
        fetchBuyingExercise();
    }, []);

    const formatDateToThai = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
    };


    const rejectOrder = async (id: number) => {
        try {
            await axios.delete(`/api/buyingexercise/admin/${id}`);
            alert("ปฏิเสธคําสั่งซื้อเรียบร้อยแล้ว");
            window.location.href = "/pages/admin/exercise_order";
            // fetch();
        } catch (error) {
            console.error("Error rejecting order:", error);
        }
        // console.log("rejectOrder");
    };
    return (
        <MainLayoutAdmin>
            <h1 className="text-2xl font-semibold mb-3 text-black">รวมคำสั่งซื้อบริการการออกกำลังกาย</h1>
            <div className="w-full bg-gray-300 ml-2 p-6 rounded shadow-md">
                <div className="p-0">
                    <p>คำสั่งซื้อบริการการออกกำลังกาย</p>
                    <table className="table-auto w-full bg-white rounded shadow mt-4">
                        <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="px-4 py-2 text-gray-800">No.</th>
                                <th className="px-4 py-2 text-gray-800">ชื่อ - นามสกุล</th>
                                <th className="px-4 py-2 text-gray-800">ประเภทบริการ</th>
                                <th className="px-4 py-2 text-gray-800">วันที่สั่งซื้อ</th>
                                <th className="px-4 py-2 text-gray-800">สถานะการสั่งซื้อ</th>
                                <th className="px-4 py-2 text-gray-800">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buyingService.map((order, index) => {
                                return (
                                    <tr key={index} className="border-b text-center">
                                        <td className="px-4 py-2 text-gray-600">{index + 1}</td>
                                        <td className="px-4 py-2 text-left text-gray-600">{order.users.user_name} {order.users.user_lastname}</td>
                                        <td className="px-4 py-2 text-gray-600">ออกกำลังกาย</td>
                                        <td className="px-4 py-2 text-gray-600">{formatDateToThai(order.buying_date)}</td>
                                        {order.buying_status ? (
                                            <td className="px-4 py-2 text-green-600">สำเร็จ</td>
                                        ) : (
                                            <td className="px-4 py-2 text-yellow-600">รอยืนยัน</td>
                                        )}
                                        {/* <td className="px-4 py-2 text-gray-600">{price} บาท</td>                                    
                                        <td className="px-4 py-2 text-gray-600">{order.status}</td> */}
                                        <td className="px-4 py-2 text-center">
                                            <button onClick={() => { router.push(`/pages/admin/exercise_order/${order.buying_ID}`) }} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600">ดูคำสั่งซื้อ</button>
                                            {
                                                order.buying_status ? (
                                                    <button onClick={() => { rejectOrder(order.buying_ID) }} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">ลบ</button>
                                                ) : (
                                                    <button onClick={() => { rejectOrder(order.buying_ID) }} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">ปฏิเสธ</button>
                                                )
                                            }
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayoutAdmin>
    );
}
