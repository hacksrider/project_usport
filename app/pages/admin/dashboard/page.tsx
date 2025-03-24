"use client";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";
import ChartOne from "@/components/Charts/ChartOne";
import ChartThree from "@/components/Charts/ChartThree";
import ChartThreeEx from "@/components/Charts/ChartThreeEx";
import ChatCard from "@/components/Chat/ChatCard";
import ChatCardEx from "@/components/ChatEx/ChatCardEX";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
// import TableOne from "@/components/Tables/TableOne";
import React from "react";


export default function Dashboard() {
  return (
    <MainLayoutAdmin>
      {/* <h1 className="text-2xl font-semibold mb-3 ml-2 text-black">แดชบอร์ด</h1> */}
      <div className="w-full bg-gray-300 p-6 mb-6 ml-2 rounded shadow-md">
        <DataStatsOne />
        <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
          <ChartOne />
          {/* <ChartTwo /> */}
          <div className="col-span-12 grid grid-cols-2 gap-4">
            <div className="w-full">
              <ChartThree />
            </div>
            <div className="w-full">
              <ChartThreeEx />
            </div>
          </div>
          {/* <div className="col-span-12 xl:col-span-8">
            <TableOne />
          </div> */}
          <ChatCard />
          <ChatCardEx />
        </div>
        {/* <ChatCard /> */}
      </div>
    </MainLayoutAdmin>
  );
}
