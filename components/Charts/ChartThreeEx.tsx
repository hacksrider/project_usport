/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

const ChartThree: React.FC = () => {
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [percentages, setPercentages] = useState<number[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("ทั้งหมด");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async (year: string, month: string) => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (year) params.append('year', year);
      if (month) params.append('month', month);
      
      // Fetch data with filters
      const response = await fetch(`/api/dashboard/static_excersice?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        
        const counts = data.data.map((item: any) => item.count);
        const total = counts.reduce((sum: number, value: number) => sum + value, 0);
        const percentValues = counts.map((value: number) => 
          (total > 0 ? (value / total) * 100 : 0)
        );

        setSeries(counts);
        setLabels(data.data.map((item: any) => item.service_name));
        setPercentages(percentValues);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    const currentYear = new Date().getFullYear().toString();
    setSelectedYear(currentYear);
    fetchData(currentYear, "ทั้งหมด");
  }, []);

  // Fetch data when year or month changes
  useEffect(() => {
    if (selectedYear) {
      fetchData(selectedYear, selectedMonth);
    }
  }, [selectedYear, selectedMonth]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, index) => (currentYear - index).toString());

  const months = [
    "ทั้งหมด", "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
    "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
  ];

  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    colors: ["#FF0000", "#CC0000", "#990000", "#660000", "#330000"],
    labels: labels,
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "รวม",
              fontSize: "16px",
              fontWeight: "400",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="col-span-5 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg ml-4 mt-3 font-bold text-dark dark:text-white">
            สถิติการซื้อบริการออกกำลังกาย
          </h4>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 mr-4 mt-3">
            <span>ปี</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2.5 mr-4 mt-3">
            <span>เดือน</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="rounded border border-gray-300 px-2 py-1"
            >
              {months.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="mx-auto flex justify-center">
          {isLoading ? (
            <div className="flex h-64 w-64 items-center justify-center">
              <span>กำลังโหลดข้อมูล...</span>
            </div>
          ) : series.length > 0 ? (
            <ReactApexChart options={options} series={series} type="donut" />
          ) : (
            <div className="flex h-64 w-64 items-center justify-center">
              <span>ไม่พบข้อมูล</span>
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto w-[430px]">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {series.map((item, index) => (
            <div className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6" key={index}>
              <span className="text-left">{labels[index]}</span>
              <span className="ml-2">{percentages[index].toFixed(2)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartThree;