"use client";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";
import ChartOne from "@/components/Charts/ChartOne";
import ChartThree from "@/components/Charts/ChartThree";
import ChartTwo from "@/components/Charts/ChartTwo";
import ChatCard from "@/components/Chat/ChatCard";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import MapOne from "@/components/Maps/MapOne";
import TableOne from "@/components/Tables/TableOne";
import React from "react";


export default function Dashboard() {
  return (
    <MainLayoutAdmin>
      <h1 className="text-2xl font-semibold mb-3 ml-2 text-black">แดชบอร์ด</h1>
      <div className="w-full bg-gray-300 p-6 mb-6 ml-2 rounded shadow-md">
        {/* <div className="flex-grow"> */}

          {/* ส่วนแสดงผลภายในโครงสร้าง */}
          <DataStatsOne />

          <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
            {/* <ChartOne />
            <ChartTwo />
            <ChartThree />
            <MapOne />
            <div className="col-span-12 xl:col-span-8">
              <TableOne />
            </div>
            <ChatCard /> */}
          </div>
          
        </div>
      {/* </div> */}
    </MainLayoutAdmin>
  );
}
