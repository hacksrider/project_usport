/* eslint-disable @next/next/no-img-element */
"use client";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";
import { AdminInterface, ResDataAdmin, ResGetAllAdmin } from "@/app/interface/admin";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Employees() {
  const router = useRouter();
  const [dataAdmin, setDataAdmin] = useState<ResDataAdmin[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);

  const adminApi = async () => {
    try {
      const res = await axios.get<ResGetAllAdmin>("/api/admin");
      setDataAdmin(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/${id}`);
      alert("ลบสำเร็จ");
      setShowPopup(false);
      adminApi(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting admin:", error);
      alert("ไม่สามารถลบได้");
    }
  };

  useEffect(() => {
    adminApi();
  }, []);

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

  return (
    <MainLayoutAdmin>
      {/* <h1 className="text-2xl font-semibold mb-3 text-black ml-20">พนักงาน</h1> */}
      <div className="w-[1150px] bg-gray-300 ml-2 mb-10 mt-6 p-6 rounded-lg shadow-md relative left-[45px] ">
        <span className="absolute top-4 left-4 text-black font-semibold text-3xl mt-4 ml-[35px]">
          รายชื่อพนักงาน
        </span>
        <button
          onClick={() => router.push("/pages/admin/employees/add_employee")}
          className="absolute top-4 right-4 bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600 transition mb-4 font-semibold flex items-center space-x-2 mr-[35px] mt-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          เพิ่มพนักงานใหม่
        </button>

        <div className="flex justify-center">
          <div className="p-4 mt-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {dataAdmin
                .sort((a, b) =>
                  a.emp_username === userData.user.emp_username
                    ? -1
                    : b.emp_username === userData.user.emp_username
                      ? 1
                      : 0
                )
                .map((admin, index) => (
                  <div
                    key={index}
                    className={`w-[350px] p-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 mx-auto ${admin.emp_username === userData.user.emp_username ? "bg-yellow-100" : "bg-white"
                      }`}
                  >
                    <div className="flex items-center mb-4 justify-stretch">
                      <img
                        src={
                          admin.emp_sex === "ชาย"
                            ? "/user/img/adminM.png"
                            : admin.emp_sex === "หญิง"
                              ? "/user/img/adminF.png"
                              : "/user/img/adminAll.png"
                        }
                        alt="Admin"
                        className="w-25 h-25 rounded-full mr-4 border border-gray-300"
                      />
                      <div>
                        <h3 className="text-[18px] font-semibold text-gray-800">
                          {admin.emp_name} {admin.emp_lastname}
                        </h3>
                        <p className="text-sm text-gray-600">
                          <span className="text-black font-semibold">ชื่อผู้ใช้:</span>{" "}
                          {admin.emp_username || "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="text-black font-semibold">อีเมล:</span>{" "}
                          {admin.emp_email || "ไม่ระบุ"}
                        </p>
                        {/* <p className="text-sm text-gray-600">
                          <span className="text-black font-semibold">เพศ:</span>{" "}
                          {admin.emp_sex || "ไม่ระบุ"}
                          </p> */}
                        <p className="text-sm text-gray-600">
                          <span className="text-black font-semibold">เบอร์โทร:</span>{" "}
                          {admin.emp_tel || "ไม่ระบุ"}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="text-black font-semibold">ตำแหน่ง:</span>{" "}
                          {admin.emp_job ? "ผู้จัดการ" : "พนักงาน"}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => router.push(`/pages/admin/employees/${admin.emp_ID}`)}
                        className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
                      >
                        ✏️ แก้ไข
                      </button>
                      {admin.emp_username === userData.user.emp_username ? (
                        ""
                      ) : (
                        <button
                          onClick={() => {
                            setShowPopup(true);
                            setSelectedAdmin(`${admin.emp_ID}`);
                          }}
                          className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                        >
                          🗑️ ลบ
                        </button>
                      )}

                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-4">คุณแน่ใจหรือไม่ที่จะลบพนักงานคนนี้?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                ยกเลิก
              </button>
              <button
                onClick={() => {
                  if (selectedAdmin) {
                    handleDelete(selectedAdmin);
                  }
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                ตกลง
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayoutAdmin>
  );
}
