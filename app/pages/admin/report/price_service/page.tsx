/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRef, useState, useEffect } from "react";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";

export default function ReportFieldBookings() {
    const printRef = useRef<HTMLDivElement>(null);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [revenueData, setRevenueData] = useState<any>({
        serviceRevenue: {},
        fieldRevenue: {}
    });
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/report/price_service');
                const data = await response.json();
                if (data.data) {
                    setRevenueData(data.data);
                }
            } catch (error) {
                console.error("Error fetching revenue data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Function to calculate yearly total for a service or field
    const calculateYearlyTotal = (data: any, name: string, year: number) => {
        if (!data[name] || !data[name][year]) return 0;

        let total = 0;
        for (let month = 1; month <= 12; month++) {
            total += data[name][year][month] || 0;
        }
        return total;
    };

    // Function to calculate monthly totals across all services or fields
    const calculateMonthlyTotals = (data: any, year: number) => {
        const monthlyTotals = Array(12).fill(0);

        Object.keys(data).forEach(name => {
            if (data[name][year]) {
                for (let month = 1; month <= 12; month++) {
                    monthlyTotals[month - 1] += data[name][year][month] || 0;
                }
            }
        });

        return monthlyTotals;
    };

    // Function to calculate grand total
    // const calculateGrandTotal = (serviceMonthlyTotals: number[], fieldMonthlyTotals: number[]) => {
    //     let grandTotal = 0;
    //     for (let i = 0; i < 12; i++) {
    //         grandTotal += serviceMonthlyTotals[i] + fieldMonthlyTotals[i];
    //     }
    //     return grandTotal;
    // };

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
    
        // สร้าง iframe ชั่วคราว
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute";
        iframe.style.width = "0";
        iframe.style.height = "0";
        iframe.style.border = "none";
        document.body.appendChild(iframe);
    
        const doc = iframe.contentDocument || iframe.contentWindow!.document;
        doc.open();
        doc.write(`
            <html>
              <head>
                <title>รายงานรายได้ทั้งหมด ปี ${selectedYear}</title>
                <style>${printStyles}</style>
              </head>
              <body>
                <h2>รายงานรายได้ทั้งหมด ปี ${selectedYear}</h2>
                ${printContent.innerHTML}
              </body>
            </html>
        `);
        doc.close();
    
        iframe.contentWindow!.focus();
        iframe.contentWindow!.print();
    
        // ลบ iframe เมื่อพิมพ์เสร็จ
        iframe.contentWindow!.onafterprint = () => document.body.removeChild(iframe);
    };
    
    // const handlePrint = () => {
    //     const printContent = printRef.current;
    //     if (!printContent) return;

    //     const printStyles = `
    //   @page {
    //     size: A4 landscape; /* กำหนดกระดาษ A4 แนวนอน */
    //     margin: 10mm;
    //   }
    //   table {
    //     width: 100%;
    //     border-collapse: collapse;
    //     font-size: 12px;
    //   }
    //   th, td {
    //     border: 1px solid #000;
    //     padding: 5px;
    //     text-align: center;
    //   }
    //   th {
    //     background-color: #f2f2f2;
    //   }
    //   h2 {
    //     text-align: center;
    //     margin-bottom: 10px;
    //   }
    // `;

    //     const printWindow = window.open('', '_blank');
    //     if (printWindow) {
    //         printWindow.document.open();
    //         printWindow.document.write(`
    //     <html>
    //       <head>
    //         <title>รายงานรายได้ทั้งหมด ปี ${selectedYear}</title>
    //         <style>${printStyles}</style>
    //       </head>
    //       <body>
    //         <h2>รายงานรายได้ทั้งหมด ปี ${selectedYear}</h2>
    //         ${printContent.innerHTML}
    //       </body>
    //     </html>
    //   `);
    //         printWindow.document.close();

    //         // Wait for content to load before printing
    //         printWindow.onload = function () {
    //             printWindow.print();
    //             printWindow.onafterprint = function () {
    //                 printWindow.close();
    //             };
    //         };
    //     }
    // };

    const currentYear = new Date().getFullYear() + 543; // แปลงเป็น พ.ศ.
    const [yearOptions, setYearOptions] = useState<number[]>(Array.from({ length: 7 }, (_, i) => currentYear - i));

    // Generate years from current year and past years
    // const getYearOptions = () => {
    //     let years = [];
    //     for (let i = 0; i < 7; i++) {
    //         years.push(currentYear - i);
    //     }
    //     return years;
    // };

    // const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     setSelectedYear(parseInt(e.target.value));
    // };

    const loadMoreYears = () => {
        const lastYear = yearOptions[yearOptions.length - 1];
        setYearOptions(prevYears => [...prevYears, ...Array.from({ length: 7 }, (_, i) => lastYear - i - 1)]);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(parseInt(e.target.value));
    };

    // Prepare data for display
    const serviceNames = Object.keys(revenueData.serviceRevenue || {});
    const fieldNames = Object.keys(revenueData.fieldRevenue || {});

    const serviceMonthlyTotals = calculateMonthlyTotals(revenueData.serviceRevenue || {}, selectedYear);
    const fieldMonthlyTotals = calculateMonthlyTotals(revenueData.fieldRevenue || {}, selectedYear);

    const serviceTotalForYear = serviceMonthlyTotals.reduce((a, b) => a + b, 0);
    const fieldTotalForYear = fieldMonthlyTotals.reduce((a, b) => a + b, 0);

    const grandTotal = serviceTotalForYear + fieldTotalForYear;

    // Format number as currency
    const formatCurrency = (value: number) => {
        return value.toLocaleString('th-TH');
    };

    return (
        <MainLayoutAdmin>
           <div className="flex justify-end mt-2">
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
            <div className="w-full ml-2 bg-gray-300 p-4 rounded shadow-md mx-auto mb-5 mt-6">
            <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">รายงานรายได้ทั้งหมด ปี {selectedYear}</h2>
                    <div className="flex items-center justify-center relative">
                        <h1 className="text-xl font-bold mr-3">เลือกปี : </h1>
                        <div className="relative">
                            <select
                                className="overflow-auto w-40 p-2 rounded"
                                value={selectedYear}
                                onChange={handleYearChange}
                                onScroll={(e) => {
                                    const target = e.target as HTMLSelectElement;
                                    if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
                                        loadMoreYears();
                                    }
                                }}
                            >
                                {yearOptions.map((year) => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto" ref={printRef}>
                    {isLoading ? (
                        <div className="text-center py-10">กำลังโหลดข้อมูล...</div>
                    ) : (
                        <table className="min-w-full bg-white">
                            <thead className="bg-blue-200">
                                <tr>
                                    <th className="py-2 px-4 border" rowSpan={2}>No.</th>
                                    <th className="py-2 px-4 border" rowSpan={2}>รายการ</th>
                                    <th className="py-2 px-4 border" colSpan={12}>รายได้แต่ละเดือน</th>
                                    <th className="py-2 px-4 border" rowSpan={2}>รวม<br />(บาท)</th>
                                </tr>
                                <tr>
                                    <th className="py-2 px-4 border">ม.ค.</th>
                                    <th className="py-2 px-4 border">ก.พ.</th>
                                    <th className="py-2 px-4 border">มี.ค.</th>
                                    <th className="py-2 px-4 border">เม.ย.</th>
                                    <th className="py-2 px-4 border">พ.ค.</th>
                                    <th className="py-2 px-4 border">มิ.ย.</th>
                                    <th className="py-2 px-4 border">ก.ค.</th>
                                    <th className="py-2 px-4 border">ส.ค.</th>
                                    <th className="py-2 px-4 border">ก.ย.</th>
                                    <th className="py-2 px-4 border">ต.ค.</th>
                                    <th className="py-2 px-4 border">พ.ย.</th>
                                    <th className="py-2 px-4 border">ธ.ค.</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* บริการออกกำลังกาย */}
                                <tr className="bg-gray-100">
                                    <td className="py-2 px-4 border text-center" colSpan={15}>
                                        <strong>บริการออกกำลังกาย</strong>
                                    </td>
                                </tr>
                                {serviceNames.map((serviceName, index) => {
                                    const yearData = revenueData.serviceRevenue[serviceName][selectedYear] || {};
                                    const yearTotal = calculateYearlyTotal(revenueData.serviceRevenue, serviceName, selectedYear);

                                    return (
                                        <tr key={`service-${index}`}>
                                            <td className="py-2 px-4 border text-center">{index + 1}</td>
                                            <td className="py-2 px-4 border">{serviceName}</td>
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                                <td key={`service-${index}-${month}`} className="py-2 px-4 border text-center">
                                                    {formatCurrency(yearData[month] || 0)}
                                                </td>
                                            ))}
                                            <td className="py-2 px-4 border text-center font-bold">
                                                {formatCurrency(yearTotal)}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {/* รวมบริการออกกำลังกาย */}
                                <tr className="bg-blue-50">
                                    <td className="py-2 px-4 border text-center" colSpan={2}>
                                        <strong>รวมบริการออกกำลังกาย</strong>
                                    </td>
                                    {serviceMonthlyTotals.map((total, month) => (
                                        <td key={`service-total-${month}`} className="py-2 px-4 border text-center font-bold">
                                            {formatCurrency(total)}
                                        </td>
                                    ))}
                                    <td className="py-2 px-4 border text-center font-bold">
                                        {formatCurrency(serviceTotalForYear)}
                                    </td>
                                </tr>

                                {/* สนามกีฬา */}
                                <tr className="bg-gray-100">
                                    <td className="py-2 px-4 border text-center" colSpan={15}>
                                        <strong>สนามฟุตบอล</strong>
                                    </td>
                                </tr>
                                {fieldNames.map((fieldName, index) => {
                                    const yearData = revenueData.fieldRevenue[fieldName][selectedYear] || {};
                                    const yearTotal = calculateYearlyTotal(revenueData.fieldRevenue, fieldName, selectedYear);

                                    return (
                                        <tr key={`field-${index}`}>
                                            <td className="py-2 px-4 border text-center">{index + 1}</td>
                                            <td className="py-2 px-4 border">{fieldName}</td>
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                                                <td key={`field-${index}-${month}`} className="py-2 px-4 border text-center">
                                                    {formatCurrency(yearData[month] || 0)}
                                                </td>
                                            ))}
                                            <td className="py-2 px-4 border text-center font-bold">
                                                {formatCurrency(yearTotal)}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {/* รวมสนามกีฬา */}
                                <tr className="bg-blue-50">
                                    <td className="py-2 px-4 border text-center" colSpan={2}>
                                        <strong>รวมสนามกีฬา</strong>
                                    </td>
                                    {fieldMonthlyTotals.map((total, month) => (
                                        <td key={`field-total-${month}`} className="py-2 px-4 border text-center font-bold">
                                            {formatCurrency(total)}
                                        </td>
                                    ))}
                                    <td className="py-2 px-4 border text-center font-bold">
                                        {formatCurrency(fieldTotalForYear)}
                                    </td>
                                </tr>

                                {/* รวมทั้งหมด */}
                                <tr className="bg-blue-200">
                                    <td className="py-2 px-4 border text-center" colSpan={2}>
                                        <strong>รวมทั้งหมด</strong>
                                    </td>
                                    {Array.from({ length: 12 }, (_, i) => i).map(month => (
                                        <td key={`grand-total-${month}`} className="py-2 px-4 border text-center font-bold">
                                            {formatCurrency(serviceMonthlyTotals[month] + fieldMonthlyTotals[month])}
                                        </td>
                                    ))}
                                    <td className="py-2 px-4 border text-center font-bold">
                                        {formatCurrency(grandTotal)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </MainLayoutAdmin>
    );
}