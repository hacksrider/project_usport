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
                    className="bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold py-4 px-4 rounded shadow">
                        หน้ารายงานสถิติของสมาชิกสำหรับการสั่งซื้อบริการออกกำลังกาย
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white text-2xl font-bold py-4 px-4 rounded shadow">
                        หน้ารายงานสถิติของสมาชิกสำหรับการจองสนามฟุตบอล
                    </button>
                </div>
            </div>
        </MainLayoutAdmin>
    );
}
