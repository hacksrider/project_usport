/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

export default function EditService() {
    const params = useParams()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [data2, setData] = useState();
    const [emp_name, setEmp_Name] = useState("");
    const [emp_lastname, setEmp_Lastname] = useState("");
    const [emp_sex, setEmp_Sex] = useState("");
    const [emp_tel, setEmp_Tel] = useState("");
    const [emp_email, setEmp_Email] = useState("");
    const [emp_job, setEmp_Job] = useState(false);
    const [emp_username, setEmp_Username] = useState("");
    const [emp_password, setEmp_Password] = useState("");
    // const [Status, setStatus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();




    useEffect(() => {
        getEmployeesID()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getEmployeesID = () => {
        axios.get(`/api/admin/${params.id}`).then((response) => {
            setData(response.data.data);
            // setservice_name(response.data.data.service_name);
            setEmp_Name(response.data.emp_name);
            setEmp_Lastname(response.data.emp_lastname);
            setEmp_Sex(response.data.emp_sex);
            setEmp_Tel(response.data.emp_tel);
            setEmp_Email(response.data.emp_email);
            setEmp_Job(response.data.emp_job);
            setEmp_Username(response.data.emp_username);
            setEmp_Password(response.data.emp_password);

            // setStatus(response.data.data.Status);
        });
    };





    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.put(`/api/admin/${params.id}`, {
                emp_name,
                emp_lastname,
                emp_sex,
                emp_tel,
                emp_job,
                emp_email,
                emp_username,
                emp_password,
            });

            if (response.status === 200) {
                alert("บันทึกข้อมูลเรียบร้อย!");
                router.push("/pages/admin/employees");
                // window.location.href = "/pages/admin/employees";
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
        } finally {
            setLoading(false);
        }
    };


    return (
        <MainLayoutAdmin>
            <h1 className="text-3xl font-bold mb-6 text-black ml-2">แก้ไขข้อมูลพนักงาน</h1>
            <div className="w-full bg-gray-300 ml-2 p-8 rounded-lg shadow-lg relative">
                <form className="grid grid-cols-1 gap-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="emp_name" className="block text-sm font-medium text-gray-700">ชื่อ</label>
                            <input
                                type="text"
                                id="emp_name"
                                value={emp_name}
                                required
                                onChange={(e) => setEmp_Name(e.target.value)}
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
                                onChange={(e) => setEmp_Lastname(e.target.value)}
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
                                onChange={(e) => setEmp_Sex(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="ไม่ระบุ">ไม่ระบุ</option>
                                <option value="ชาย">ชาย</option>
                                <option value="หญิง">หญิง</option>
                                <option value="LGBTQ">LGBTQ</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="emp_tel" className="block text-sm font-medium text-gray-700">เบอร์โทร</label>
                            <input
                                type="tel"
                                id="emp_tel"
                                value={emp_tel}
                                onChange={(e) => setEmp_Tel(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="เบอร์โทร"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="emp_email" className="block text-sm font-medium text-gray-700">อีเมล</label>
                            <input
                                type="email"
                                id="emp_email"
                                value={emp_email}
                                onChange={(e) => setEmp_Email(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="อีเมล"
                            />
                        </div>
                        <div>
                            <label htmlFor="emp_job" className="block text-sm font-medium text-gray-700">ตำแหน่ง</label>
                            <select
                                id="emp_job"
                                value={emp_job ? "true" : "false"}
                                onChange={(e) => setEmp_Job(e.target.value === "true")}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="true">ผู้จัดการ</option>
                                <option value="false">พนักงาน</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="emp_username" className="block text-sm font-medium text-gray-700">ชื่อผู้ใช้</label>
                            <input
                                type="text"
                                id="emp_username"
                                value={emp_username}
                                required
                                onChange={(e) => setEmp_Username(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Username"
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="emp_password" className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="emp_password"
                                value={emp_password}
                                onChange={(e) => setEmp_Password(e.target.value)}
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Password"
                            />
                            <span
                                onClick={() => setShowPassword}
                                className="absolute inset-y-0 top-6 right-3 flex items-center cursor-pointer"
                            >
                                {/* {showPassword ? <FaEyeSlash /> : <FaEye />} */}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {loading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
                    </button>
                </form>
            </div>
        </MainLayoutAdmin>
    );
}
