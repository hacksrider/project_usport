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
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
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

    // Handle delete confirmation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const confirmDelete = (userId:any) => {
        setShowConfirmation(true);
        setSelectedUserId(userId);
    };

    const handleDelete = () => {
        if (selectedUserId) {
            axios.delete(`/api/user/${selectedUserId}`)
                .then(() => {
                    alert('ลบสมาชิกสำเร็จ');
                    setShowConfirmation(false);
                    setDataUser(dataUser.filter(user => user.user_ID !== selectedUserId));
                })
                .catch(e => console.log(e));
        }
    };

    return (
        <MainLayoutAdmin>
            <h1 className="text-2xl font-semibold mb-3 ml-2 text-black">สมาชิก</h1>
            <div className="w-full bg-gray-300 ml-2 p-6 rounded shadow-md">
                <div className="p-0">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold">รายชื่อสมาชิก</h1>
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
                                                onClick={() => confirmDelete(row.user_ID)}
                                            >Delete</button>
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

            {/* Confirmation Modal */}
            {showConfirmation && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-md">
                        <p className="text-lg font-semibold mb-4">คุณแน่ใจหรือไม่ที่จะลบสมาชิกคนนี้?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setShowConfirmation(false)}
                            >
                                ยกเลิก
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={handleDelete}
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
