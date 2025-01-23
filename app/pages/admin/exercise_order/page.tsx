"use client"; // Add this directive to make it a Client Component
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";

export default function ExerciseOrder() {

    return (
        <MainLayoutAdmin>
            <h1 className="text-2xl font-semibold mb-3 text-black">รวมคำสั่งซื้อบริการการออกกำลังกาย</h1>
            <div className="w-full bg-gray-300 ml-2 p-6 rounded shadow-md">
                <div className="p-0">
                    <p>คำสั่งซื้อบริการการออกกำลังกาย</p>
                    <table className="table-auto w-full bg-white rounded shadow mt-4">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left text-gray-800">No.</th>
                                <th className="px-4 py-2 text-left text-gray-800">ชื่อผู้ใช้</th>
                                <th className="px-4 py-2 text-left text-gray-800">ประเภทบริการ</th>
                                <th className="px-4 py-2 text-left text-gray-800">ราคา</th>
                                <th className="px-4 py-2 text-left text-gray-800">สถานะ</th>
                                <th className="px-4 py-2 text-center text-gray-800">การจัดการ</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="px-4 py-2 text-gray-600">1</td>
                                <td className="px-4 py-2 text-gray-600">John Doe</td>
                                <td className="px-4 py-2 text-gray-600">Personal Training</td>
                                <td className="px-4 py-2 text-gray-600">2,500 บาท</td>
                                <td className="px-4 py-2 text-gray-600">กำลังดำเนินการ</td>
                                <td className="px-4 py-2 text-center">
                                    <button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">อนุมัติ</button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">ปฏิเสธ</button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 text-gray-600">2</td>
                                <td className="px-4 py-2 text-gray-600">Jane Smith</td>
                                <td className="px-4 py-2 text-gray-600">Group Class</td>
                                <td className="px-4 py-2 text-gray-600">1,200 บาท</td>
                                <td className="px-4 py-2 text-gray-600">เสร็จสิ้น</td>
                                <td className="px-4 py-2 text-center">
                                    <button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">อนุมัติ</button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">ปฏิเสธ</button>
                                </td>
                            </tr>
                            <tr>
                                <td className="px-4 py-2 text-gray-600">3</td>
                                <td className="px-4 py-2 text-gray-600">Alice Brown</td>
                                <td className="px-4 py-2 text-gray-600">Online Coaching</td>
                                <td className="px-4 py-2 text-gray-600">3,000 บาท</td>
                                <td className="px-4 py-2 text-gray-600">ยกเลิก</td>
                                <td className="px-4 py-2 text-center">
                                    <button className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600">อนุมัติ</button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">ปฏิเสธ</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayoutAdmin>
    );
}
