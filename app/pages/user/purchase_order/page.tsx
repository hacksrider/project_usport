/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';
import { useEffect, useState } from "react";
import MainLayout from "@/app/components/mainLayout";
import { useSession } from "next-auth/react";
import { UserInterface } from "@/app/interface/user";
import { BuyingService } from "@/app/interface/buyingExercise";
import React from "react";
import { useRouter } from "next/navigation";


function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear() + 543;
    return `${day}/${month}/${year}`;
}

// function calculateRemainingTime(expireDateStr: string | number | Date) {
//     const now = new Date(new Date().getTime());
//     const expireDate = new Date(expireDateStr);
//     // @ts-expect-error
//     const diffInMs = expireDate - now;

//     console.log("----", expireDate)
//     console.log("--->", now)

//     if (diffInMs <= 0) {
//         return "หมดเวลาแล้ว";
//     }

//     const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

//     if (days > 0) {
//         if (hours === 0) {
//             return `${days} วัน`;
//         }
//         return `${days} วัน ${hours} ชั่วโมง`;
//     }
//     if (days <= 0 && hours > 0) {
//         if (minutes === 0) {
//             return `${hours} ชั่วโมง`;
//         }
//         return `${hours} ชั่วโมง ${minutes} นาที`;
//     }
//     if (days <= 0 && hours <= 0 && minutes <= 0) {
//         if (seconds === 0) {
//             return `หมดเวลาแล้ว`;
//         }
//         return `${seconds} วินาที`;
//     }

// }

function calculateRemainingTime(expireDateStr: string | number | Date) {
    const now = new Date();
    const expireDate = new Date(expireDateStr);
    const diffInMs = expireDate.getTime() - now.getTime();

    if (diffInMs <= 0) {
        return "-";
    }

    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);

    if (days > 0) {
        return hours === 0 ? `${days} วัน` : `${days} วัน ${hours} ชั่วโมง`;
    }
    if (hours > 0) {
        return minutes === 0 ? `${hours} ชั่วโมง` : `${hours} ชั่วโมง ${minutes} นาที`;
    }
    if (minutes > 0) {
        return `${minutes} นาที ${seconds} วินาที`;
    }
    if (seconds > 0) {
        return `${seconds} วินาที`;
    }

    if (seconds === 0) {
        return "EXPIRED";
    }

    return "-"; // ส่งสัญญาณว่าหมดเวลาแล้ว
}


export default function PurchaseOrder() {
    const router = useRouter();
    const [buyingService, setBuyingService] = useState<BuyingService[]>([]);
    const [loading, setLoading] = useState(true);
    const { data } = useSession();
    const userData = data as UserInterface;
    const user_ID = userData?.user?.id;

    useEffect(() => {
        fetch(`/api/buyingexercise?user_ID=${user_ID}`)
            .then((res) => res.json())
            .then((data) => {
                setBuyingService(data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user_ID]);



    const [refreshed, setRefreshed] = useState(false); // สถานะตรวจสอบการรีเฟรช

    useEffect(() => {
        fetch('/api/buyingexercise')
            .then((res) => res.json())
            .then((data) => {
                setBuyingService(data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const expiredServices = buyingService.some(order =>
                order.orders_exercise.some((od: { expire_date: string | number | Date; }) => calculateRemainingTime(od.expire_date) === "EXPIRED")
            );

            if (expiredServices && !refreshed) {
                // รีเฟรชครั้งแรก
                window.location.reload();

                // รีเฟรชครั้งที่สองหลังจาก 2 วินาที
                // setTimeout(() => {
                //     window.location.reload();
                // }, 2000); // รีเฟรชหลัง 2 วินาที

                // ตั้งค่าสถานะ refreshed เพื่อไม่ให้ทำการรีเฟรชซ้ำ
                setRefreshed(true);
            }
        }, 1000); // เช็คทุก 1 วินาที

        return () => clearInterval(interval);
    }, [buyingService, refreshed]);
    

    return (
        <MainLayout>
            <div className="mx-auto w-full max-w-[1100px] my-10">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl font-semibold text-white">คำสั่งซื้อของฉัน</h1>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded" onClick={() => router.push("/pages/user/exercise")}>+ ซื้อบริการ</button>
                </div>

                {loading ? (
                    <p>Loading orders...</p>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-5">
                        {buyingService.length === 0 ? (
                            <p>ไม่มีคำสั่งซื้อ...</p>
                        ) : (
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100 text-center border border-b-2 border-gray-400">
                                        <th className="border p-2">No.</th>
                                        <th className="border p-2">ชื่อบริการ</th>
                                        <th className="border p-2">วันเริ่มใช้บริการ</th>
                                        <th className="border p-2">วันหมดอายุ</th>
                                        <th className="border p-2">บริการคงเหลือ</th>
                                        <th className="border p-2">สถานะการใช้บริการ</th>
                                        <th className="border p-2">รีวิว</th>
                                        <th className="border p-2">สถานะคำสั่งซื้อ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {buyingService.map((order, i) => (
                                        <React.Fragment key={i}>
                                            {/* @ts-expect-error */}
                                            {order.orders_exercise.map((od, j) => {
                                                console.log(od.desired_start_date);console.log(od.expire_date); return (
                                                    <tr key={j} className={"text-center " + (j === order.orders_exercise.length - 1 ? "border border-b-2 border-gray-400" : "")}>
                                                        {j === 0 && (
                                                            <td rowSpan={order.orders_exercise.length} className="border p-2">{i + 1}</td>
                                                        )}
                                                        <td className="border p-2">{od.service_name}</td>
                                                        <td className="border p-2">{formatDate(od.desired_start_date)}</td>
                                                        <td className="border p-2">{formatDate(od.expire_date)}</td>
                                                        <td className="border p-2">
                                                            {order.buying_status ? (
                                                                (od.status_order === "รอใช้บริการ" || od.status_order === "หมดอายุ") ? (
                                                                    <p>-</p>
                                                                ) : (
                                                                    <p>{calculateRemainingTime(od.expire_date)}</p>
                                                                )
                                                            ) : ("-")}
                                                        </td>
                                                        {order.buying_status ? (
                                                            <td className={`border p-2 ${od.status_order === "กำลังใช้บริการ" ? "bg-green-400" : od.status_order === "หมดอายุ" ? "bg-red-400": "bg-yellow-400"}`}>
                                                                {od.status_order}
                                                            </td>
                                                        ) : (
                                                            <td className={"border p-2 bg-yellow-600"}>
                                                                รอตรวจสอบ
                                                            </td>
                                                        )}

                                                        {od.status_order === "กำลังใช้บริการ" || od.status_order === "หมดอายุ" ? (
                                                            <td className="border p-2">
                                                                {order.buying_status ? (
                                                                    <button onClick={() => router.push(`/pages/user/exercise/${od.service_ID}`)} className="hover:text-blue-600">
                                                                        กดรีวิว
                                                                    </button>
                                                                ) : (
                                                                    "-"
                                                                )
                                                                }
                                                            </td>
                                                        ) : (
                                                            <td className="border p-2">-</td>
                                                        )}
                                                        {j === 0 && (
                                                            order.buying_status ? (
                                                                <td rowSpan={order.orders_exercise.length} className="border p-2 text-green-500">ตรวจสอบแล้ว</td>
                                                            ) : (
                                                                <td rowSpan={order.orders_exercise.length} className="border p-2 text-yellow-500">กำลังตรวจสอบ</td>
                                                            )
                                                        )}
                                                    </tr>
                                                )
                                            })}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}