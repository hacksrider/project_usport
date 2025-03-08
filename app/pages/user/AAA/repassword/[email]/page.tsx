'use client';
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function RecoverPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const params = useParams();
  const emailEncoded = params.email;
  const email = typeof emailEncoded === 'string'
    ? decodeURIComponent(emailEncoded)
    : '';
  const router = useRouter();



  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // ตรวจสอบว่ารหัสผ่านทั้งสองช่องตรงกันหรือไม่
    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน กรุณาลองใหม่อีกครั้ง");
      return;
    }
    const res = await axios.put("/api/auth/forgot-password", { email, password: newPassword });
    if (res.data.status == 200) {
      alert("เปลี่ยนรหัสผ่านสำเร็จ!");
      router.push("/pages/user/AAA/login");
    }
    // เรียกใช้งาน API หรือกระบวนการเปลี่ยนรหัสผ่านที่นี่
    console.log("รหัสผ่านใหม่:", newPassword);

  };

  return (
    <div className="flex items-center justify-center p-4 h-screen">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">เปลี่ยนรหัสผ่าน</h1>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* {email} */}
          <div>
            <label className="block text-gray-700 mb-1">รหัสผ่านใหม่</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านใหม่"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="กรอกรหัสผ่านอีกครั้ง"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            เปลี่ยนรหัสผ่าน
          </button>
        </form>
      </div>
    </div>
  );
}
