/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import MainLayout from "@/app/components/mainLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Summary() {
  const router = useRouter();
  const [selectedActivities, setSelectedActivities] = useState<
    {
      [x: string]: any; name: string; price: number; duration: number; dateStart: string; dateEnd: string 
}[]
  >([]);

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    const thaiYear = parseInt(year, 10) + 543; // แปลงเป็นปีพุทธศักราช
    return `${parseInt(day, 10)}-${parseInt(month, 10)}-${thaiYear}`;
  };


  useEffect(() => {
    const tempData = sessionStorage.getItem("selectServices");
    const temp = tempData ? JSON.parse(tempData) : [];
    const tempService = temp.map((i: any) => {
      const duration = i.quantity_of_days || i.time?.Time_Of_Service?.quantity_of_days || 0;
      const dateStart = i.date || "";
      const dateEnd = dateStart
        ? new Date(new Date(dateStart).getTime() + duration * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        : "";
  
      return {
        name: i.detail.service_name,
        unit: i.unit, // เพิ่มการดึง unit จากข้อมูล
        duration,
        price: i.price || 0,
        dateStart,
        dateEnd,
      };
    });
  
    setSelectedActivities(tempService);
  }, []);
  



  const totalCost = selectedActivities.reduce((sum, activity) => {
    return sum + activity.price;
  }, 0);

  const total50 =+ totalCost * 0.5
  const totalAll = totalCost - total50

  const handleConfirmPurchase = () => {
    sessionStorage.setItem("totalAll", totalAll.toString());
    router.push("/pages/user/exercise/payment");
  };
  

  return (
    <MainLayout>
      <div className="w-[800px] p-8 mx-auto">
        <div className="max-w-[900px] mx-auto bg-white shadow-2xl rounded-3xl p-12">
          <h1 className="text-center text-4xl font-extrabold mb-10 text-gray-900">
            สรุปรายการสั่งซื้อ
          </h1>
          <div className="mb-10">
            {selectedActivities.map((activity, index) => (
              <div
                key={index}
                className="bg-gray-100 p-6 rounded-xl mb-6 shadow-md flex items-center justify-between"
              >
                <div>
                  <p className="text-lg font-bold text-gray-800">{activity.name}</p>
                  <p className="text-gray-600">{`ระยะเวลา : ${activity.duration} ${activity.unit}`}</p>
                  {activity.dateStart && (
                    <p className="text-gray-600">{`วันที่เริ่ม : ${formatDate(activity.dateStart)}`}</p>
                  )}
                  {activity.dateEnd && (
                    <p className="text-gray-600">{`วันที่สิ้นสุด : ${formatDate(activity.dateEnd)}`}</p>
                  )}

                </div>
                <div>
                  <span className="text-lg font-bold text-blue-600">
                    ฿{activity.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-b border-gray-300 pt-6 pb-5">
            <div className="flex justify-between items-center mb-1">
              <p className="text-lg text-gray-900">ราคารวม</p>
              <p className="text-lg text-blue-500">฿{totalCost}</p>
            </div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-lg text-gray-900">ส่วนลดลูกค้า VIP</p>
              <p className="text-lg text-blue-500">฿{total50}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-2xl font-extrabold text-gray-900">รวมสุทธิ</p>
              <p className="text-2xl font-extrabold text-red-500">฿{totalAll}</p>
            </div>
          </div>
          <div className="mt-10 flex gap-6">
            <button
              className="w-full bg-gray-200 text-gray-800 py-4 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              onClick={() => window.history.back()/*router.push("../exercise")*/}
            >
              แก้ไขรายการ
            </button>
            <button
              onClick={() => handleConfirmPurchase()}
              className="w-full bg-gradient-to-br from-green-500 to-teal-500 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-teal-600 transition-transform hover:scale-105"
            >
              ยืนยันการสั่งซื้อ
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
