import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";
import DefaultSelectOption from "@/components/SelectOption/DefaultSelectOption";

const ChartThree: React.FC = () => {
  // เปลี่ยนข้อมูลใน series เป็นข้อมูลใหม่
  const series = [50, 30, 15, 5];  // ปรับค่าเป็น 50%, 30%, 15%, 5% ตามลำดับ

  const options: ApexOptions = {
    chart: {
      type: "donut",
    },
    colors: ["#0000FF", "#0000CC", "#000099", "#000066", "#000033"],
    labels: ["สนามฟุตบอล 1", "สนามฟุตบอล 2", "สนามฟุตบอล 3", "สนามฟุตบอล 4"], // ค่าของสนามฟุตบอลยังคงเหมือนเดิม
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
            สถิติการจองสนามฟุตบอล
          </h4>
        </div>
        <div className="flex items-center gap-2.5 mr-4 mt-3">
          <DefaultSelectOption options={["Monthly", "Yearly"]} />
        </div>
      </div>

      <div className="mb-8">
        <div className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[350px]">
        <div className="mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
          <div className="w-full px-7.5 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue"></span>
              <p className="flex w-full justify-stretch text-body-sm font-medium text-dark dark:text-dark-6">
                <span> สนามฟุตบอล 1 </span>
                <span className="text-left"> 50% </span>  {/* เปลี่ยนค่าเป็น 50% */}
              </p>
            </div>
          </div>
          <div className="w-full px-7.5 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-light"></span>
              <p className="flex w-full justify-stretch text-body-sm font-medium text-dark dark:text-dark-6">
                <span> สนามฟุตบอล 2 </span>
                <span className="text-left"> 30% </span>  {/* เปลี่ยนค่าเป็น 30% */} 
              </p>
            </div>
          </div>
          <div className="w-full px-7.5 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-light-2"></span>
              <p className="flex w-full justify-stretch text-body-sm font-medium text-dark dark:text-dark-6">
                <span> สนามฟุตบอล 3 </span>
                <span className="text-left"> 15% </span>  {/* เปลี่ยนค่าเป็น 15% */}
              </p>
            </div>
          </div>
          <div className="w-full px-7.5 sm:w-1/2">
            <div className="flex w-full items-center">
              <span className="mr-2 block h-3 w-full max-w-3 rounded-full bg-blue-light-3"></span>
              <p className="flex w-full justify-stretch text-body-sm font-medium text-dark dark:text-dark-6">
                <span> สนามฟุตบอล 4 </span>
                <span className="text-left"> 5% </span>  {/* เปลี่ยนค่าเป็น 5% */}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
