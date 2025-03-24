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
  // Get default date range (today and 1 year ago)
  const today = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateStart, setDateStart] = useState<string>(oneYearAgo.toISOString().split('T')[0]);
  const [dateEnd, setDateEnd] = useState<string>(today.toISOString().split('T')[0]);
  const printRef = useRef<HTMLDivElement>(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/report/user_football?dateStart=${dateStart}&dateEnd=${dateEnd}`);
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
  };

  useEffect(() => {
    fetchReport();
  }, [dateStart, dateEnd]); // Fetch report when dates change

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'dateStart') {
      setDateStart(value);
    } else if (name === 'dateEnd') {
      setDateEnd(value);
    }
  };

  // Function to handle printing
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

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
      .report-date {
        text-align: center;
        margin-bottom: 15px;
        font-size: 14px;
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
            <div class="report-date">
              ข้อมูลระหว่างวันที่ ${formatDate(dateStart)} ถึง ${formatDate(dateEnd)}
            </div>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();

      // Wait for content to load before printing
      printWindow.onload = function () {
        printWindow.print();
        // printWindow.onafterprint = function () {
        //   printWindow.close();
        // };
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
      <div className="mb-4 flex justify-end items-center mr-14 mt-4">
        <button
          onClick={handlePrint}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center mb-4 md:mb-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          พิมพ์รายงาน (PDF)
        </button>
      </div>
      
      <div className="w-full max-w-6xl bg-gray-300 p-4 rounded shadow-md mx-auto mb-5 mt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center mb-4">
            <h2 className="text-2xl font-bold">รายงานการใช้สนามของสมาชิก</h2>
          </div>
          <div className="mb-4 flex flex-wrap items-center">
            <div className="flex flex-wrap items-center">
              {/* <label htmlFor="dateStart" className="mr-2 font-medium ">ตั้งแต่:</label> */}
              <input
                id="dateStart"
                type="date"
                name="dateStart"
                value={dateStart}
                onChange={handleDateChange}
                className="mx-2 p-2 rounded-md border border-gray-300 cursor-pointer"
              />
              <label htmlFor="dateEnd" className="mx-2 font-semibold text-xl">ถึง</label>
              <input
                id="dateEnd"
                type="date"
                name="dateEnd"
                value={dateEnd}
                onChange={handleDateChange}
                className="mx-2 p-2 rounded-md border border-gray-300 cursor-pointer"
              />
            </div>
          </div>
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
              {reportData.length > 0 ? (
                reportData.map((user, index) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={allFieldNames.length + 4} className="py-4 px-4 border text-center">
                    ไม่พบข้อมูลการจองในช่วงเวลาที่กำหนด
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