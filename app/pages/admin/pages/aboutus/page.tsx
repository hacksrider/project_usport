"use client";
import React from "react";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";

export default function About_admin() {

    return (
        <MainLayoutAdmin>
            <h1 className="text-2xl font-semibold mb-3 ml-2 text-black">หน้าเกี่ยวกับเรา</h1>
            <div className="w-full bg-gray-300 ml-2 p-6 rounded shadow-md">
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            หัวข้อ
                        </label>
                        <input
                            type="text"
                            className="w-full p-2 mt-2 border rounded"
                            placeholder="กรุณากรอกหัวข้อ"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            รายละเอียด
                        </label>
                        <textarea
                            className="w-full p-2 mt-2 border rounded"
                            placeholder="กรุณากรอกรายละเอียด"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            รูปภาพแบนเนอร์
                        </label>
                        <input
                            type="file"
                            className="w-full p-2 mt-2 border rounded bg-slate-50"
                            placeholder="กรุณากรอก URL รูปภาพแบนเนอร์"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            รายละเอียดกีฬา 1
                        </label>
                        <textarea
                            className="w-full p-2 mt-2 border rounded"
                            placeholder="กรุณากรอกรายละเอียดกีฬา 1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            รายละเอียดกีฬา 2
                        </label>
                        <textarea
                            className="w-full p-2 mt-2 border rounded"
                            placeholder="กรุณากรอกรายละเอียดกีฬา 2"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            คลิปวิดีโอ
                        </label>
                        <input
                            type="file"
                            className="w-full p-2 mt-2 border rounded bg-slate-50"
                            placeholder="กรุณากรอกลิงก์วิดีโอ"
                        />
                    </div>

                    {/* Exercise Sections */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">หัวข้อการออกกำลังกาย</h2>
                        <div className="bg-white p-4 rounded shadow mt-4 relative">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">ชื่อหัวข้อการออกกำลังกาย</label>
                                <input
                                    type="text"
                                    className="w-full p-2 mt-2 border rounded"
                                    placeholder="กรุณากรอกชื่อหัวข้อ"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">รายละเอียดการออกกำลังกาย</label>
                                <textarea
                                    className="w-full p-2 mt-2 border rounded"
                                    placeholder="กรุณากรอกรายละเอียด"
                                />
                            </div>
                            <button
                                type="button"
                                className="absolute top-2 right-2 text-red-500 text-sm"
                            >
                                ลบ
                            </button>
                        </div>
                        <button
                            type="button"
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                        >
                            เพิ่มหัวข้อการออกกำลังกาย
                        </button>
                    </div>

                    {/* Save Button */}
                    <div className="text-right">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                        >
                            บันทึกการเปลี่ยนแปลง
                        </button>
                    </div>
                </form>
            </div>
        </MainLayoutAdmin>
    );
}
