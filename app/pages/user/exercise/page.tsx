/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import MainLayout from "@/app/components/mainLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceAll, ServicesInterface } from "@/app/interface/services";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function Exercise() {
  const { data, status } = useSession();
  const [services, setServices] = useState<ServiceAll[]>([]);
  const [isSelect, setIsSelect] = useState<string[]>([]);
  const [selectedRadio, setSelectedRadio] = useState<{ [key: string]: string | number }>({});
  const [otherSelected, setOtherSelected] = useState<{ [key: string]: boolean }>({});
  const [otherValues, setOtherValues] = useState<{ [key: string]: number }>({});
  const [selectServices, setSelectServices] = useState<any[]>([]);
  const [dates, setDates] = useState<{ [key: string]: string }>({});
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  const router = useRouter();

  useEffect(() => {
    console.log(selectServices);
    checkSubmitEligibility();
  }, [selectServices]);

  const addService = (index: number, e: React.ChangeEvent<HTMLInputElement>, service: ServiceAll) => {
    const minPrice = service.price_exercise.reduce((min, p) => Math.min(min, p.price), Infinity);
    const price =
      service.price_exercise.find((p) => p.time_ID === selectedRadio[service.service_name])?.price || 0;

    let temp = [...selectServices];
    if (e.target.checked) {
      temp.push({
        detail: service,
        time: null,
        unit: "",
        date: dates[service.service_name] || "",
        price,
      });
    } else {
      temp = temp.filter((t) => t.detail.service_ID !== service.service_ID);
    }
    setSelectServices(temp);
    handleClick(index);
  };

  const handleClick = (index: number) => {
    const serviceName = services[index].service_name;
    setIsSelect((prev) => {
      const updatedSelection = prev.includes(serviceName)
        ? prev.filter((name) => name !== serviceName)
        : [...prev, serviceName];

      if (prev.includes(serviceName)) {
        setSelectedRadio((radioPrev) => {
          const { [serviceName]: _, ...rest } = radioPrev;
          return rest;
        });
        setOtherSelected((otherPrev) => {
          const { [serviceName]: _, ...rest } = otherPrev;
          return rest;
        });
        setOtherValues((values) => {
          const { [serviceName]: _, ...rest } = values;
          return rest;
        });
        setDates((datesPrev) => {
          const { [serviceName]: _, ...rest } = datesPrev;
          return rest;
        });
      }
      return updatedSelection;
    });
  };

  const handleRadioChange = (
    serviceName: string,
    e: React.ChangeEvent<HTMLInputElement>,
    service: ServiceAll,
    timeOption: any
  ) => {
    const price = timeOption.price || 0;

    const temp = selectServices.map((t) => {
      if (t.detail.service_ID === service.service_ID) {
        sessionStorage.setItem(`${serviceName}_unit`, timeOption.time_of_service.unit);
        return { ...t, time: timeOption, price, unit: timeOption.time_of_service.unit };
      }
      return t;
    });

    setSelectServices(temp);
    setSelectedRadio((prev) => ({
      ...prev,
      [serviceName]: Number(e.target.value),
    }));
  };

  const handleDateChange = (serviceName: string, value: string) => {
    setDates((prev) => ({
      ...prev,
      [serviceName]: value,
    }));

    setSelectServices((temp) =>
      temp.map((t) => {
        if (t.detail.service_name === serviceName) {
          return { ...t, date: value };
        }
        return t;
      })
    );
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get("/api/services");
      const data: ServicesInterface = await response.data;
      setServices(data.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const checkSubmitEligibility = () => {
    const isEligible =
      selectServices.length > 0 &&
      selectServices.every((service) => service.time && service.date);
    setIsSubmitEnabled(isEligible);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  return (
    <MainLayout>
      <div className="w-[800px] p-8 mx-auto">
        <div className="relative rounded-lg overflow-hidden shadow-2xl mb-8 group mx-auto">
          <img
            src="/user/img/fitness-1.jpg"
            alt="Banner 1"
            className="w-full h-72 object-cover brightness-90 scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 bg-opacity-50 transition-all duration-500 flex items-center justify-center">
            <p className="text-white text-3xl font-bold opacity-100 transition-opacity duration-500">
              เลือกรายการออกกำลังกาย
            </p>
          </div>
        </div>

        <div className="w-full max-w-[900px] bg-white shadow-2xl rounded-3xl p-12 relative">
          <h1 className="text-center text-4xl font-extrabold mb-10 text-gray-900 tracking-wide">โปรดเลือก</h1>

          {services
            .filter((service) => service.Status !== false)
            .map((service, index) => {
              const sortedPriceExercise = [...service.price_exercise].sort(
                (a, b) => a.time_of_service.quantity_of_days - b.time_of_service.quantity_of_days
              );

              return (
                <div
                  key={index}
                  className="bg-gradient-to-tr from-gray-100 to-gray-200 px-8 pt-6 rounded-2xl mb-10 border border-gray-300 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                >
                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id={`fitness-${index}`}
                      onChange={(e) => addService(index, e, service)}
                      name="activity"
                      className="mr-4 h-7 w-7 text-blue-500 focus:ring-blue-500 focus:ring-2 rounded-full"
                    />
                    <label htmlFor={`fitness-${index}`} className="font-bold text-lg text-gray-800">
                      {service.service_name}
                    </label>
                    <div className="ml-auto text-gray-600 text-sm mt-1 ">ความจุ : <div className="font-bold text-green-500">0/{service.capacity_of_room}</div></div>
                  </div>
                  <div className="mb-8">
                    <span className="block font-medium mb-4 text-gray-700 text-lg">เลือกระยะเวลา</span>
                    <div className="grid grid-cols-2 gap-6">
                      {sortedPriceExercise.map((timeOption, index2) => (
                        <label key={index2} className="flex items-center text-gray-700">
                          <input
                            disabled={!isSelect.includes(service.service_name)}
                            type="radio"
                            name={`duration-${index}`}
                            value={timeOption.time_of_service.time_ID}
                            checked={Number(selectedRadio[service.service_name]) === timeOption.time_of_service.time_ID}
                            onChange={(e) => handleRadioChange(service.service_name, e, service, timeOption)}
                            className="mr-3 h-6 w-6"
                          />
                          {timeOption.time_of_service.quantity_of_days} {timeOption.time_of_service.unit}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="mb-8 flex items-center gap-4 text-gray-700 text-lg mt-1">
                    <span className="text-gray-700 text-lg flex items-center">เลือกวันที่</span>
                    <input
                      className="w-1/2 p-2 border border-gray-300 rounded-md text-gray-800"
                      type="date"
                      value={dates[service.service_name] || ""}
                      onChange={(e) => { handleDateChange(service.service_name, e.target.value); }}
                      min={today}
                      disabled={!isSelect.includes(service.service_name)}
                    />
                  </div>
                  <div className="ml-auto text-gray-600 text-sm font-medium mt-1 mb-4 flex items-center justify-end gap-2">
                    ราคา <p className="font-bold text-blue-500 text-lg flex items-center">{selectServices.find(t => t.detail.service_ID === service.service_ID)?.price || 0}</p> บาท
                  </div>
                </div>
              );
            })}

          <button
            onClick={() => {
              if (status === "unauthenticated") {
                alert("กรุณาเข้าสู่ระบบ");
                // router.push("/pages/user/AAA/login");
              } else {
                sessionStorage.setItem("selectServices", JSON.stringify(selectServices));
                router.push("/pages/user/exercise/calculate_price");
              }
            }}
            disabled={!isSubmitEnabled}

            className={`w-full py-4 rounded-2xl font-extrabold shadow-xl text-lg transition-transform hover:scale-105 ${isSubmitEnabled
              ? "bg-gradient-to-br from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
          >
            สั่งซื้อ
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
