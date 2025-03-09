/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState, useRef } from "react";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";

interface FieldStatistic {
  field_name: string;
  booking_count: number;
  total_spent: number;
}

interface ReportData {
  user_ID: number;
  user_name: string;
  field_statistics: FieldStatistic[];
  total_bookings: number;
  total_spent: number;
}

export default function ReportFieldBookings() {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchReport() {
      try {
        const res = await fetch("/api/report/user_football");
        if (!res.ok) {
          throw new Error("ไม่สามารถดึงข้อมูลรายงานได้");
        }
        const data = await res.json();
        setReportData(data.data); // Accessing the data property from the response
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

    const printStyles = `
      @page {
        size: A4 landscape; /* กำหนดกระดาษ A4 แนวนอน */
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
            <title>รายงานการจองสนามของสมาชิก</title>
            <style>${printStyles}</style>
          </head>
          <body>
            <h2>รายงานการใช้สนามของสมาชิก</h2>
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

  // Get all unique field names
  const allFieldNames = reportData.length > 0
    ? [...new Set(reportData.flatMap(user => 
        user.field_statistics.map(stat => stat.field_name)
      ))]
    : [];

  return (
    <MainLayoutAdmin>
      <div className="w-full max-w-6xl bg-gray-300 p-4 rounded shadow-md mx-auto mb-5 mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">รายงานการใช้สนามของสมาชิก</h2>
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
        <div className="overflow-x-auto" ref={printRef}>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">No.</th>
                <th className="py-2 px-4 border">ชื่อ</th>
                {allFieldNames.map((fieldName) => (
                  <th key={fieldName} className="py-2 px-4 border">
                    {fieldName}<br />(จำนวนครั้ง)
                  </th>
                ))}
                <th className="py-2 px-4 border">รวมการจอง<br />(จำนวนครั้ง)</th>
                <th className="py-2 px-4 border">จำนวนเงิน <br /> (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((user, index) => (
                <tr key={user.user_ID}>
                  <td className="py-2 px-4 border text-center">{index + 1}</td>
                  <td className="py-2 px-4 border text-left">{user.user_name}</td>
                  
                  {/* Field booking counts */}
                  {allFieldNames.map((fieldName) => {
                    const fieldStat = user.field_statistics.find(
                      (stat) => stat.field_name === fieldName
                    );
                    return (
                      <td key={fieldName} className="py-2 px-4 border text-center">
                        {fieldStat ? fieldStat.booking_count : 0}
                      </td>
                    );
                  })}
                  
                  <td className="py-2 px-4 border text-center font-medium">
                    {user.total_bookings}
                  </td>
                  <td className="py-2 px-4 border text-center font-medium">
                    {user.total_spent.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayoutAdmin>
  );
}