"use client";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";
import { useRouter } from "next/navigation";
export default function Report() {
    const router = useRouter();
    return (
        <MainLayoutAdmin>
            <div className="w-[800px] bg-gray-300 p-4 rounded shadow-md mx-auto mb-5 mt-6">
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => router.push("/pages/admin/report/user_exercise")}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold py-4 px-4 rounded shadow">
                        รายงานสถิติของสมาชิกสำหรับการสั่งซื้อบริการออกกำลังกาย
                    </button>
                    <button
                        onClick={() => router.push("/pages/admin/report/user_football")}
                        className="bg-green-600 hover:bg-green-700 text-white text-2xl font-bold py-4 px-4 rounded shadow">
                        รายงานสถิติของสมาชิกสำหรับการจองสนามฟุตบอล
                    </button>
                    <button
                        onClick={() => router.push("/pages/admin/report/price_service")}
                        className="bg-red-600 hover:bg-red-700 text-white text-2xl font-bold py-4 px-4 rounded shadow">
                        รายงานสถิติของรายได้ของบริการทั้งหมดในแต่ละปี
                    </button>
                    <button
                        onClick={() => router.push("/pages/admin/report/count_service")}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white text-2xl font-bold py-4 px-4 rounded shadow">
                        รายงานสถิติการซื้อบริการทั้งหมดในแต่ละปี
                    </button>
                </div>
            </div>
        </MainLayoutAdmin>
    );
}
