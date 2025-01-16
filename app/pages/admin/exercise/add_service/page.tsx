"use client";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";
import axios from "axios";
import React, { useState } from "react";

export default function AddService() {
  const [service_name, setservice_name] = useState("");
  const [capacity_of_room, setcapacity_of_room] = useState("");
  const [daylyRates, setdaylyRates] = useState([{ quantity_of_days: "", price: "", unit: "" }]);
  const [Status, setStatus] = useState(false);
  const handleAdddaylyRate = () => {
    setdaylyRates([...daylyRates, { quantity_of_days: "", price: "", unit: "" }]);
  };

  const handleRemovedaylyRate = (index: number) => {
    setdaylyRates(daylyRates.filter((_, i) => i !== index));
  };

  const handledaylyRateChange = (index: number, field: string, value: string) => {
    const updatedRates = daylyRates.map((rate, i) =>
      i === index ? { ...rate, [field]: value } : rate
    );
    setdaylyRates(updatedRates);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const detail = daylyRates;

    try {
      const response = await axios.post("/api/services", {
        service_name,
        capacity_of_room,
        detail,
        Status
      }); // ส่งข้อมูลไปยัง API
      if (response.status === 201) {
        alert("บันทึกข้อมูลเรียบร้อย!");
        window.location.href = "/pages/admin/exercise";
      }
    } catch (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");

    }
  };




  return (
    <MainLayoutAdmin>
      <h1 className="text-2xl font-semibold mb-3 text-black flex items-center gap-2">
        <div className="hover:underline cursor-pointer hover:text-blue-800"><button onClick={() => window.history.back()}>บริการการออกกำลังกาย</button></div> - <div className="hover:underline cursor-pointer hover:text-blue-800">เพิ่มบริการ</div>
      </h1>
      <div className="w-full bg-gray-300 p-6 mb-6 rounded shadow-md">
        {/* ฟอร์มการเพิ่มบริการ */}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">ชื่อบริการ</label>
            <input
              type="text"
              value={service_name}
              onChange={(e) => setservice_name(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded"
              placeholder="กรอกชื่อบริการ"
            />
          </div>
          <div className="mb-4">
            <label className="block text-black font-medium mb-2">ความจุ</label>
            <input
              type="number"
              min={0}
              value={capacity_of_room}
              onChange={(e) => setcapacity_of_room(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded"
              placeholder="ใส่ความจุจำนวนคน"
            />
          </div>


          <div className="mb-4">
            <label className="block text-black font-medium mb-2">กำหนดราคา</label>
            {daylyRates.map((rate, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 mb-2 items-center border border-gray-400 rounded p-2 bg-green-200">
                <div className="col-span-4">
                  <label className="block text-sm text-black mb-1">จำนวน</label>
                  <input
                    type="number"
                    min={1}
                    value={rate.quantity_of_days}
                    onChange={(e) => handledaylyRateChange(index, "quantity_of_days", e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded"
                    placeholder="ใส่จำนวนวัน สัปดาห์ หรือ จำนวนปี"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-sm text-black mb-1">หน่วย</label>
                  <select
                    value={rate.unit}
                    onChange={(e) => handledaylyRateChange(index, "unit", e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded"
                  >
                    <option value="เลือกหน่วย">เลือกหน่วย</option>
                    <option value="วัน">วัน</option>
                    <option value="สัปดาห์">สัปดาห์</option>
                    <option value="เดือน">เดือน</option>
                    <option value="ปี">ปี</option>
                  </select>
                </div>

                <div className="col-span-4">
                  <label className="block text-sm text-black mb-1">ราคา/หน่วย</label>
                  <input
                    type="number"
                    min={1}
                    value={rate.price}
                    onChange={(e) => handledaylyRateChange(index, "price", e.target.value)}
                    className="w-full p-2 border border-gray-400 rounded"
                    placeholder="กำหนดราคา (บาท)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovedaylyRate(index)}
                  className="text-black col-span-1 flex justify-center items-center bg-red-500 hover:bg-red-600 rounded p-2 h-full"
                >
                  ลบ
                </button>

              </div>
            ))}
            <button
              type="button"
              onClick={handleAdddaylyRate}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
            >
              + เพิ่มจำนวนเดือนและราคา
            </button>
          </div>

          <div className="flex justify-end items-center gap-10 mt-4 xsm:mt-0">
            <label
              htmlFor="toggle3"
              className="flex cursor-pointer select-none items-center"
            ><h1 className="pr-2 text-xl">สถานะการให้บริการ</h1>
              <div className="relative">
                <input
                  type="checkbox"
                  id="toggle3"
                  className="sr-only"
                  onChange={() => {
                    setStatus(!Status);
                  }}
                />
                <div className="block h-8 w-14 rounded-full bg-gray-400"></div>
                <div
                  className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-switch-1 transition ${Status && "!right-1 !translate-x-full !bg-green-600"
                    }`}
                >
                  <span className={`hidden ${Status && "!block"}`}>
                    <svg
                      className="fill-white dark:fill-dark"
                      width="11"
                      height="8"
                      viewBox="0 0 11 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.2355 0.812752L10.2452 0.824547C10.4585 1.08224 10.4617 1.48728 10.1855 1.74621L4.85633 7.09869C4.66442 7.29617 4.41535 7.4001 4.14693 7.4001C3.89823 7.4001 3.63296 7.29979 3.43735 7.09851L0.788615 4.43129C0.536589 4.1703 0.536617 3.758 0.788643 3.49701C1.04747 3.22897 1.4675 3.22816 1.72731 3.49457L4.16182 5.94608L9.28643 0.799032C9.54626 0.532887 9.96609 0.533789 10.2248 0.801737L10.2355 0.812752Z"
                        fill=""
                      />
                    </svg>
                  </span>
                  <span className={`${Status && "hidden"}`}>
                    <svg
                      className="fill-current"
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_803_2686)">
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.23529 2.29669C0.942402 2.00379 0.942402 1.52892 1.23529 1.23603C1.52819 0.943134 2.00306 0.943134 2.29596 1.23603L5.37433 4.3144L8.45261 1.23612C8.7455 0.943225 9.22038 0.943225 9.51327 1.23612C9.80616 1.52901 9.80616 2.00389 9.51327 2.29678L6.43499 5.37506L9.51327 8.45334C9.80616 8.74624 9.80616 9.22111 9.51327 9.514C9.22038 9.8069 8.7455 9.8069 8.45261 9.514L5.37433 6.43572L2.29596 9.51409C2.00306 9.80699 1.52819 9.80699 1.23529 9.51409C0.942402 9.2212 0.942402 8.74633 1.23529 8.45343L4.31367 5.37506L1.23529 2.29669Z"
                          fill=""
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_803_2686">
                          <rect width="10.75" height="10.75" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </span>
                </div>
              </div>
            </label>


            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                บันทึก
              </button>
            </div>
          </div>
        </form>
      </div>
    </MainLayoutAdmin>
  );
};


