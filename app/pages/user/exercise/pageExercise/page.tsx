/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */

"use client";
import MainLayout from "@/app/components/mainLayout";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ServiceAll, ServicesInterface } from "@/app/interface/services";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ServiceToSave } from "@/app/interface/buyingExercise";

export default function Exercise() {
  const [services, setServices] = useState<ServiceAll[]>([]);
  const { data, status } = useSession();
  const router = useRouter();
  // state สำหรับรวบรวมข้อมูลบริการที่เลือกไว้
  const [serviceToSave, setServiceToSave] = useState<ServiceToSave[]>([]);
  // state เก็บข้อมูลการนับบริการตามวันที่
  const [serviceCounts, setServiceCounts] = useState<{
    [date: string]: {
      [service: string]: number;
    };
  }>({});

  // ใช้ useCallback เพื่อให้ฟังก์ชันมี reference ที่คงที่
  const handleServiceUpdate = useCallback(
    (data: ServiceToSave | null, id: number) => {
      setServiceToSave((prev) => {
        const filtered = prev.filter((item) => item.service_ID !== id);
        return data ? [...filtered, data] : filtered;
      });
    },
    []
  );

  const fetchServices = async () => {
    try {
      const response = await axios.get("/api/services/user");
      const data: ServicesInterface = await response.data;
      setServices(data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchServiceCounts = async () => {
    try {
      const response = await axios.get("/api/buyingexercise/count_cap");
      const { success, data } = await response.data;

      if (success && data && data.servicesByDate) {
        setServiceCounts(data.servicesByDate);
      }
    } catch (error) {
      console.error("Error fetching service counts:", error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchServiceCounts();
  }, []);

  const addServices = () => {
    if (serviceToSave.length === 0) {
      alert("กรุณาใส่ข้อมูลให้ครบ");
      return;
    }
    sessionStorage.setItem("serviceToSave", JSON.stringify(serviceToSave));
    router.push("/pages/user/exercise/calculate_price");
  };



  return (
    <MainLayout>
      <div className="w-[800px] p-8 mx-auto">
        { /* <div className="relative rounded-lg overflow-hidden shadow-2xl mb-8 group mx-auto">
          <img
            src="/user/img/fitness-1.jpg"
            alt="Banner 1"
            className="w-full h-72 object-cover brightness-90 scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <p className="text-white text-3xl font-bold">เลือกรายการออกกำลังกาย</p>
          </div>
        </div>
        */}
        <div className="w-full max-w-[900px] bg-white shadow-2xl rounded-3xl p-12">
          <h1 className="text-center text-4xl font-extrabold mb-10 text-gray-900">โปรดเลือก</h1>
          {services.map((service, index) => (
            <ComService
              key={index}
              serviceName={service.service_name}
              price={service.time_and_price}
              quantity={service.capacity_of_room}
              id={service.service_ID}
              onServiceUpdate={handleServiceUpdate}
              serviceCounts={serviceCounts}
            />
          ))}
          <button
            onClick={() => {
              if (status === "unauthenticated") {
                alert("กรุณาเข้าสู่ระบบ");
                router.push("/pages/user/AAA/login");
              } else {
                addServices();
              }
            }}
            className="w-full py-4 rounded-2xl font-extrabold shadow-xl text-lg bg-gradient-to-br from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-transform hover:scale-105"
          >
            สั่งซื้อ
          </button>
        </div>
      </div>
    </MainLayout>
  );
}

// Child Component: ComService.tsx
type ComServiceProps = {
  serviceName: string;
  quantity: number;
  price: {
    quantity_of_days: number;
    unit: string;
    price: number;
  }[];
  id: number;
  onServiceUpdate: (data: ServiceToSave | null, id: number) => void;
  serviceCounts: {
    [date: string]: {
      [service: string]: number;
    };
  };
};

const ComService = (props: ComServiceProps) => {
  const [checkBox, setCheckBox] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [customQuantity, setCustomQuantity] = useState<number>(1);
  const [computedPrice, setComputedPrice] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [isOverCapacity, setIsOverCapacity] = useState(false);

  // useEffect ที่ส่งข้อมูลกลับไปยัง parent เมื่อข้อมูลเปลี่ยนแปลง
  useEffect(() => {
    if (!checkBox || selectedOptionIndex === null || !selectedDate || isOverCapacity) {
      props.onServiceUpdate(null, props.id);
      return;
    }
    const option = props.price[selectedOptionIndex];
    const amount_of_time = selectedOptionIndex === 0 ? customQuantity : option.quantity_of_days;
    const newServiceData: ServiceToSave = {
      service_name: props.serviceName,
      service_ID: props.id,
      amount_of_time,
      units: option.unit,
      desired_start_date: selectedDate,
      Price: computedPrice,
      buying_date: new Date().toISOString().split("T")[0],
    };
    props.onServiceUpdate(newServiceData, props.id);
  }, [
    checkBox,
    selectedOptionIndex,
    customQuantity,
    selectedDate,
    computedPrice,
    props.serviceName,
    props.id,
    props.price,
    props.onServiceUpdate,
    isOverCapacity
  ]);

  // อัพเดทข้อมูลจำนวนเมื่อเลือกวันที่หรือบริการ
  // Update the useEffect that checks for capacity
  useEffect(() => {
    if (checkBox && selectedDate) {
      const date = new Date(selectedDate);
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear() + 543}`;

      let count = 0;
      if (
        props.serviceCounts &&
        props.serviceCounts[formattedDate] &&
        props.serviceCounts[formattedDate][props.serviceName]
      ) {
        count = props.serviceCounts[formattedDate][props.serviceName];
      }

      setCurrentCount(count);

      // Only check for capacity if props.quantity exists and is not zero
      if (props.quantity != null && props.quantity !== 0) {
        // ตรวจสอบว่าเกินความจุหรือไม่
        if (count >= props.quantity) {
          setIsOverCapacity(true);
          // แจ้งเตือนผู้ใช้
          alert(`บริการ ${props.serviceName} ในวันที่เลือกเต็มแล้ว กรุณาเลือกวันอื่น`);
          // ยกเลิกการเลือก
          uncheckService();
        } else {
          setIsOverCapacity(false);
        }
      } else {
        // If no capacity limit, always set to not over capacity
        setIsOverCapacity(false);
      }
    } else {
      setCurrentCount(0);
      setIsOverCapacity(false);
    }
  }, [selectedDate, checkBox, props.serviceName, props.serviceCounts, props.quantity]);

  // ฟังก์ชันยกเลิกการเลือกบริการ
  const uncheckService = () => {
    setCheckBox(false);
    document.getElementsByName("group" + props.id).forEach((input) => {
      // @ts-expect-error
      input.checked = false;
    });
    const input = document.getElementsByName("number" + props.id + "-0")[0];
    if (input) {
      // @ts-expect-error
      input.disabled = true;
      // @ts-expect-error
      input.value = "0";
    }
    setSelectedOptionIndex(null);
    setComputedPrice(0);
    setSelectedDate("");

    // ยกเลิกการเลือก checkbox ด้วย
    const checkbox = document.getElementById(`fitness-${props.id}`) as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false;
    }
  };

  const handlePriceChange = (optionIndex: number, qty: number = 1) => {
    setSelectedOptionIndex(optionIndex);
    if (optionIndex === 0) {
      let priceTotal = 0;
      let qtyRemaining = qty;
      const sortedTiers = [...props.price].sort((a, b) => b.quantity_of_days - a.quantity_of_days);
      sortedTiers.forEach((tier) => {
        if (qtyRemaining >= tier.quantity_of_days) {
          const multiplier = Math.floor(qtyRemaining / tier.quantity_of_days);
          priceTotal += multiplier * tier.price;
          qtyRemaining = qtyRemaining % tier.quantity_of_days;
        }
      });
      setComputedPrice(priceTotal);
      setCustomQuantity(qty);
    } else {
      setComputedPrice(props.price[optionIndex].price);
    }
  };

  return (
    <fieldset className="mb-4">
      <div className="bg-gradient-to-tr from-gray-100 to-gray-200 px-8 pt-6 rounded-2xl mb-10 border border-gray-300 shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="flex items-center mb-6">
          <input
            type="checkbox"
            id={`fitness-${props.id}`}
            name="activity"
            onChange={(e) => {
              const checked = e.target.checked;
              setCheckBox(checked);
              if (!checked) {
                document.getElementsByName("group" + props.id).forEach((input) => {
                  // @ts-expect-error
                  input.checked = false;
                });
                // @ts-expect-error
                document.getElementsByName("number" + props.id + "-0")[0].disabled = true;
                // @ts-expect-error
                document.getElementsByName("number" + props.id + "-0")[0].value = "0";
                setSelectedOptionIndex(null);
                setComputedPrice(0);
                setSelectedDate("");
                setCurrentCount(0);
              }
            }}
            className="mr-4 h-7 w-7 text-blue-500 focus:ring-blue-500 focus:ring-2 rounded-full"
            disabled={props.quantity != null && props.quantity !== 0 && isOverCapacity}
          />
          <label htmlFor={`fitness-${props.id}`} className="font-bold text-lg text-gray-800">
            {props.serviceName}
          </label>
          {(props.quantity == null || props.quantity === 0) ? ("") : (
            <div className="ml-auto text-gray-600 text-sm ">
              ความจุ : <span className={`font-bold ${currentCount >= props.quantity ? 'text-red-500' : 'text-green-500'}`}>
                {currentCount}/{props.quantity}
              </span>
              {currentCount >= props.quantity && (
                <span className="ml-2 text-red-500 font-semibold">(เต็ม)</span>
              )}
            </div>
          )}
        </div>
        <div className="mb-8">
          <span className="block font-medium mb-4 text-gray-700 text-lg">เลือกระยะเวลา</span>
          <div className="grid grid-cols-2 gap-6">
            {props.price.map((priceObj, index) => (
              <Price
                key={index}
                days={priceObj.quantity_of_days}
                unit={priceObj.unit}
                price={priceObj.price}
                first={index === 0}
                id={props.id}
                disable={!checkBox}
                index={index}
                priceChage={(pi: number, qty: number = 1) => {
                  handlePriceChange(pi, qty);
                }}
              />
            ))}
          </div>
        </div>
        <div className="mb-8 flex items-center gap-4 text-gray-700 text-lg">
          <span>เลือกวันที่</span>
          <input
            className="w-1/2 p-2 border border-gray-300 rounded-md text-gray-800"
            type="date"
            disabled={!checkBox}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="ml-auto text-gray-600 text-sm font-medium flex items-center gap-2 justify-end mb-4">
          ราคา <span className="font-bold text-blue-500 text-lg">{computedPrice || 0}</span> บาท
        </div>

      </div>
    </fieldset>
  );
};

type PriceProps = {
  days: number;
  unit: string;
  price: number;
  first: boolean;
  id: number;
  disable: boolean;
  index: number;
  priceChage: (optionIndex: number, qty?: number) => void;
};

const Price = (props: PriceProps) => {
  const [radioClick, setRadioClick] = useState(false);
  return (
    <label className="flex items-center text-gray-700">
      <input
        name={"group" + props.id}
        type="radio"
        disabled={props.disable}
        onChange={(e) => {
          setRadioClick(e.target.checked);
          if (e.target.checked) {
            if (props.index === 0) {
              props.priceChage(props.index, 1);
              const input = document.getElementsByName("number" + props.id + "-" + props.index)[0] as HTMLInputElement;
              if (input) input.disabled = false;
            } else {
              props.priceChage(props.index);
              const input = document.getElementsByName("number" + props.id + "-0")[0] as HTMLInputElement;
              if (input) {
                input.disabled = true;
                input.value = "1";
              }
            }
          }
        }}
        value={props.days}
        className="mr-3 h-6 w-6 text-blue-500 focus:ring-blue-500 focus:ring-2 rounded-full"
      />
      {props.days} {props.unit}
      {props.first && (
        <input
          type="number"
          name={"number" + props.id + "-" + props.index}
          min={1}
          disabled
          onChange={(e) => props.priceChage(props.index, parseInt(e.target.value))}
          className="w-1/2 ml-2 p-2 border rounded"
          placeholder="X จำนวน"
        />
      )}
    </label>
  );
};