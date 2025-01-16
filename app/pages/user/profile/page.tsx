/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import MainLayout from "@/app/components/mainLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

function formatDateThai(dateString: string): string {
  const date = new Date(dateString);
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear() + 543; // แปลงเป็นปี พ.ศ.
  return `${day} ${month} ${year}`;
}

function calculateAge(dateString: string): number {
  const birthDate = new Date(dateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function Profile() {
  const { data: session } = useSession();
  const [userData, setUserData] = useState<any>(null); // แก้ไขตามโครงสร้างข้อมูล API ของคุณ
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = session?.user?.id;
        if (userId) {
          const response = await axios.get(`/api/user/${userId}`);
          if (response.status === 200) {
            setUserData(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

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

  if (!userData) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl font-semibold text-gray-700">ไม่พบข้อมูลผู้ใช้</p>
        </div>
      </MainLayout>
    );
  }
  console.log("----------------", userData)
  const dateOfBirth = userData.user_date_of_birth || "";
  const formattedDate = dateOfBirth ? formatDateThai(dateOfBirth) : "N/A";
  const age = dateOfBirth ? calculateAge(dateOfBirth) : "N/A";

  return (
    <MainLayout>
      <div className="mx-auto w-full max-w-[850px] my-10">
        <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
          <div className="relative z-20 h-[250px] md:h-65">
            <img
              src="/user/img/football-5.jpg"
              alt="profile cover"
              className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 rounded-tl-[10px] rounded-tr-[10px]"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-white text-[60px] font-bold">PROFILE</h1>
            </div>
          </div>

          <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
            <div className="relative z-30 mx-auto -mt-22 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
              <img
                src={userData.user_profile_picture ? `/${userData.user_profile_picture}` : "/user/img/user.jpeg"}
                alt="User Profile"
                className="w-full h-full rounded-full mx-auto mb-4 object-cover border border-gray-300"
              />
            </div>
            <div className="mt-4">
              <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
                {userData.user_username || "N/A"}
              </h3>
              <p className="font-medium">{userData.user_email || "N/A"}</p>
              <div className="mx-auto max-w-[720px]">
                <div className="col-span-2 p-6">
                  <h3 className="text-xl font-semibold text-gray-700 mb-6">ข้อมูลส่วนตัว</h3>
                  <table className="table-auto w-full text-left border-collapse border border-gray-300">
                    <tbody>
                      <tr>
                        <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">ชื่อ - นามสกุล</td>
                        <td className="px-4 py-2 border border-gray-300">{userData.user_name} {userData.user_lastname}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">อีเมล</td>
                        <td className="px-4 py-2 border border-gray-300">{userData.user_email}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">วัน/เดือน/ปี เกิด</td>
                        <td className="px-4 py-2 border border-gray-300">{formattedDate}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">อายุ</td>
                        <td className="px-4 py-2 border border-gray-300">{age} ปี</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">มือถือ</td>
                        <td className="px-4 py-2 border border-gray-300">{userData.user_tel}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">เพศ</td>
                        <td className="px-4 py-2 border border-gray-300">{userData.sex}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => router.push("/pages/user/profile/edit_profile")}
                      className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition"
                    >
                      แก้ไขข้อมูล
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
