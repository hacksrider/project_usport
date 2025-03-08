/* eslint-disable @typescript-eslint/no-explicit-any */
import InfiniteDropdown from "@/app/components/InfiniteDropdown";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";


const ChartOne: React.FC = () => {
  const [series, setSeries] = useState([
    {
      name: "สนามฟุตบอล",
      data: [44, 55, 41, 67, 35, 43, 65, 60, 70, 55, 80, 75],
    },
    {
      name: "บริการออกกำลังกาย",
      data: Array(12).fill(0), // ข้อมูลเริ่มต้น
    },
  ]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    console.log("Fetching data for year:", selectedYear); // เช็คค่าที่จะ fetch

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/dashboard/buying_count?year=${selectedYear}`, { cache: "no-store" });
        const data = await response.json();
        console.log("API Response:", data); // ตรวจสอบค่าที่ API ส่งมา

        if (data.year === selectedYear) { // ตรวจสอบว่าปีที่ได้รับตรงกัน
          setSeries([
            { name: "สนามฟุตบอล", data: [44, 55, 41, 67, 35, 43, 65, 60, 70, 55, 80, 75] },
            { name: "บริการออกกำลังกาย", data: data.monthlyCounts },
          ]);
        } else {
          console.error("API returned incorrect year:", data.year);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedYear]); // ต้องแน่ใจว่า fetch เมื่อค่า selectedYear เปลี่ยน



  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#5750F1", "#0ABEF9"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 310,
      type: "area",
      toolbar: {
        show: false,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      strokeDashArray: 5,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      type: "category",
      categories: [
        "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
      ],
    },
  };

  // const currentYear = new Date().getFullYear();
  // const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <div className="ml-4 mt-3 mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            สถิติการซื้อบริการออกกำลังกายกับการจองสนามฟุตบอล {selectedYear}
          </h4>
        </div>
        <div className="flex items-center gap-2.5 mr-4">
          <p className="font-medium uppercase text-dark dark:text-dark-6">เลือกปี:</p>
          <InfiniteDropdown selectedYear={selectedYear}
            setSelectedYear={setSelectedYear} />

        </div>
      </div>
      <div>
        <div className="ml-4 mr-5">
          {loading ? <p>กำลังโหลดข้อมูล...</p> : <ReactApexChart key={selectedYear} options={options} series={series} type="area" height={310} />
          }
        </div>
      </div>
      <div className="flex items-center justify-evenly px-7.5 text-center">
        <div className="border-stroke dark:border-dark-3 xsm:w-1/2 xsm:border-r">
          <p className="font-medium">สนามฟุตบอล</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">650 ครั้ง</h4>
        </div>
        <div className="xsm:w-1/2">
          <p className="font-medium">บริการออกกำลังกาย</p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {series[1].data.reduce((sum, num) => sum + num, 0)} ครั้ง
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
