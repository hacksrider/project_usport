/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
'use client';

import MainLayout from "@/app/components/mainLayout";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { ServiceToSave } from "@/app/interface/buyingExercise";
import axios from "axios";
import { UserInterface } from "@/app/interface/user";
import { useSession } from "next-auth/react";

export default function Payment() {
    const router = useRouter();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("bankTransfer");
    const [slipFile, setSlipFile] = useState<File | null>(null);
    const [totalAmount, setTotalAmount] = useState<number>(0); // Default value
    const [timeLeft, setTimeLeft] = useState<string>("15:00");
    const [selectedActivities, setSelectedActivities] = useState<ServiceToSave[]>([]);
    const { data } = useSession();
    const userData = data as UserInterface;
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const secondsLeftRef = useRef<number>(15 * 60); // 15 minutes in seconds

    const startCountdown = () => {
        // Clear existing timer if any
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        // Set initial time to 15 minutes (900 seconds)
        secondsLeftRef.current = 15 * 60;
        updateTimeDisplay();

        // Start the countdown
        timerRef.current = setInterval(() => {
            secondsLeftRef.current -= 1;
            
            // Check if countdown is complete
            if (secondsLeftRef.current <= 0) {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                alert("เวลาในการชำระเงินหมดลงแล้ว กรุณาทำรายการใหม่");
                router.push("../exercise");
            }
            
            updateTimeDisplay();
        }, 1000);
    };

    const updateTimeDisplay = () => {
        const minutes = Math.floor(secondsLeftRef.current / 60);
        const seconds = secondsLeftRef.current % 60;
        setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    const handleCancel = () => {
        // Reset timer when cancel button is clicked
        startCountdown();
        router.push("/pages/user/exercise/pageExercise");
    };

    const handleSubmitToSave = async () => {
        if ((selectedPaymentMethod === "bankTransfer" || selectedPaymentMethod === "qr_code") && !slipFile) {
            alert("กรุณาแนบสลิปการโอนเงิน");
            return;
        }
        try {
            const fData = new FormData();
            if (slipFile) {
                fData.append("payment_confirmation", slipFile);
            }

            if (!userData.user?.id) {
                throw new Error("User ID is missing");
            }

            fData.append("user_ID", userData.user.id.toString());
            fData.append("buying_date", new Date().toISOString());
            fData.append("dataToCreate", JSON.stringify(selectedActivities));

            const res = await axios.post("/api/buyingexercise", fData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.status === 200) {
                // Clear the timer when payment is successful
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                alert("การชำระเงินสำเร็จ! ระบบจะดำเนินการต่อ");
                router.push("/pages/user/purchase_order");
                // console.log("Success:", res.data);
            } else {
                console.error("Error:", res.data);
            }
        } catch (error) {
            console.error("Error during form submission:", error);
        }
    };

    useEffect(() => {
        const activitiesData = sessionStorage.getItem("serviceToSave2");

        const storedTotal = sessionStorage.getItem("totalAll");
        if (storedTotal) {
            setTotalAmount(parseFloat(storedTotal));
        }
        if (activitiesData) {
            setSelectedActivities(JSON.parse(activitiesData));
        }

        // Start countdown when component mounts
        startCountdown();

        // Clean up timer on component unmount
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

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
                        <div className="text-2xl font-bold text-green-500 mb-4">฿ {totalAmount} <span className="text-black">บาท</span></div>
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
                            onClick={handleCancel}
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={handleSubmitToSave}
                            className="w-full bg-gradient-to-br from-green-500 to-teal-500 text-white py-4 rounded-xl font-bold hover:from-green-600 hover:to-teal-600 transition-transform hover:scale-105">
                            ยืนยันการสั่งซื้อ
                        </button>
                    </div>
                </div>

            </div>
        </MainLayout>
    );
}