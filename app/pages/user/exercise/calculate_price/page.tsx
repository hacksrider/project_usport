/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import MainLayout from "@/app/components/mainLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { ServiceToSave } from "@/app/interface/buyingExercise";
// import { ServiceToSave } from "@/app/interface/buyingExercise";

export default function Calculate_price() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, status } = useSession();
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null); // แก้ไขตามโครงสร้างข้อมูล API ของคุณ
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // const [receivedData, setReceivedData] = useState<ServiceToSave[]>([]);

  const [selectedActivities, setSelectedActivities] = useState<ServiceToSave[]>([]);
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/pages/user/AAA/login");
    }
  })

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        // @ts-expect-error
        const userId = session?.user?.id;
        if (userId) {
          const response = await axios.get(`/api/user/${userId}`);
          if (response.status === 200) {
            setUserData(response.data);
            const data = sessionStorage.getItem("serviceToSave"); // ดึงข้อมูล serviceToSave จาก sessionStorage
            const temp = data ? JSON.parse(data) : []; // แปลงข้อมูลเป็น JSON
            const tempService = temp.map((i: any) => {
              const duration = i.amount_of_time || 0; // ใช้ amount_of_time แทน quantity_of_days
              const dateStart = i.desired_start_date || ""; // ใช้ desired_start_date แทน date
              let dateEnd = "";

              if (dateStart) {
                const startDate = new Date(dateStart);
                switch (i.units) {
                  case "วัน":
                    dateEnd = new Date(startDate.getTime() + duration * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
                    break;
                  case "สัปดาห์":
                    dateEnd = new Date(startDate.getTime() + duration * 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
                    break;
                  case "เดือน":
                    startDate.setMonth(startDate.getMonth() + duration);
                    dateEnd = startDate.toISOString().split("T")[0];
                    break;
                  case "ปี":
                    startDate.setFullYear(startDate.getFullYear() + duration);
                    dateEnd = startDate.toISOString().split("T")[0];
                    break;
                  default:
                    dateEnd = "";
                }
              }

              return {
                service_name: i.service_name, // ใช้ service_name จาก serviceToSave
                amount_of_time: duration,
                units: i.units, // ใช้ units แทน unit
                Price: response.data.status_of_VIP && i.units == 'เดือน'? (i.Price * 0.5) : i.Price || 0, // ใช้ Price แทน price
                priceToShow: i.Price || 0,
                desired_start_date: dateStart,
                expire_date: dateEnd,
                service_ID: i.service_ID
              };
            });
            // console.log('tempService', tempService);
            sessionStorage.setItem("serviceToSave2", JSON.stringify(tempService));
            setSelectedActivities(tempService); // อัปเดต state ของ selectedActivities
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    // const data = sessionStorage.getItem("serviceToSave");
    // if (data) {
    //   setReceivedData(JSON.parse(data));
    //   console.log("Received Data:", JSON.parse(data));
    // }
    fetchUserData();
  }, [session]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl font-semibold text-gray-100">กำลังโหลดข้อมูล...</p>
        </div>
      </MainLayout>
    );
  }

  const formatDate = (date: string) => {
    if (!date) return "";
    const [year, month, day] = date.split("-");
    const thaiYear = parseInt(year, 10) + 543; // แปลงเป็นปีพุทธศักราช
    return `${parseInt(day, 10)}-${parseInt(month, 10)}-${thaiYear}`;
  };

  const totalCost = selectedActivities.reduce((sum, activity) => {
    return sum + activity.priceToShow!;
  }, 0);

  const offPrice = selectedActivities.reduce((sum, activity) => {
    return sum + activity.Price!;
  }, 0)
  const offSell =  totalCost - offPrice;
  const totalAll = totalCost - offSell;

  const handleConfirmPurchase = () => {
    if (userData.status_of_VIP) {
      sessionStorage.setItem("totalAll", totalAll.toString());
    } else {
      sessionStorage.setItem("totalAll", totalCost.toString());
    }
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
                  <p className="text-lg font-bold text-gray-800">{activity.service_name}</p>
                  <p className="text-gray-600">{`ระยะเวลา : ${activity.amount_of_time} ${activity.units}`}</p>
                  {activity.desired_start_date && (
                    <p className="text-gray-600">{`วันที่เริ่ม : ${formatDate(activity.desired_start_date)}`}</p>
                  )}
                  {activity.expire_date && (
                    <p className="text-gray-600">{`วันที่สิ้นสุด : ${formatDate(activity.expire_date)}`}</p>
                  )}
                </div>
                <div>
                  <span className="text-lg font-bold text-blue-600">
                    ฿{activity.priceToShow}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-b border-gray-300 pt-6 pb-5">
            {userData.status_of_VIP ? (
              <>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-lg text-gray-900">ราคารวม</p>
                  <p className="text-lg text-blue-500">฿{totalCost}</p>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-lg text-gray-900">ส่วนลดลูกค้า VIP</p>
                  <p className="text-lg text-blue-500">฿{offSell}</p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-extrabold text-gray-900">รวมสุทธิ</p>
                  <p className="text-2xl font-extrabold text-red-500">฿{totalAll}</p>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center">
                <p className="text-2xl font-extrabold text-gray-900">รวมสุทธิ</p>
                <p className="text-2xl font-extrabold text-red-500">฿{totalCost}</p>
              </div>
            )}
          </div>
          <div className="mt-10 flex gap-6">
            <button
              className="w-full bg-gray-200 text-gray-800 py-4 rounded-xl font-bold hover:bg-gray-300 transition-colors"
              onClick={() => router.push("../exercise")}
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
