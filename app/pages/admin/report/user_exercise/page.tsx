"use client";
import { useEffect, useState, useRef } from "react";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";

interface ReportData {
  user_ID: number;
  user_name: string;
  totalPurchases: number;
  totalPrice: number;
  serviceBreakdown: {
    [serviceName: string]: number;
  };
  buying_exercise: any[]; // Ensure this is an array of buying_exercise data
}

export default function ReportUserExercise() {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

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

  // Function to handle printing
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const originalContents = document.body.innerHTML;
    const printStyles = `
      @page {
        size: A4 landscape;
        margin: 10mm;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
      }
      th, td {
        border: 1px solid #000;
        padding: 5px;
        text-align: center;
      }
      th {
        background-color: #f2f2f2;
      }
      h2 {
        text-align: center;
        margin-bottom: 10px;
      }
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>รายงานการซื้อบริการของสมาชิก</title>
            <style>${printStyles}</style>
          </head>
          <body>
            <h2>รายงานการซื้อบริการของสมาชิก</h2>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for content to load before printing
      printWindow.onload = function() {
        printWindow.print();
        printWindow.onafterprint = function() {
          printWindow.close();
        };
      };
    }
  };

  if (loading) return <div>กำลังโหลด...</div>;
  if (error) return <div>ข้อผิดพลาด: {error}</div>;

  // Get all unique service names
  const allServiceNames = [
    ...new Set(reportData.flatMap((user) => Object.keys(user.serviceBreakdown))),
  ];

  return (
    <MainLayoutAdmin>
      <div className="w-[1200px] bg-gray-300 p-4 rounded shadow-md mx-auto mb-5 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">รายงานการซื้อบริการของสมาชิก</h2>
          <button 
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            พิมพ์รายงาน (PDF)
          </button>
        </div>
        
        <div ref={printRef}>
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
                <th className="py-2 px-4 border">รวมจำนวนรายการ</th>
                <th className="py-2 px-4 border">รวมเงิน</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((user, index) => {
                // Calculate the total number of services purchased
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
                    <td className="py-2 px-4 border text-center">{user.totalPrice}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayoutAdmin>
  );
}