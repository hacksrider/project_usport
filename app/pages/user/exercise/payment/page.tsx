/* eslint-disable @next/next/no-img-element */
'use client';

import MainLayout from "@/app/components/mainLayout";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function Payment() {
    const router = useRouter();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("bankTransfer");
    const [slipFile, setSlipFile] = useState<File | null>(null);
    const [totalAmount, setTotalAmount] = useState<number>(100); // Default value

    useEffect(() => {
        const storedTotal = sessionStorage.getItem("totalAll");
        if (storedTotal) {
            setTotalAmount(parseFloat(storedTotal));
        }
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
    

    const handleSubmit = () => {
        if ((selectedPaymentMethod === "bankTransfer" || selectedPaymentMethod === "qr_code") && !slipFile) {
            alert("กรุณาแนบสลิปการโอนเงิน");
            return;
        }

        alert("การชำระเงินสำเร็จ! ระบบจะดำเนินการต่อ");
        router.push("/pages/user/exercise/order_summary");
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
                        <div className="text-2xl font-bold text-red-500 mb-4">฿ {totalAmount.toFixed(2)} บาท</div>
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
                            onClick={() => router.push("../exercise")}
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
