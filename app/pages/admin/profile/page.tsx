/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";
import axios from "axios";
import { useSession } from "next-auth/react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function ProfileAdmin() {
  // const router = useRouter();
  const { data: session } = useSession();
  const [adminData, setAdminData] = useState<any>(null); // แก้ไขตามโครงสร้างข้อมูล API ของคุณ
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        // @ts-expect-error
        const adminId = session?.user?.id;
        if (adminId) {
          const response = await axios.get(`/api/admin/${adminId}`);
          if (response.status === 200) {
            setAdminData(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [session]);

  if (isLoading) {
    return (
      <MainLayoutAdmin>
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl font-semibold text-gray-100">กำลังโหลดข้อมูล...</p>
        </div>
      </MainLayoutAdmin>
    );
  }

  if (!adminData) {
    return (
      <MainLayoutAdmin>
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl font-semibold text-gray-700">ไม่พบข้อมูล</p>
        </div>
      </MainLayoutAdmin>
    );
  }

  return (
    <MainLayoutAdmin>
      {/* <h1 className="text-2xl font-semibold mb-3 ml-2 text-black ml-[220px]">โปรไฟล์</h1> */}
      <div className="w-[800px] bg-gray-300 p-6 rounded shadow-md mx-auto mb-10 mt-6">

        <div className="mx-auto w-full max-w-[850px] my-2">
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
                  src="/user/img/user.jpeg"
                  alt="User Profile"
                  className="w-full h-full rounded-full mx-auto mb-4 object-cover border border-gray-300"
                />
              </div>
              <div className="mt-4">
                <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
                  {adminData.data.emp_username + adminData.data.emp_lastname || "N/A"}
                </h3>
                {/* <p className="font-medium">{adminData.data.emp_job || "N/A"}</p> */}
                {adminData.data.emp_job ? <p className="text-sm text-gray-400">ผู้จัดการ</p> : <p className="text-sm text-gray-400">พนักงาน</p>}
                <div className="mx-auto max-w-[450px]">
                  <div className="col-span-2 p-6">
                    <h3 className="text-xl font-semibold text-gray-700 mb-6">ข้อมูลส่วนตัว</h3>
                    <table className="table-auto w-full text-left border-collapse border border-gray-300">
                      <tbody>
                        <tr>
                          <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">ชื่อ</td>
                          <td className="px-4 py-2 border border-gray-300">{adminData.data.emp_name}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">นามสกุล</td>
                          <td className="px-4 py-2 border border-gray-300"> {adminData.data.emp_lastname}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">ชื่อผู้ใช้</td>
                          <td className="px-4 py-2 border border-gray-300">{adminData.data.emp_username}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">เพศ</td>
                          <td className="px-4 py-2 border border-gray-300">{adminData.data.emp_sex}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">มือถือ</td>
                          <td className="px-4 py-2 border border-gray-300">{adminData.data.emp_tel || "ไม่ระบุ"}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2 border border-gray-300 font-semibold text-gray-800">ตำแหน่ง</td>
                          <td className="px-4 py-2 border border-gray-300">{adminData.data.emp_job ? "ผู้จัดการ" : "พนักงาน"}</td>
                        </tr>
                      </tbody>
                    </table>
                    {/* <div className="mt-8 text-center">
                      <button
                        onClick={() => router.push("/pages/user/profile/edit_profile")}
                        className="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700 transition"
                      >
                        แก้ไขข้อมูล
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayoutAdmin>
  );
}
