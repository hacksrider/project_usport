/* eslint-disable @typescript-eslint/ban-ts-comment */
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmRejectOpen, setIsConfirmRejectOpen] = useState(false);

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
            console.log("Error confirming order:", error);
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
        // console.log("rejectOrder");
    };

    function calculateAge(dateString: string): number {
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const dateOfBirth = buyingService?.users.user_date_of_birth || "";
    // console.log("==", dateOfBirth)
    const age = dateOfBirth ? calculateAge(dateOfBirth) : "";

    return (
        <MainLayoutAdmin>
            {/* <h1 className="text-2xl font-semibold mb-3 ml-2 text-black">รวมคำสั่งซื้อบริการการออกกำลังกาย</h1> */}
            <div className="w-full bg-gray-300 ml-2 p-6 rounded shadow-md">
                {/* <h1 className="text-2xl font-semibold mb-5">คำสั่งซื้อของ <span className="text-blue-700 font-semibold">{buyingService?.users.user_name} {buyingService?.users.user_lastname}</span></h1> */}
                <div className="bg-white shadow-md rounded-lg p-5">
                    {!buyingService ? (
                        <p>Loading...</p>
                    ) : (
                        <>
                            <div className="flex justify-between items-center mb-2">
                                <h1 className="text-xl font-bold">คำสั่งซื้อทั้งหมด</h1>
                                {
                                    buyingService && !buyingService.buying_status
                                        ? <div className="flex gap-4">
                                            <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={confirmOrder}>ยืนยัน</button>
                                            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={() => setIsConfirmRejectOpen(true)}>ปฏิเสธ</button>
                                        </div>
                                        : 
                                        <>
                                        <div className="w-50 text-xl font-semibold">ผู้อนุมัติ: <span className="font-bold">{buyingService.employees.emp_name} {buyingService.employees.emp_lastname}</span></div>
                                        </>
                                }
                                {isConfirmRejectOpen && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                        <div className="bg-white p-6 rounded-lg relative max-w-md text-center">
                                            <h2 className="text-xl font-bold mb-4">ยืนยันที่จะปฏิเสธคำสั่งซื้อ?</h2>
                                            <div className="flex justify-center gap-4">
                                                <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={rejectOrder}>
                                                    ยืนยัน
                                                </button>
                                                <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setIsConfirmRejectOpen(false)}>
                                                    ยกเลิก
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
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
                                    {buyingService.orders_exercise.map((order: any, index: number) => (
                                        <tr key={index}>
                                            <td className="border p-2 text-center">{index + 1}</td>
                                            <td className="border p-2">{order.service_name}</td>
                                            <td className="border p-2 text-center">{order.amount_of_time}</td>
                                            <td className="border p-2 text-center">{order.units}</td>
                                            <td className="border p-2 text-center">{formatDateToThai(order.desired_start_date)}</td>
                                            <td className="border p-2 text-center">{formatDateToThai(order.expire_date)}</td>
                                            <td className="border p-2 text-center">{order.Price}</td>
                                        </tr>
                                    ))}
                                    {buyingService.orders_exercise.length > 1 ? (
                                        <tr>
                                            <td className="border p-2 text-right font-bold bg-red-300 text-xl" colSpan={6}>ราคารวม</td>
                                            {/* @ts-expect-error */}
                                            <td className="border p-2 text-center font-bold bg-green-500 text-xl ">{buyingService.orders_exercise.reduce((total, item) => total + item.Price, 0)}</td>
                                        </tr>
                                    )
                                        : (
                                            ""
                                        )
                                    }
                                </tbody>
                            </table>
                            <h1 className="text-xl font-bold mb-2 mt-4">ข้อมูลผู้สั่งซื้อ</h1>
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border p-2">No</th>
                                        <th className="border p-2">ชื่อ-นามสกุล</th>
                                        <th className="border p-2">ชื่อผู้ใช้</th>
                                        <th className="border p-2">อายุ</th>
                                        <th className="border p-2">เบอร์โทร</th>
                                        <th className="border p-2">อีเมล</th>
                                        <th className="border p-2">เพศ</th>
                                        <th className="border p-2">สถานะ VIP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2 text-center">{1}</td>
                                        <td className="border p-2">{buyingService?.users.user_name} {buyingService?.users.user_lastname}</td>
                                        <td className="border p-2 text-center">{buyingService?.users.user_username}</td>
                                        <td className="border p-2 text-center">{age}</td>
                                        <td className="border p-2 text-center">{buyingService?.users.user_tel}</td>
                                        <td className="border p-2 text-center">{buyingService?.users.user_email}</td>
                                        <td className="border p-2 text-center">{buyingService?.users.sex}</td>
                                        <td className="border p-2 text-center">{buyingService?.users.status_of_VIP ? "ใช่" : "ไม่ใช่"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </>
                    )}
                    <div>
                        <h1 className="text-xl font-bold mb-2 mt-5">สลิปหลักฐานการโอนเงิน</h1>
                        <img
                            src={buyingService?.payment_confirmation ? `http://localhost:4000/${buyingService?.payment_confirmation}` : "/user/img/Loading_icon.gif"}
                            alt="Slip"
                            width={180} height={200}
                            style={{ objectFit: "contain", cursor: "pointer" }}
                            onClick={() => setIsModalOpen(true)}
                        />
                        {isModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                <div className="bg-white p-4 rounded-lg relative max-w-xl">
                                    <button className="absolute top-1 right-2 text-5xl" onClick={() => setIsModalOpen(false)}>
                                        &times;
                                    </button>
                                    <img
                                        src={`http://localhost:4000/${buyingService?.payment_confirmation}`}
                                        alt="Slip"
                                        className="max-w-full h-auto"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayoutAdmin>
    );
}
