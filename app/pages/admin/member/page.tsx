/* eslint-disable @next/next/no-img-element */
"use client"; // Add this directive to make it a Client Component

import React, { useState, useEffect } from "react";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";
import { ResData, ResGetAllUser } from "@/app/interface/user";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Member() {
    const router = useRouter();
    // State
    const [currentPage, setCurrentPage] = useState(1);
    const [dataUser, setDataUser] = useState<ResData[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("เรียงลําดับ");
    const rowsPerPage = 20;

    // Fetch user data
    useEffect(() => {
        const userApi = async () => {
            try {
                const res = await axios.get<ResGetAllUser>("/api/user");
                setDataUser(res.data.data);
            } catch (error) {
                console.log("Error fetching users:", error);
            }
        };
        userApi();
    }, []); // Dependency array is empty to run only once

    // Handle search
    const filteredDataUser = dataUser.filter((user) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            user.user_name.toLowerCase().includes(searchLower) ||
            user.user_lastname.toLowerCase().includes(searchLower) ||
            user.user_email.toLowerCase().includes(searchLower) ||
            user.user_username.toLowerCase().includes(searchLower)
        );
    });

    // Handle sorting
    const sortedDataUser = [...filteredDataUser].sort((a, b) => {
        switch (sortOption) {
            case "เรียงลําดับ":
                return 0;
            case "A-Z":
                return a.user_name.localeCompare(b.user_name, "en", { sensitivity: "base" });
            case "ก-ฮ":
                return a.user_name.localeCompare(b.user_name, "th", { sensitivity: "base" });
            // case "newest":
            //     return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            // case "oldest":
            //     return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
            default:
                return 0;
        }
    });

    // Calculate pagination
    const totalPages = Math.ceil(sortedDataUser.length / rowsPerPage);
    const paginatedDataUser = sortedDataUser.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <MainLayoutAdmin>
            <h1 className="text-2xl font-semibold mb-3 text-black">สมาชิก</h1>
            <div className="w-full bg-gray-300 p-6 rounded shadow-md">
                <div className="p-0">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">Member Users</h1>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            {/* Search Input */}
                            <input
                                type="text"
                                placeholder="ค้นหา..."
                                className="border rounded p-2 w-full md:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {/* Sort Dropdown */}
                            <select
                                className="border p-2 w-full md:w-64"
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                            >
                                <option value="เรียงลําดับ ">เลือกเรียงลําดับ</option>
                                <option value="A-Z">เรียงลำดับ A-Z</option>
                                <option value="ก-ฮ">เรียงลําดับ ก-ฮ</option>
                                {/* <option value="newest">ข้อมูลใหม่สุดที่เพิ่มเข้า database</option>
                                <option value="oldest">ข้อมูลเก่าสุดที่เพิ่มเข้า database</option> */}
                            </select>
                        </div>
                    </div>

                    {/* User List Section */}
                    <div className="bg-white shadow rounded p-4">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="text-left bg-gray-100">
                                    <th className="px-4 py-2 text-center">#</th>
                                    <th className="px-4 py-2 text-center">รูปภาพ</th>
                                    <th className="px-4 py-2">ชื่อ - นามสกุล</th>
                                    <th className="px-4 py-2">ชื่อผู้ใช้</th>
                                    <th className="px-4 py-2">อีเมล</th>
                                    <th className="px-4 py-2 text-center">VIP</th>
                                    <th className="px-4 py-2 text-center">Member</th>
                                    <th className="px-4 py-2 text-center">เลือก</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedDataUser.map((row, index) => (
                                    <tr key={row.user_ID} className="border-b h-8 text-sm">
                                        <td className="px-4 py-0 text-center border-r">
                                            {(currentPage - 1) * rowsPerPage + index + 1}
                                        </td>
                                        <td className="px-4 py-1 text-center border-r flex items-center justify-center">
                                            <div className="w-6 h-6 bg-blue-200 rounded-full overflow-hidden">
                                                <img
                                                    src={row.user_profile_picture ? `/${row.user_profile_picture}` : "/user/img/user.jpeg"}
                                                    alt="User Image"
                                                    className="w-full h-full object-cover border rounded-full"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-0 border-r"><button className="hover:text-blue-500 hover:underline cursor-pointer" onClick={() => router.push(`/pages/admin/member/profile_member/${row.user_ID}`)}>{row.user_name} {row.user_lastname}</button></td>
                                        <td className="px-4 py-0 border-r">{row.user_username}</td>
                                        <td className="px-4 py-0 border-r">{row.user_email} {row.status_of_VIP}</td>
                                        <td className="px-4 py-0 border-r text-center">
                                            {row.status_of_VIP ? (
                                                <label className="text-green-500 ">active</label>
                                            ) : (
                                                <label className="text-red-500 ">inactive</label>
                                            )
                                            }
                                        </td>
                                        <td className="px-4 py-0 text-center border-r">
                                            <label className="text-green-500 ">active</label>
                                        </td>
                                        <td className="px-4 py-0 text-center border-r">
                                            <button
                                                className="text-blue-500 hover:underline"
                                                onClick={() => router.push(`/pages/admin/member/${row.user_ID}`)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="text-red-500 hover:underline ml-2"
                                                onClick={() => {
                                                    axios.delete(`/api/user/${row.user_ID}`).then(() => { alert('ลบสมาชิกสำเร็จ'); window.location.reload(); }).catch(e => console.log(e))
                                                }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Section */}
                    <div className="flex justify-center items-center mt-4">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-3 py-1 mx-1 rounded shadow ${currentPage === index + 1
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-700"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayoutAdmin>
    );
}
