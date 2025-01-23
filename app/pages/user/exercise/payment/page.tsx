/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
'use client';

import MainLayout from "@/app/components/mainLayout";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
// import axios from "axios";
import { useSession } from "next-auth/react";

export default function Payment() {
    const router = useRouter();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("bankTransfer");
    const [slipFile, setSlipFile] = useState<File | null>(null);
    const [totalAmount, setTotalAmount] = useState<number>(100); // Default value
    const [timeLeft, setTimeLeft] = useState<string>("");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // const [userData, setUserData] = useState<any>(null); // แก้ไขตามโครงสร้างข้อมูล API ของคุณ
    const { data: session } = useSession();
    const [selectedActivities, setSelectedActivities] = useState<
        { name: string; price: number; duration: number; dateStart: string; dateEnd: string }[]
    >([]);
    

    useEffect(() => {
        const storedTotal = sessionStorage.getItem("totalAll");
        if (storedTotal) {
            setTotalAmount(parseFloat(storedTotal));
        }
    }, []);

    useEffect(() => {
        const activitiesData = sessionStorage.getItem("selectedActivities");
        if (activitiesData) {
          console.log("Selected Activities:", JSON.parse(activitiesData)); // ตรวจสอบข้อมูล
        }
    }, []);

    useEffect(() => {
        const countdownKey = "paymentCountdown";
        const now = new Date().getTime();
        const storedEndTime = sessionStorage.getItem(countdownKey);

        let endTime;
        if (storedEndTime) {
            endTime = parseInt(storedEndTime, 10);
        } else {
            endTime = now + 10 * 60 * 1000; // Set 10 minutes countdown
            sessionStorage.setItem(countdownKey, endTime.toString());
        }

        const countdownInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            const timeDifference = endTime - currentTime;

            if (timeDifference <= 0) {
                clearInterval(countdownInterval);
                sessionStorage.removeItem(countdownKey);
                alert("ครบเวลาการชำระเงิน");
                router.push("../exercise/calculate_price");
            } else {
                const minutes = Math.floor(timeDifference / (1000 * 60));
                const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
                setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [router]);

    const handlePaymentChange = (method: string) => {
        setSelectedPaymentMethod(method);
        setSlipFile(null); // Reset slip if the payment method changes
    };

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setSlipFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result) {
                    sessionStorage.setItem("uploadedSlip", reader.result.toString()); // Save base64 string
                }
            };
            reader.readAsDataURL(file); // Convert file to base64
        }
    };

    const handleSubmit = () => {
        if ((selectedPaymentMethod === "bankTransfer" || selectedPaymentMethod === "qr_code") && !slipFile) {
            alert("กรุณาแนบสลิปการโอนเงิน");
            return;
        }

        alert("การชำระเงินสำเร็จ! ระบบจะดำเนินการต่อ");
        router.push("/pages/user/exercise/order_summary");
    };



    useEffect(() => {
    
        // const fetchUserData = async () => {
        //   try {
        //     // @ts-expect-error
        //     const userId = session?.user?.id;
        //     if (userId) {
        //       const response = await axios.get(`/api/user/${userId}`);
        //       if (response.status === 200) {
        //         setUserData(response.data);
        //       }
        //     }
        //   } catch (error) {
        //     console.error("Error fetching user data:", error);
        //   } 
        // //   finally {
        // //     setIsLoading(false);
        // //   }
        // };
    
        const loadSelectedServices = () => {
          const tempData = sessionStorage.getItem("selectServices");
          const temp = tempData ? JSON.parse(tempData) : [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const tempService = temp.map((i: any) => {
            const duration = i.quantity_of_days || i.time?.Time_Of_Service?.quantity_of_days || 0;
            const dateStart = i.date || "";
            let dateEnd = "";
    
            if (dateStart) {
              const startDate = new Date(dateStart);
              switch (i.unit) {
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
              name: i.detail.service_name,
              duration,
              unit: i.unit, // เพิ่มการดึง unit จากข้อมูล
              price: i.price || 0,
              dateStart,
              dateEnd,
            };
          });
    
          setSelectedActivities(tempService);
        };
    
        // fetchUserData();
        loadSelectedServices();
      }, [session]);
      {console.log("selectedActivities", selectedActivities)}

    return (
        <MainLayout>
            <div className="w-[800px] p-8 mx-auto">
                <div className="max-w-[900px] mx-auto bg-white shadow-2xl rounded-3xl p-12">
                    <h1 className="text-center text-4xl font-extrabold mb-10 text-gray-900">
                        การชำระเงิน
                    </h1>

                    {/* Payment Method Section */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">ยอดที่ต้องชำระเงิน</h2>
                        <div className="text-2xl font-bold text-green-500 mb-4">฿ {totalAmount.toFixed(2)} <span className="text-black">บาท</span></div>
                        <p className="text-xl font-bold text-gray-500 mb-4">** กรุณาชำระเงินภายใน <span className="text-red-500">{timeLeft}</span> นาที **</p>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">เลือกวิธีการชำระเงิน</h2>
                        <div className="grid gap-6">
                            <label className="flex items-center bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    className="mr-4 h-5 w-5"
                                    value="bankTransfer"
                                    checked={selectedPaymentMethod === "bankTransfer"}
                                    onChange={() => handlePaymentChange("bankTransfer")}
                                />
                                <span className="font-medium text-gray-800">โอนเงินผ่านธนาคาร</span>
                            </label>
                            <label className="flex items-center bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    className="mr-4 h-5 w-5"
                                    value="qr_code"
                                    checked={selectedPaymentMethod === "qr_code"}
                                    onChange={() => handlePaymentChange("qr_code")}
                                />
                                <span className="font-medium text-gray-800">QR-Code</span>
                            </label>
                        </div>
                    </div>

                    {/* Bank Transfer Section */}
                    {selectedPaymentMethod === "bankTransfer" && (
                        <div className="mb-10">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">ช่องทางการชำระเงิน</h2>
                                <div className="mb-5">
                                    <ul className="py-3 px-2 bg-green-500 mb-5 flex items-center">
                                        <div className="flex-1">
                                            <li><strong>ธนาคารกสิกรไทย</strong></li>
                                            <li>เลขที่บัญชี : <strong>147-123456-5</strong></li>
                                            <li>ชื่อบัญชี : <strong>เกียรติภูมิ โภคา</strong></li>
                                        </div>
                                        <li className="flex items-center justify-center h-full">
                                            <img src="/user/img/logo-Kbank.png" alt="Kbank" className="w-[300px] pr-[50px]" />
                                        </li>
                                    </ul>
                                    <ul className="py-3 px-2 bg-yellow-500 flex items-center">
                                        <div className="flex-1">
                                            <li><strong>ธนาคารกรุงศรีอยุธยา</strong></li>
                                            <li>เลขที่บัญชี : <strong>147-123456-5</strong></li>
                                            <li>ชื่อบัญชี : <strong>เกียรติภูมิ โภคา</strong></li>
                                        </div>
                                        <li className="flex items-center justify-center h-full">
                                            <img src="/user/img/logo-krungsri.png" alt="Krungsri" className="w-[300px] pr-[50px]" />
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>
                    )}

                    {/* QR Code Section */}
                    {selectedPaymentMethod === "qr_code" && (
                        <div className="mb-10 text-center">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">สแกน QR Code</h2>
                            <img
                                src="/user/img/qrcode.png"
                                alt="QR Code"
                                className="mx-auto w-64 h-64 object-contain rounded-lg shadow-lg mb-8"
                            />
                        </div>
                    )}

                    <h2 className="text-2xl font-bold text-gray-800 mb-4">แนบสลิปการโอนเงิน</h2>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="block w-full p-4 border border-gray-300 rounded-lg"
                    />
                    {slipFile && (
                        <div className="mt-4">
                            <p className="text-gray-700">ไฟล์ที่อัปโหลด: {slipFile.name}</p>
                            <img
                                src={URL.createObjectURL(slipFile)}
                                alt="Slip Preview"
                                className="mt-4 w-64 h-64 object-cover rounded-lg shadow-lg"
                            />
                        </div>
                    )}

                    {/* Submit Button */}
                    <div className="mt-10 flex gap-6">
                        <button
                            className="w-full bg-gray-200 text-gray-800 py-4 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                            onClick={() => router.push("../exercise/calculate_price")}
                        >
                            แก้ไขรายการ
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-br from-green-500 to-teal-500 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-teal-600 transition-transform hover:scale-105">
                            ยืนยันการสั่งซื้อ
                        </button>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}
