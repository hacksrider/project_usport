'use client';
import { useEffect, useState } from "react";
import MainLayout from "@/app/components/mainLayout";
import { useSession } from "next-auth/react";
import { UserInterface } from "@/app/interface/user";
import { BuyingService } from "@/app/interface/buyingExercise";
import React from "react";
// import Image from "next/image";
// import { useSearchParams } from "next/navigation";

const statusOrderText = [
    "รอใช้บริการ",
    "กําลังใช้บริการ",
    "หมดอายุ",
]

const statusOrderColor = [
    "text-yellow-500",
    "text-blue-500",
    "text-red-500",
]

export default function PurchaseOrder() {
    const [buyingService, setBuyingService] = useState<BuyingService[]>([]);
    // const [orders, setOrders] = useState<Orders[]>([]);
    // const order_ID = useSearchParams()?.get("order_ID");
    const [loading, setLoading] = useState(true);
    const { data, } = useSession();
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

    const formatDateToThai = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
    };

    return (
        <MainLayout>
            <div className="mx-auto w-full max-w-[850px] my-10">
                <h1 className="text-2xl font-semibold mb-5 text-white">คำสั่งซื้อของฉัน</h1>
                {loading ? (
                    <p>Loading orders...</p>
                ) : (
                    <div className="bg-white shadow-md rounded-lg p-5">
                        {buyingService.length === 0 ? (
                            <p>No orders found.</p>
                        ) : (
                            <table className="w-full border-collapse border border-gray-300">
                                <thead>
                                    <tr className="bg-gray-100 text-center border border-b-2 border-gray-400">
                                        <th className="border p-2">No.</th>
                                        <th className="border p-2">ชื่อบริการ</th>
                                        <th className="border p-2">วันที่ซื้อบริการ</th>
                                        <th className="border p-2">จำนวน</th>
                                        <th className="border p-2">หน่วย</th>
                                        <th className="border p-2">ราคา (บาท)</th>
                                        <th className="border p-2">สถานะการใช้บริการ</th>
                                        <th className="border p-2">สถานะคำสั่งซื้อ</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {buyingService.map((order, i) => {console.log(order); 
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    return <React.Fragment key={i}>{order.orders.map((od, j) => {
                                        return(
                                            <tr key={j} className={"text-center " + (j == order.orders.length - 1 ? "border border-b-2 border-gray-400" : "")}>
                                                {j == 0 ? <td rowSpan={order.orders.length} className="border p-2">{i + 1}</td> : ''}
                                                <td className="border p-2">{od.service_name}</td>
                                                <td className="border p-2">{formatDateToThai(order.buying_date)}</td>
                                                <td className="border p-2">{od.amount_of_time}</td>
                                                <td className="border p-2">{od.units}</td>
                                                <td className="border p-2">{od.Price}</td>
                                                <td className={"border p-2 " + statusOrderColor[od.status_order]}>{statusOrderText[od.status_order] || "error"}</td>
                                                {j == 0 ? (order.buying_status ? <td rowSpan={order.orders.length} className="border p-2 text-green-500">ยืนยันแล้ว</td> : <td rowSpan={order.orders.length} className="border p-2 text-yellow-500">รอตรวจสอบ</td>) : ''}
                                            </tr>
                                        )
                                        
                                    })}</React.Fragment>
                                    })}
                                </tbody>
                            </table>
                        )}
                        <div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
