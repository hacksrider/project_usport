"use client";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";
import { AdminInterface } from "@/app/interface/admin";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import ไอคอนรูปตา

export default function AddEmployees() {
    const { data } = useSession();
    const userData = data as AdminInterface;

    useEffect(() => {
        if (userData) {
            if (userData.user.emp_job == false) {
                router.push("/pages/admin/dashboard");
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const router = useRouter();
    const [emp_name, setEmpName] = useState("");
    const [emp_lastname, setEmpLastname] = useState("");
    const [emp_sex, setEmpSex] = useState("ไม่ระบุ");
    const [emp_username, setEmpUsername] = useState("");
    const [emp_password, setEmpPassword] = useState("");
    const [emp_tel, setEmpTel] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setLoading(true);

        const data = {
            emp_name,
            emp_lastname,
            emp_sex,
            emp_username,
            emp_password,
            emp_tel,
            emp_job: false, // Always set emp_job to false (0 in database)
        };

        try {
            const response = await axios.post("/api/admin", data);

            if (response.status === 200) {
                alert("บันทึกข้อมูลสำเร็จ!");
                router.push("/pages/admin/employees");
                setEmpName("");
                setEmpLastname("");
                setEmpSex("ไม่ระบุ");
                setEmpUsername("");
                setEmpPassword("");
                setEmpTel("");

            }
        } catch (err) {
            console.error("Error submitting the form:", err);
            alert("ชื่อผู้ใช้ ถูกใช้ไปแล้ว")
            // alert(err.response?.data?.error || "Failed to submit the form");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayoutAdmin>
            <h1 className="text-3xl font-bold mb-6 text-black ml-2">จัดการพนักงาน</h1>
            <div className="w-full bg-gray-300 ml-2 p-8 rounded-lg shadow-lg relative">
                <form className="grid grid-cols-1 gap-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="emp_name" className="block text-sm font-medium text-gray-700">ชื่อ</label>
                            <input
                                type="text"
                                id="emp_name"
                                value={emp_name}
                                required
                                onChange={(e) => setEmpName(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ชื่อพนักงาน"
                            />
                        </div>
                        <div>
                            <label htmlFor="emp_lastname" className="block text-sm font-medium text-gray-700">นามสกุล</label>
                            <input
                                type="text"
                                id="emp_lastname"
                                value={emp_lastname}
                                required
                                onChange={(e) => setEmpLastname(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="นามสกุลพนักงาน"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="emp_sex" className="block text-sm font-medium text-gray-700">เพศ</label>
                            <select
                                id="emp_sex"
                                value={emp_sex}
                                onChange={(e) => setEmpSex(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ไม่ระบุ">ไม่ระบุ</option>
                                <option value="ชาย">ชาย</option>
                                <option value="หญิง">หญิง</option>
                                <option value="LGBTQS+">LGBTQS+</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="emp_tel" className="block text-sm font-medium text-gray-700">เบอร์โทร</label>
                            <input
                                type="tel"
                                id="emp_tel"
                                value={emp_tel}
                                onChange={(e) => setEmpTel(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="เบอร์โทร"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="emp_username" className="block text-sm font-medium text-gray-700">Username</label>
                            <input
                                type="text"
                                id="emp_username"
                                value={emp_username}
                                required
                                onChange={(e) => setEmpUsername(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Username"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="emp_password" className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type={showPassword ? "text" : "password"} // เปลี่ยน type ตาม state
                                id="emp_password"
                                value={emp_password}
                                required
                                onChange={(e) => setEmpPassword(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Password"
                            />
                            {/* Icon toggle */}
                            <span
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 top-6 right-3 flex items-center cursor-pointer"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "กำลังบันทึก..." : "เพิ่มพนักงาน"}
                    </button>
                </form>
            </div>
        </MainLayoutAdmin>
    );
}
