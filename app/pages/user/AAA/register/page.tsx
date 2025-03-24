/* eslint-disable @typescript-eslint/ban-ts-comment */
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
        ID_card_photo: undefined, // กำหนดค่าเริ่มต้นเป็น undefined
        accom_rent_contrac_photo: undefined,
        user_username: "",
        user_password: "",
        user_email: "",
        confirm_password: "",
        consent: false,
        datacorect: false,
    });

    const [passwordValidation, setPasswordValidation] = useState({
        number: false,
        length: false,
        upperLowerCase: false,
        specialCharacter: false,
    });

    // state สำหรับติดตามสถานะการส่งข้อมูล
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const target = e.target as HTMLInputElement;
        const { name, value, type } = target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? target.checked : value,
        });

        if (name === "user_password") {
            setPasswordValidation({
                length: value.length >= 8,
                number: /\d/.test(value),
                upperLowerCase: /[A-Z]/.test(value) && /[a-z]/.test(value),
                specialCharacter: /[_.\-!@]/.test(value),
            });
        }
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

        // ถ้ากำลังส่งข้อมูลอยู่ให้หยุดทำงาน
        if (isSubmitting) return;
        setIsSubmitting(true);

        if (formData.user_password !== formData.confirm_password) {
            alert("รหัสผ่านไม่ตรงกัน!");
            setIsSubmitting(false);
            return;
        }

        if (!formData.consent) {
            alert("กรุณายินยอมการเปิดเผยข้อมูล!");
            setIsSubmitting(false);
            return;
        }
        if (!formData.datacorect) {
            alert("กรุณากดปุ่มรับรองข้อมูล!");
            setIsSubmitting(false);
            return;
        }

        if (formData.user_tel.length !== 10) {
            alert("เบอร์โทรศัพท์ต้องมี 10 ตัวอักษร");
            setIsSubmitting(false);
            return;
        }

        console.log("Form submitted:", formData);

        try {
            const apiFormData = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                if (key === "ID_card_photo" || key === "accom_rent_contrac_photo") {
                    // @ts-expect-error
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
            // รีเซ็ต isSubmitting ในกรณีเกิดข้อผิดพลาดเพื่อให้สามารถลองส่งใหม่ได้
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <div className="mt-8 mb-8 w-[800px] mx-auto bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-4">ลงทะเบียน</h2>
                <p className="mb-6 text-gray-600">กรอกข้อมูลของคุณเพื่อสมัครสมาชิก</p>
                <form onSubmit={handleSubmit} className="grid grid-cols-6 gap-4">
                    <div className="mb-4 col-span-3">
                        <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
                            ชื่อ <span className="text-red-500">*</span>
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
                            นามสกุล <span className="text-red-500">*</span>
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
                            เบอร์โทรศัพท์ <span className="text-red-500">*</span>
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
                            วันเกิด <span className="text-red-500">*</span>
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
                            เพศ <span className="text-red-500">*</span>
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
                            <option value="LGBTQ+">LGBTQ+</option>
                            <option value="ไม่ระบุ">ไม่ระบุ</option>
                        </select>
                    </div>

                    <div className="mb-4 col-span-3">
                        <label htmlFor="ID_card_photo" className="block text-sm font-medium text-gray-700">
                            รูปบัตรประชาชน <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="file"
                            id="ID_card_photo"
                            name="ID_card_photo"
                            accept=".jpg, .jpeg, .png"
                            onChange={handleFileChange}
                            className="p-2 h-10 block w-full text-sm text-gray-700 border border-black rounded-md"
                            required
                        />
                    </div>
                    <div className="mb-4 col-span-3">
                        <label htmlFor="accom_rent_contrac_photo" className="block text-sm font-medium text-gray-700">
                            รูปสัญญาเช่า <span className="text-gray-700">(ถ้ามี)</span>
                        </label>
                        <input
                            type="file"
                            id="accom_rent_contrac_photo"
                            name="accom_rent_contrac_photo"
                            accept=".jpg, .jpeg, .png"
                            onChange={handleFileChange}
                            className="p-2 h-10 block w-full text-sm text-gray-700 border border-black rounded-md"
                        />
                    </div>
                    <div className="mb-4 col-span-3">
                        <label htmlFor="user_username" className="block text-sm font-medium text-gray-700">
                            ชื่อผู้ใช้ <span className="text-red-500">*</span>
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
                            อีเมล <span className="text-red-500">*</span>
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
                            รหัสผ่าน <span className="text-red-500">*</span>
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
                        <ul className="text-sm mt-2">
                            <li className={`flex items-center ${passwordValidation.length ? "text-green-600" : "text-red-600"}`}>
                                {passwordValidation.length ? "✔" : "✘"} ความยาวมากกว่า 8 ตัวอักษร
                            </li>
                            <li className={`flex items-center ${passwordValidation.upperLowerCase ? "text-green-600" : "text-red-600"}`}>
                                {passwordValidation.upperLowerCase ? "✔" : "✘"} มีอักษรตัวพิมพ์ใหญ่และเล็กรวมกัน
                            </li>
                            <li className={`flex items-center ${passwordValidation.number ? "text-green-600" : "text-red-600"}`}>
                                {passwordValidation.number ? "✔" : "✘"} มีตัวเลข
                            </li>
                            <li className={`flex items-center ${passwordValidation.specialCharacter ? "text-green-600" : "text-red-600"}`}>
                                {passwordValidation.specialCharacter ? "✔" : "✘"} มีอักษรพิเศษ เช่น _ . - ! @
                            </li>
                        </ul>
                    </div>
                    <div className="mb-4 col-span-3">
                        <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
                            ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            placeholder="กรอกยืนยันรหัสผ่าน"
                            value={formData.confirm_password}
                            onChange={handleChange}
                            className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="mb-4 col-span-6">
                        <label className="flex items-center mb-2 mr-2">
                            <input
                                type="checkbox"
                                name="datacorect"
                                checked={formData.datacorect}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            ฉันขอรับรองว่าข้อมูลถูกต้อง <span className="text-red-500">*</span>
                        </label>
                        <label className="flex items-center mr-2">
                            <input 
                                type="checkbox"
                                name="consent"
                                checked={formData.consent}
                                onChange={handleChange}
                                className="mr-2"
                            />
                            ฉันยินยอมให้เปิดเผยข้อมูลของฉัน <span className="text-red-500">*</span>
                        </label>
                    </div>
                    <div className="col-span-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 text-white py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isSubmitting ? "กำลังส่ง..." : "ลงทะเบียน"}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                <button className="mt-6 text-gray-600">
                    มีบัญชีแล้ว? <a onClick={() => router.push('/pages/user/AAA/login')} className="text-indigo-600 hover:underline">เข้าสู่ระบบ</a>
                </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default RegisterForm;
