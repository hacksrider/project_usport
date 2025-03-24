"use client";
import { useRef, useState, useEffect } from "react";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";

interface MonthlyData {
    month: number;
    buyingCount?: number;
    distinctServicesPurchased?: number;
    // totalPrice removed
    bookingCount?: number;
    orderCount?: number;
    distinctFieldsBooked?: number;
}

interface YearlyData {
    year: number;
    monthlyData: MonthlyData[];
}

interface TopService {
    service_name: string;
    purchaseCount: number;
    // totalPrice removed
}

interface TopField {
    field_name: string;
    bookingCount: number;
}

interface AnalyticsData {
    exerciseAnalytics: {
        totalBuyingExercise: number;
        totalServiceTypes: number;
        // totalRevenue removed
        yearlyMonthlyData: YearlyData[];
        topServices: TopService[];
    };
    bookingsAnalytics: {
        totalOrderBookings: number;
        totalFieldTypes: number;
        yearlyMonthlyData: YearlyData[];
        topFields: TopField[];
    };
}

export default function AnalyticsReport() {
    const printRef = useRef<HTMLDivElement>(null);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('/api/report/static_service');
                const data = await response.json();
                if (data.success && data.data) {
                    setAnalyticsData(data.data);
                } else {
                    console.error("API returned unsuccessful response:", data);
                }
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Function to handle printing
    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const printStyles = `
      @page {
        size: A4 landscape;
        margin: 10mm;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        margin-bottom: 20px;
      }
      th, td {
        border: 1px solid #000;
        padding: 5px;
        text-align: center;
      }
      th {
        background-color: #f2f2f2;
      }
      h2, h3 {
        text-align: center;
        margin-bottom: 10px;
      }
      .summary-box {
        border: 1px solid #000;
        padding: 10px;
        margin-bottom: 20px;
      }
    `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.open();
            printWindow.document.write(`
        <html>
          <head>
            <title>รายงานสถิติการใช้บริการ ปี ${selectedYear}</title>
            <style>${printStyles}</style>
          </head>
          <body>
            <h2>รายงานสถิติการใช้บริการ ปี ${selectedYear}</h2>
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

    const currentYearThai = new Date().getFullYear() + 543; // Convert to Buddhist Era
    const [yearOptions, setYearOptions] = useState<number[]>(Array.from({ length: 5 }, (_, i) => currentYearThai - i));

    const loadMoreYears = () => {
        const lastYear = yearOptions[yearOptions.length - 1];
        setYearOptions(prevYears => [...prevYears, ...Array.from({ length: 5 }, (_, i) => lastYear - i - 1)]);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedYear(parseInt(e.target.value));
    };

    // Get data for the selected year
    const getExerciseYearData = (year: number) => {
        if (!analyticsData) return null;
        return analyticsData.exerciseAnalytics.yearlyMonthlyData.find(data => data.year === year);
    };

    const getBookingsYearData = (year: number) => {
        if (!analyticsData) return null;
        return analyticsData.bookingsAnalytics.yearlyMonthlyData.find(data => data.year === year);
    };

    // Format number
    const formatNumber = (value: number) => {
        return value.toLocaleString('th-TH');
    };

    // Get month name in Thai
    const getThaiMonth = (month: number) => {
        const thaiMonths = [
            "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
            "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
        ];
        return thaiMonths[month - 1];
    };

    // Calculate totals
    const calculateExerciseTotals = () => {
        const yearData = getExerciseYearData(selectedYear);
        if (!yearData) return { buyingTotal: 0 };

        let buyingTotal = 0;

        yearData.monthlyData.forEach(data => {
            buyingTotal += data.buyingCount || 0;
        });

        return { buyingTotal };
    };

    const calculateBookingsTotals = () => {
        const yearData = getBookingsYearData(selectedYear);
        if (!yearData) return { bookingTotal: 0, orderTotal: 0, fieldsTotal: 0 };

        let bookingTotal = 0;
        let orderTotal = 0;
        let fieldsTotal = 0;

        yearData.monthlyData.forEach(data => {
            bookingTotal += data.bookingCount || 0;
            orderTotal += data.orderCount || 0;
            fieldsTotal += data.distinctFieldsBooked || 0;
        });

        return { bookingTotal, orderTotal, fieldsTotal };
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
                    <h2 className="text-2xl font-bold">รายงานสถิติการใช้บริการ ปี {selectedYear + 543}</h2>
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
                                    <option key={year} value={year - 543}>{year}</option> // Convert back to Gregorian for API use
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto" ref={printRef}>
                    {isLoading ? (
                        <div className="text-center py-10">กำลังโหลดข้อมูล...</div>
                    ) : analyticsData ? (
                        <>

                            {/* Combined Monthly Report Table */}
                            {/* <h3 className="text-xl font-bold mb-2">รายงานการใช้บริการรายเดือน ปี {selectedYear}</h3> */}
                            <table className="min-w-full bg-white mb-6">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border bg-gray-200" rowSpan={2}>เดือน</th>
                                        <th className="py-2 px-4 border text-center bg-blue-200" colSpan={2}>บริการออกกำลังกาย</th>
                                        <th className="py-2 px-4 border text-center bg-green-200" colSpan={3}>สนามกีฬา</th>
                                    </tr>
                                    <tr>
                                        <th className="py-2 px-4 border bg-blue-100">จำนวนคำสั่งซื้อ</th>
                                        <th className="py-2 px-4 border bg-blue-100">จำนวนบริการที่ซื้อ</th>
                                        <th className="py-2 px-4 border bg-green-100">จำนวนการจอง</th>
                                        <th className="py-2 px-4 border bg-green-100">จำนวนคำสั่งซื้อ</th>
                                        <th className="py-2 px-4 border bg-green-100">จำนวนสนามที่ถูกจอง</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                                        const exerciseData = getExerciseYearData(selectedYear)?.monthlyData.find(data => data.month === month) ||
                                            { buyingCount: 0, distinctServicesPurchased: 0 };
                                        const bookingData = getBookingsYearData(selectedYear)?.monthlyData.find(data => data.month === month) ||
                                            { bookingCount: 0, orderCount: 0, distinctFieldsBooked: 0 };

                                        return (
                                            <tr key={`month-${month}`}>
                                                <td className="py-2 px-4 border text-center font-medium">{getThaiMonth(month)}</td>
                                                <td className="py-2 px-4 border text-center">{formatNumber(exerciseData.buyingCount || 0)}</td>
                                                <td className="py-2 px-4 border text-center">{formatNumber(exerciseData.distinctServicesPurchased || 0)}</td>
                                                <td className="py-2 px-4 border text-center">{formatNumber(bookingData.bookingCount || 0)}</td>
                                                <td className="py-2 px-4 border text-center">{formatNumber(bookingData.orderCount || 0)}</td>
                                                <td className="py-2 px-4 border text-center">{formatNumber(bookingData.distinctFieldsBooked || 0)}</td>
                                            </tr>
                                        );
                                    })}
                                    <tr className="bg-gray-100 font-bold">
                                        <td className="py-2 px-4 border text-center">รวม</td>
                                        <td className="py-2 px-4 border text-center">{formatNumber(calculateExerciseTotals().buyingTotal)}</td>
                                        <td className="py-2 px-4 border text-center">{formatNumber(getExerciseYearData(selectedYear)?.monthlyData.reduce((sum, data) => sum + (data.distinctServicesPurchased || 0), 0) || 0)}</td>
                                        <td className="py-2 px-4 border text-center">{formatNumber(calculateBookingsTotals().bookingTotal)}</td>
                                        <td className="py-2 px-4 border text-center">{formatNumber(calculateBookingsTotals().orderTotal)}</td>
                                        <td className="py-2 px-4 border text-center">{formatNumber(calculateBookingsTotals().fieldsTotal)}</td>
                                    </tr>
                                </tbody>
                            </table>

                            {/* Combined Top Services Table */}
                            <h3 className="text-xl font-bold mb-2">บริการยอดนิยม</h3>
                            <table className="min-w-full bg-white mb-6">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border text-center bg-blue-200" colSpan={3}>บริการออกกำลังกายยอดนิยม</th>
                                        <th className="py-2 px-4 border text-center bg-green-200" colSpan={3}>สนามกีฬายอดนิยม</th>
                                    </tr>
                                    <tr>
                                        <th className="py-2 px-4 border bg-blue-100">ลำดับ</th>
                                        <th className="py-2 px-4 border bg-blue-100">ชื่อบริการ</th>
                                        <th className="py-2 px-4 border bg-blue-100">จำนวนการซื้อ</th>
                                        <th className="py-2 px-4 border bg-green-100">ลำดับ</th>
                                        <th className="py-2 px-4 border bg-green-100">ชื่อสนาม</th>
                                        <th className="py-2 px-4 border bg-green-100">จำนวนการจอง</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({
                                        length: Math.max(
                                            analyticsData.exerciseAnalytics.topServices.length,
                                            analyticsData.bookingsAnalytics.topFields.length
                                        )
                                    }, (_, i) => i).map((index) => {
                                        const exerciseService = analyticsData.exerciseAnalytics.topServices[index];
                                        const fieldService = analyticsData.bookingsAnalytics.topFields[index];

                                        return (
                                            <tr key={`popular-${index}`}>
                                                <td className="py-2 px-4 border text-center">{exerciseService ? index + 1 : ''}</td>
                                                <td className="py-2 px-4 border">{exerciseService ? exerciseService.service_name : ''}</td>
                                                <td className="py-2 px-4 border text-center">{exerciseService ? formatNumber(exerciseService.purchaseCount) : ''}</td>
                                                <td className="py-2 px-4 border text-center">{fieldService ? index + 1 : ''}</td>
                                                <td className="py-2 px-4 border">{fieldService ? fieldService.field_name : ''}</td>
                                                <td className="py-2 px-4 border text-center">{fieldService ? formatNumber(fieldService.bookingCount) : ''}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                        </>
                    ) : (
                        <div className="text-center py-10">ไม่พบข้อมูล</div>
                    )}
                </div>
            </div>
        </MainLayoutAdmin>
    );
}