/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";
import { BuyingService } from "@/app/interface/buyingExercise";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";

export default function ExerciseData() {
    const [buyingService, setBuyingService] = useState<BuyingService>();
    const params = useParams<{ id: string }>();

    const fetch = async () => {
        try {
            const response = await axios.get(`/api/buyingexercise/admin/${params.id}`);
            setBuyingService(response.data.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    const formatDateToThai = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
    };

    const confirmOrder = async () => {
        try {
            await axios.put(`/api/buyingexercise/admin/${params.id}`);
            alert("ยืนยันคําสั่งซื้อเรียบร้อยแล้ว");
            window.location.href = "/pages/admin/exercise_order";
            fetch();
        } catch (error) {
            console.error("Error confirming order:", error);
        }
    };

    const rejectOrder = async () => {
        try {
            await axios.delete(`/api/buyingexercise/admin/${params.id}`);
            alert("ปฏิเสธคําสั่งซื้อเรียบร้อยแล้ว");
            window.location.href = "/pages/admin/exercise_order";
            fetch();
        } catch (error) {
            console.error("Error rejecting order:", error);
        }
        console.log("rejectOrder");
    };

    return (
        <MainLayoutAdmin>
            <h1 className="text-2xl font-semibold mb-3 ml-2 text-black">รวมคำสั่งซื้อบริการการออกกำลังกาย</h1>
            <div className="w-full bg-gray-300 ml-2 p-6 rounded shadow-md">
                <h1 className="text-2xl font-semibold mb-5">คำสั่งซื้อของ <span className="text-blue-700 font-semibold">{buyingService?.users.user_name} {buyingService?.users.user_lastname}</span></h1>
                <div className="bg-white shadow-md rounded-lg p-5">
                    {!buyingService ? (
                        <p>No orders found.</p>
                    ) : (
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2">No</th>
                                    <th className="border p-2">รายการที่สั่งซื้อ</th>
                                    <th className="border p-2">จำนวน</th>
                                    <th className="border p-2">หน่วย</th>
                                    <th className="border p-2">เริ่ม</th>
                                    <th className="border p-2">สิ้นสุด</th>
                                    <th className="border p-2">ราคา</th>
                                </tr>
                            </thead>
                            <tbody>
                                {buyingService.orders.map((order: any, index: number) => (
                                    <tr key={index}>
                                        <td className="border p-2 text-center">{index + 1}</td>
                                        <td className="border p-2">{order.service_name}</td>
                                        <td className="border p-2 text-center">{order.amount_of_time}</td>
                                        <td className="border p-2 text-center">{order.units}</td>
                                        <td className="border p-2 text-center">{formatDateToThai(order.desired_start_date)}</td>
                                        <td className="border p-2 text-center">{formatDateToThai(order.expire_date)}</td>
                                        <td className="border p-2 text-center">
                                            {buyingService?.users.status_of_VIP ? (order.Price * 0.5) : order.Price}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                    <div>
                        <h1 className="text-2xl font-semibold mb-5 mt-5">สลิปหลักฐานการโอนเงิน</h1>
                        <img
                            src={buyingService?.payment_confirmation ? `/${buyingService?.payment_confirmation}` : "/user/img/user.jpeg"}
                            alt="Slip"
                            width={180} height={200}
                            style={{ objectFit: "contain" }}
                        />
                        {
                            buyingService && !buyingService.buying_status
                            ? <div className="mt-5 flex gap-4">
                                <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={confirmOrder}>ยืนยัน</button>
                                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={rejectOrder}>ปฏิเสธ</button>
                            </div>
                            : <></>
                        }
                    </div>
                </div>
            </div>
        </MainLayoutAdmin>
    );
}
