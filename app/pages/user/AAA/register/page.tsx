"use client";
import axios from "axios";
import MainLayout from "@/app/components/mainLayout";
import { useState } from "react";
import { useRouter } from "next/navigation";

const RegisterForm: React.FC = () => {
    const [formData, setFormData] = useState({
        user_name: "",
        user_lastname: "",
        sex: "",
        user_date_of_birth: "",
        user_tel: "",
        ID_card_photo: File,
        accom_rent_contrac_photo: File,
        user_username: "",
        user_password: "",
        user_email: "",
        password: "",
        consent: false,
    });
    const router = useRouter();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement; // หรือ HTMLSelectElement
        const { name, value, type } = target;
    
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? (target as HTMLInputElement).checked : value,
        });
    };
    

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.user_password !== formData.password) {
            alert("รหัสผ่านไม่ตรงกัน!");
            return;
        }
        if (!formData.consent) {
            alert("กรุณายินยอมการเปิดเผยข้อมูล!");
            return;
        }
        console.log("Form submitted:", formData);

        try {
            const apiFormData = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "ID_card_photo" || key === "accom_rent_contrac_photo") {
                    if (value instanceof File) {
                        apiFormData.append(key, value);
                    }
                } else {
                    apiFormData.append(key, String(value));
                }
            });
            const response = await axios.post("/api/user", apiFormData);
            if (response.status === 200) {
                alert("ลงทะเบียนสำเร็จ!");
                router.push("/pages/user/AAA/login");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 409) {
                    alert("ชื่อผู้ใช้ หรือ อีเมล ถูกใช้ไปแล้ว");
                } else {
                    alert(error.message);
                }
            } else {
                console.error(error);
            }
            return console.error(error);
        }
    };

    return (
        <MainLayout>
            <div className="mt-8 mb-8 w-[800px] mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">ลงทะเบียน</h2>
                <p className="mb-6 text-gray-600">กรอกข้อมูลของคุณเพื่อสร้างบัญชี</p>
                <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-4">
                    <div className="mb-4 col-span-3">
                        <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
                            ชื่อ
                        </label>
                        <input
                            type="text"
                            id="user_name"
                            name="user_name"
                            placeholder="กรอกชื่อของคุณ"
                            value={formData.user_name}
                            onChange={handleChange}
                            className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-4 col-span-3">
                        <label htmlFor="user_lastname" className="block text-sm font-medium text-gray-700">
                            นามสกุล
                        </label>
                        <input
                            type="text"
                            id="user_lastname"
                            name="user_lastname"
                            placeholder="กรอกนามสกุลของคุณ"
                            value={formData.user_lastname}
                            onChange={handleChange}
                            className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-4 col-span-2">
                        <label htmlFor="user_tel" className="block text-sm font-medium text-gray-700">
                            เบอร์โทรศัพท์
                        </label>
                        <input
                            type="tel"
                            id="user_tel"
                            name="user_tel"
                            placeholder="กรอกเบอร์โทรศัพท์ของคุณ"
                            value={formData.user_tel}
                            onChange={handleChange}
                            className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-4 col-span-2">
                        <label htmlFor="user_date_of_birth" className="block text-sm font-medium text-gray-700">
                            วันเกิด
                        </label>
                        <input
                            type="date"
                            id="user_date_of_birth"
                            name="user_date_of_birth"
                            placeholder="กรอกวันเกิดของคุณ"
                            value={formData.user_date_of_birth}
                            onChange={handleChange}
                            className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-4 col-span-2">
                        <label htmlFor="sex" className="block text-sm font-medium text-gray-700">
                            เพศ
                        </label>
                        <select
                            id="sex"
                            name="sex"
                            value={formData.sex}
                            onChange={handleChange}
                            className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="">เลือกเพศ</option>
                            <option value="ชาย">ชาย</option>
                            <option value="หญิง">หญิง</option>
                            <option value="LGBTQSA+">LGBTQSA+</option>
                        </select>
                    </div>
                    
                    <div className="mb-4 col-span-3">
                        <label htmlFor="ID_card_photo" className="block text-sm font-medium text-gray-700">
                            รูปบัตรประชาชน
                        </label>
                        <input
                            type="file"
                            id="ID_card_photo"
                            name="ID_card_photo"
                            onChange={handleFileChange}
                            className="p-2 h-10 block w-full text-sm text-gray-700 border border-black rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4 col-span-3">
                        <label htmlFor="accom_rent_contrac_photo" className="block text-sm font-medium text-gray-700">
                            รูปสัญญาเช่า
                        </label>
                        <input
                            type="file"
                            id="accom_rent_contrac_photo"
                            name="accom_rent_contrac_photo"
                            onChange={handleFileChange}
                            className="p-2 h-10 block w-full text-sm text-gray-700 border border-black rounded-md"
                        />
                    </div>
                    <div className="mb-4 col-span-3">
                        <label htmlFor="user_username" className="block text-sm font-medium text-gray-700">
                            ชื่อผู้ใช้
                        </label>
                        <input
                            type="text"
                            id="user_username"
                            name="user_username"
                            placeholder="กรอกชื่อผู้ใช้"
                            value={formData.user_username}
                            onChange={handleChange}
                            className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-4 col-span-3">
                        <label htmlFor="user_email" className="block text-sm font-medium text-gray-700">
                            อีเมล
                        </label>
                        <input
                            type="email"
                            id="user_email"
                            name="user_email"
                            placeholder="กรอกอีเมลของคุณ"
                            value={formData.user_email}
                            onChange={handleChange}
                            className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-4 col-span-3">
                        <label htmlFor="user_password" className="block text-sm font-medium text-gray-700">
                            รหัสผ่าน
                        </label>
                        <input
                            type="password"
                            id="user_password"
                            name="user_password"
                            placeholder="กรอกรหัสผ่านของคุณ"
                            value={formData.user_password}
                            onChange={handleChange}
                            className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-4 col-span-3">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            ยืนยันรหัสผ่าน
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="กรอกยืนยันรหัสผ่าน"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-4 col-span-6">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="consent"
                                checked={formData.consent}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            ฉันยินยอมให้เปิดเผยข้อมูลของฉัน
                        </label>
                    </div>
                    <div className="col-span-6 ">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            ลงทะเบียน
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-gray-600">
                    มีบัญชีแล้ว? <a onClick={() => router.push('/pages/user/AAA/login')} className="text-indigo-600 hover:underline">เข้าสู่ระบบ</a>
                </p>
            </div>
        </MainLayout>
    );
};

export default RegisterForm;
