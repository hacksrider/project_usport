import React, { useState, useEffect, useRef } from 'react';

interface InfiniteDropdownProps {
  selectedYear: number;
  setSelectedYear: React.Dispatch<React.SetStateAction<number>>;
}

const InfiniteDropdown: React.FC<InfiniteDropdownProps> = ({
  selectedYear,
  setSelectedYear,
}) => {
  const currentYear = new Date().getFullYear();
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<number[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // โหลดรายการปีเริ่มต้น (10 ปี)
  useEffect(() => {
    const initialOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);
    setOptions(initialOptions);
  }, [currentYear]);

  // ฟังก์ชันโหลดปีเพิ่มอีก 10 ปี
  const loadMore = () => {
    setOptions((prevOptions) => {
      const lastYear = prevOptions[prevOptions.length - 1];
      const newOptions = Array.from({ length: 10 }, (_, i) => lastYear - i - 1);
      return [...prevOptions, ...newOptions];
    });
  };

  // ตรวจสอบว่า scroll ถึงด้านล่างหรือยังเพื่อโหลดรายการเพิ่ม
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadMore();
    }
  };

  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };

  const handleSelect = (year: number) => {
    setSelectedYear(year);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* ส่วนแสดงค่า selected โดยใช้คลาสเหมือน select */}
      <div
        onClick={toggleDropdown}
        className="text-body-2xlg font-medium w-[70px] px-2 py-2 border border-stroke bg-white dark:bg-dark-2 cursor-pointer"
      >
        {selectedYear}
      </div>
      {/* Dropdown List */}
      {open && (
        <div
          ref={dropdownRef}
          onScroll={handleScroll}
          className="absolute top-full left-0 right-0 max-h-40 overflow-y-auto border border-stroke bg-white dark:bg-dark-2 z-10"
        >
          {options.map((year) => (
            <div
              key={year}
              onClick={() => handleSelect(year)}
              className="px-2 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 border-b last:border-b-0"
            >
              {year}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InfiniteDropdown;
