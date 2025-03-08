"use client";
import { useEffect, useState } from "react";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";

interface ReportData {
  user_ID: number;
  user_name: string;
  totalPurchases: number;
  serviceBreakdown: {
    [serviceName: string]: number;
  };
  buying_exercise: any[]; // Ensure this is an array of buying_exercise data
}

export default function ReportUserExercise() {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch("/api/report/user_exercise");
        if (!res.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลรายงานได้");
        }
        const data = await res.json();
        setReportData(data);
      } catch (err: any) {
        setError(err.message || "เกิดข้อผิดพลาด");
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, []);

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>ข้อผิดพลาด: {error}</div>;

  // Get all unique service names
  const allServiceNames = [
    ...new Set(reportData.flatMap((user) => Object.keys(user.serviceBreakdown))),
  ];

  return (
    <MainLayoutAdmin>
      <div className="w-[1200px] bg-gray-300 p-4 rounded shadow-md mx-auto mb-5 mt-6">
        <h2 className="text-2xl font-bold mb-4">รายงานการซื้อบริการของสมาชิก</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border">No.</th>
              <th className="py-2 px-4 border">ชื่อ</th>
              <th className="py-2 px-4 border">จํานวนครั้งที่ซื้อบริการ</th>
              {allServiceNames.map((serviceName) => (
                <th key={serviceName} className="py-2 px-4 border">
                  {serviceName}
                </th>
              ))}
              <th className="py-2 px-4 border">รวม</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((user, index) => {
              // Ensure buying_exercise exists and is an array
            //   const totalPurchases = Array.isArray(user.buying_exercise) 
            //     ? user.buying_exercise.length 
            //     : 0;

              // Calculate the total number of services purchased (all service names count)
              const totalServices = Object.values(user.serviceBreakdown).reduce(
                (acc, count) => acc + count,
                0
              );

              return (
                <tr key={index}>
                  <td className="py-2 px-4 border text-center">{index + 1}</td>
                  <td className="py-2 px-4 border text-left">{user.user_name}</td>
                  <td className="py-2 px-4 border text-center">{user.totalPurchases}</td>
                  {allServiceNames.map((serviceName) => (
                    <td key={serviceName} className="py-2 px-4 border text-center">
                      {user.serviceBreakdown[serviceName] || 0}
                    </td>
                  ))}
                  <td className="py-2 px-4 border text-center">{totalServices}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </MainLayoutAdmin>
  );
}
