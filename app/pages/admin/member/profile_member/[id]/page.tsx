/* eslint-disable @next/next/no-img-element */
"use client";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfileMember() {
    const router = useRouter();
    const params = useParams();
    const userId = params.id;

    const [userData, setUserData] = useState({
        user_name: "",
        user_lastname: "",
        user_date_of_birth: "",
        user_email: "",
        user_tel: "",
        user_username: "",
        sex: "",
        status_of_VIP: false,
        ID_card_photo: null,
        accom_rent_contrac_photo: null,
        user_profile_picture: null,
    });

    const formatDate = (dateString: string | number | Date) => {
        const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear() + 543; // Convert to Thai Buddhist year
        return `${day} ${month} ${year}`;
    };

    const calculateAge = (dateString: string | number | Date) => {
        const birthDate = new Date(dateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`/api/user/${userId}`);
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                alert("ไม่สามารถดึงข้อมูลสมาชิกได้");
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    return (
        <MainLayoutAdmin>
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-4 text-gray-900">ข้อมูลสมาชิก</h1>
            </div>
            <div className="max-w-5xl mx-auto bg-gray-200 p-6 rounded-lg shadow-xl">
                <div className="flex flex-col md:flex-row gap-10">
                    {/* Profile Picture */}
                    <div className="w-full md:w-1/3 text-center">
                        <img
                            src={userData.user_profile_picture ? `http://localhost:4000/${userData.user_profile_picture}` : "/user/img/user.jpeg"}
                            alt="Profile Picture"
                            className="w-40 h-40 rounded-full mx-auto border-4 border-gray-300 shadow-md"
                        />
                        <p className="mt-4 text-xl font-semibold text-gray-700">{userData.user_name} {userData.user_lastname}</p>
                        <div className="pt-2">
                            {userData.status_of_VIP && (
                                <label className="mt-2 w-fit mx-auto mx-3 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                                    VIP
                                </label>
                            )}
                            <label className="mt-2 w-fit mx-auto mx-3 px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                                MEMBER
                            </label>
                        </div>
                    </div>

                    {/* Member Info */}
                    <div className="w-full md:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">ชื่อ</label>
                                <p className="mt-0 text-lg font-medium text-gray-800">{userData.user_name}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">นามสกุล</label>
                                <p className="mt-0 text-lg font-medium text-gray-800">{userData.user_lastname}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">วันเกิด</label>
                                <p className="mt-0 text-lg font-medium text-gray-800">{userData.user_date_of_birth ? formatDate(userData.user_date_of_birth) : "-"}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">อายุ</label>
                                <p className="mt-0 text-lg font-medium text-gray-800">{userData.user_date_of_birth ? calculateAge(userData.user_date_of_birth) : "-"}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">ชื่อผู้ใช้</label>
                                <p className="mt-0 text-lg font-medium text-gray-800">{userData.user_username}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600">อีเมล</label>
                                <p className="mt-0 text-lg font-medium text-gray-800">{userData.user_email}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">เบอร์โทร</label>
                                <p className="mt-0 text-lg font-medium text-gray-800">{userData.user_tel}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">เพศ</label>
                                <p className="mt-0 text-lg font-medium text-gray-800">{userData.sex}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Supporting Documents */}
                <div className="mt-4 flex items-center justify-center flex-col col-span-2">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3 col-span-1">เอกสารสนับสนุน</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
                        <div className="flex flex-col items-center col-span-1">
                            <label className="block text-sm font-medium text-gray-600">รูปบัตรประชาชน</label>
                            <img
                                src={userData.ID_card_photo ? `http://localhost:4000/${userData.ID_card_photo}` : "/user/img/noimage.jpg"}
                                alt="ID Card"
                                className="mt-2 w-full rounded-lg border-2 border-gray-200 shadow-md md:w-1/2"
                            />
                        </div>

                        <div className="flex flex-col items-center col-span-1">
                            <label className="block text-sm font-medium text-gray-600">รูปหลักฐานการอาศัย</label>
                            <img
                                src={userData.accom_rent_contrac_photo ? `http://localhost:4000/${userData.accom_rent_contrac_photo}` : "/user/img/noimage.jpg"}
                                alt="Accommodation Proof"
                                className="mt-2 w-full rounded-lg border-2 border-gray-200 shadow-md md:w-1/2"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end col-span-3 gap-4 text-right">
                    <button
                        onClick={() => router.push(`/pages/admin/member/${userId}`)}
                        className="px-8 py-3 bg-indigo-600 text-white text-lg rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >แก้ไข
                    </button>
                </div>

            </div>
        </MainLayoutAdmin>
    );
}
