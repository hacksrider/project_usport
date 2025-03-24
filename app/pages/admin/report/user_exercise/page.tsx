/* eslint-disable @typescript-eslint/no-explicit-any */
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

interface ReportResponse {
  reportData: ReportData[];
  allServiceNames: string[];
}

export default function ReportUserExercise() {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [allServiceNames, setAllServiceNames] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // เพิ่ม state สำหรับเก็บวันที่
  const [dateStart, setDateStart] = useState<string>("");
  const [dateEnd, setDateEnd] = useState<string>("");

  // กำหนดค่าเริ่มต้นสำหรับวันที่
  useEffect(() => {
    // ตั้งค่าเริ่มต้น dateEnd เป็นวันปัจจุบัน
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    setDateEnd(formattedToday);

    // ตั้งค่าเริ่มต้น dateStart เป็น 1 ปีที่แล้ว
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    const formattedLastYear = lastYear.toISOString().split('T')[0];
    setDateStart(formattedLastYear);
  }, []);

  // ฟังก์ชันสำหรับดึงข้อมูลรายงาน
  const fetchReport = async (start?: string, end?: string) => {
    setLoading(true);
    try {
      // สร้าง URL พร้อม query parameters
      let url = "/api/report/user_exercise";
      const params = new URLSearchParams();

      if (start) params.append("dateStart", start);
      if (end) params.append("dateEnd", end);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("ไม่สามารถดึงข้อมูลรายงานได้");
      }
      const data: ReportResponse = await res.json();

      // เก็บข้อมูลรายงานและรายชื่อบริการทั้งหมด
      setReportData(data.reportData);
      setAllServiceNames(data.allServiceNames);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  // ดึงข้อมูลเมื่อ component โหลดครั้งแรกและเมื่อวันที่เปลี่ยน
  useEffect(() => {
    if (dateStart && dateEnd) {
      fetchReport(dateStart, dateEnd);
    }
  }, [dateStart, dateEnd]);

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงวันที่
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "dateStart") {
      setDateStart(value);
    } else if (name === "dateEnd") {
      setDateEnd(value);
    }
  };

  // ฟังก์ชันสำหรับการพิมพ์
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    // const originalContents = document.body.innerHTML;
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
      .report-date {
        text-align: center;
        font-weight: bold;
        margin-bottom: 15px;
      }
    `;

    const printWindow = window.open();
    if (printWindow) {
      // printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>รายงานการซื้อบริการของสมาชิก</title>
            <style>${printStyles}</style>
          </head>
          <body>
            <h2>รายงานการซื้อบริการของสมาชิก</h2>
            <div class="report-date">
              ช่วงวันที่: ${dateStart ? new Date(dateStart).toLocaleDateString('th-TH') : '-'} 
              ถึง ${dateEnd ? new Date(dateEnd).toLocaleDateString('th-TH') : '-'}
            </div>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();

      // Wait for content to load before printing
      printWindow.onload = function () {
        printWindow.print();
        printWindow.onafterprint = function () {
          printWindow.close();
        };
      };
    }
  };

  if (loading) return (<MainLayoutAdmin><div className="flex justify-center items-center h-screen">กำลังโหลด...</div></MainLayoutAdmin>);
  if (error) return <div>ข้อผิดพลาด: {error}</div>;

  return (
    <MainLayoutAdmin>
      <div className="flex justify-end mb-4 mt-5 mr-8">
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
      <div className="w-[1200px] bg-gray-300 p-4 rounded shadow-md mx-auto mb-5 mt-6">
        <div className="flex justify-between items-center">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">รายงานการซื้อบริการของสมาชิก</h2>
          </div>
          <div>
            <input
              type="date"
              name="dateStart"
              value={dateStart}
              onChange={handleDateChange}
              className="mx-2 p-2 mb-3 rounded-md border border-gray-300 cursor-pointer"
            />
            <span className="mx-2 font-semibold text-xl">ถึง</span>
            <input
              type="date"
              name="dateEnd"
              value={dateEnd}
              onChange={handleDateChange}
              className="mx-2 p-2 mb-3 rounded-md border border-gray-300 cursor-pointer"
            />
          </div>
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
              {reportData.length > 0 ? (
                reportData.map((user, index) => {
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
                })
              ) : (
                <tr>
                  <td colSpan={5 + allServiceNames.length} className="py-4 text-center border">
                    ไม่พบข้อมูลในช่วงวันที่ที่เลือก
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayoutAdmin>
  );
}