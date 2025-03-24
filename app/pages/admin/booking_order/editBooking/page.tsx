/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import axios from "axios";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Booking from '@/app/pages/user/football/booking/page';
dayjs.extend(utc);

interface Booking {
  order_ID: number;
  emp_ID: number;
  totalprice: number;
  payment_confirmation: string;
  bookings: {
    booking_ID: number; // มี booking_ID แล้ว
    users: {
      user_ID: number
      user_name: string;
      user_lastname: string;
      type_of_user: string;
    };
    fields: {
      field_ID: number;
      field_name: string;
    };
    booking_date: string;
    desired_booking_date: string;
    end_Time: string;
    start_Time: string;
    booking_status: string;
    Price: number;
  }[];
}

interface EditBookingProps {
  data: Booking | null;
}

const EditBooking: React.FC<EditBookingProps> = ({ data }) => {
  // if (!data) {
  //   return <div>No data available</div>;
  // }
  const [isModalOpenA, setIsModalOpenA] = useState(false);
  const [isModalOpenB, setIsModalOpenB] = useState(false);
  const [isTableOpen, setIsTableOpen] = useState(false);
  const [currentStartDate, setCurrentStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [slots, setSlots] = useState<Slots>({});
  const [selectedSlots, setSelectedSlots] = useState<{ ID: string; date: string; time: string }[]>([]);
  const [dataBooking, setDataBooking] = useState<dataBookingFromAPI[]>([]);
  const [feildData, setFeildData] = useState<Field[]>([]);
  const [externalUserData, setExternalUserData] = useState<Record<string, any>>({});
  const [IDF, setIDF] = useState(0)
  const [userID, setUserID] = useState(data?.bookings?.[0]?.users.user_ID)
  const [checkedNewdata, setCeckNewData] = useState(false);

  interface Slot {
    ID: string
    time: string;
    status: string;                   //'available' เขียว | 'booked'แดง |'inspecting' เหลือง
  }

  interface dataBookingFromAPI {
    desired_booking_date: string;
    start_Time: string
    end_Time: string
    booking_status: string;
  }

  interface Field {
    field_ID: number;
    field_name: string;
    status: string;
  }

  type Slots = Record<string, Slot[]>;

  const fetchBookings = async (field_ID: number) => {
    try {
      setIDF(field_ID)
      const response = await axios.get(`/api/booking/dataBooking?field_ID=${field_ID}`);
      const data = response.data;
      console.log(data);
      const updatedData = data.map((booking: dataBookingFromAPI) => {
        const date = dayjs.utc(booking.desired_booking_date).format('YYYY-MM-DD');
        const str = `${booking.start_Time.split("T")[1].split(':')[0]}`;
        const end = `${booking.end_Time.split("T")[1].split(':')[0]}`;
        const status = booking.booking_status;
        return {
          desired_booking_date: date,
          start_Time: str,
          end_Time: end,
          booking_status: status
        };
      });
      setDataBooking(updatedData);  // ตั้งค่าข้อมูลการจอง
      setIsTableOpen(true);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    };
  };

  useEffect(() => {
    const fetchFeildData = async () => {
      try {
        const response = await axios.post(`/api/booking`);       //D:\Coding U-sport\project_usport\app\api\booking\datafieldAPI\route.ts
        if (response.status === 200) {
          const dataFromApi = response.data;
          console.log(dataFromApi)
          setFeildData(dataFromApi);
        }
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };
    fetchFeildData();
  }, [IDF]);

  useEffect(() => {
    const generateWeekSlots = (startDate: string, dataBooking: dataBookingFromAPI[]): Slots => {
      const slots: Slots = {};
      for (let i = 0; i < 7; i++) {
        const date = dayjs.utc(startDate).add(i, 'day').format('YYYY-MM-DD');  // วันที่ของ slot แต่ละวัน
        slots[date] = Array.from({ length: 15 }, (_, index) => {
          const STAhour = 9 + index;
          let ENDhour = 10 + index;
          if (ENDhour === 24) {
            ENDhour = 0;
          }
          const time = `${STAhour}:00 - ${ENDhour}:00`;

          let status = 'ว่าง';  // เริ่มต้นด้วยสถานะ available

          // ตรวจสอบข้อมูลจากกลุ่ม 2 (dataBooking)
          for (let j = 0; j < dataBooking.length; j++) {
            const booking = dataBooking[j];
            const bookingDate = booking.desired_booking_date;
            const str = parseInt(booking.start_Time);
            const end = parseInt(booking.end_Time);

            if (bookingDate === date && STAhour >= str && STAhour < end) {
              status = booking.booking_status;  // ถ้าตรงกับกลุ่ม 1 และ 2 ให้เป็น inspecting
            }
          }

          // ตรวจสอบข้อมูลจากกลุ่ม 3 (data)
          // @ts-expect-error
          for (let k = 0; k < data.bookings.length; k++) {
            // @ts-expect-error
            const apiBooking = data.bookings[k];
            // @ts-expect-error
            const fieldID = data.bookings[k].fields.field_ID
            const apiBookingDate = dayjs.utc(apiBooking.desired_booking_date).format('YYYY-MM-DD');
            const apiBookingStart = parseInt(apiBooking.start_Time.split('T')[1].split(':')[0]);
            const apiBookingEnd = parseInt(apiBooking.end_Time.split('T')[1].split(':')[0]);
            if (apiBookingDate === date && STAhour >= apiBookingStart && STAhour < apiBookingEnd && fieldID === IDF) {
              if (status === 'รอการตรวจสอบ' || status === 'จองสำเร็จ') {
                status = 'แก้ไข';
              }
            }
          }
          return { ID: `${index + 1}`, time, status };
        });
      }
      return slots;
    };

    const updatedSlots = generateWeekSlots(currentStartDate, dataBooking); // เรียกฟังก์ชันสร้าง slots
    setSlots(updatedSlots);  // ตั้งค่า slots

  }, [currentStartDate, dataBooking]);

  const handleDateSearch = (date: string) => {
    setCurrentStartDate(date);
  };

  const handleSlotClick = (ID: string, date: string, time: string, status: string) => {
    if (status === 'booked' || status === 'inspecting') return;
    const isSelected = selectedSlots.find((slot) => slot.date === date && slot.time === time);
    if (isSelected) {                                                                                                 //ถ้ามีข้อมูลในอาเรย์            
      setSelectedSlots(selectedSlots.filter((slot) => !(slot.date === date && slot.time === time)));                  //ทำการลบข้อมูลออกจากอาเรย์ 
    } else if (isSelected == undefined || selectedSlots.length === 0) {                                                 //ถ้าไม่มี หรือว่า อาเรย์ว่างเปล่า
      setSelectedSlots([...selectedSlots, { ID, date, time }]);
    }
  };

  interface sepDate {
    date: string;
    time: { ID: string; value: string }[];
    detalis: {};
  }

  interface dataForSendToAPI {
    user_ID: number;  // user_ID จะเป็นชนิด number
    field_ID: number;  // field_ID จะเป็นชนิด number
    booking_date: Date;  // booking_date เป็นชนิด DateTime
    desired_booking_date: Date;  // desired_booking_date เป็นชนิด DateTime
    Price: number;  // Price เป็นตัวเลข
    end_Time: Date;  // end_Time เป็นชนิด DateTime
    start_Time: Date;  // start_Time เป็นชนิด DateTime
    booking_status: string;  // booking_status เป็น string
  }

  const [dateSeparate, setDateseperate] = useState<sepDate[]>([]);
  const [dataForSend, setDataForSend] = useState<dataForSendToAPI[]>([]);
  const [totalPriceBooking, setTotalPriceBooking] = useState(0);


  type PriceData = {
    field_ID: number;
    period_ID: number;
    price_ID: number;
    price_for_2h: number;
    price_per_1h: number;
  };

  const [price1hForPeriod1, setPrice1hForPeriod1] = useState(0);
  const [price1hForPeriod2, setPrice1hForPeriod2] = useState(0);
  const [price2hForPeriod1, setPrice2hForPeriod1] = useState(0);
  const [price2hForPeriod2, setPrice2hForPeriod2] = useState(0);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const dataPrice = await axios.get(`/api/booking/dataPrice?field_ID=${IDF}`);
        const PricefromAPI: PriceData[] = dataPrice.data;
        const period1 = PricefromAPI.find(item => item.period_ID === 1);
        const period2 = PricefromAPI.find(item => item.period_ID === 2);

        if (period1) {
          setPrice1hForPeriod1(period1.price_per_1h);
          setPrice2hForPeriod1(period1.price_for_2h);
        }
        if (period2) {
          setPrice1hForPeriod2(period2.price_per_1h);
          setPrice2hForPeriod2(period2.price_for_2h);
        }

      } catch (error) {
        console.log("ไม่สามารถดึงข้อมูลราคาได้");
      }
    }
    fetchPrice();
  }, [IDF])

  const handleProcessingBooking = () => {
    let countPrice = 0;
    const newDataForSend: dataForSendToAPI[] = [];
    const existingDates = new Set(dateSeparate.map((item) => item.date)); // สร้าง Set จาก dateSeparate เพื่อเก็บวันที่ที่มีอยู่แล้ว
    const newDates = selectedSlots.reduce((acc, slot) => {
      if (!existingDates.has(slot.date)) {
        existingDates.add(slot.date);
        const timesForDate = selectedSlots
          .filter((e) => e.date === slot.date)
          .map((e) => ({
            ID: e.ID, // เก็บ ID
            value: e.time, // เก็บเวลา (value)
          }))
          .sort((a, b) => Number(a.ID) - Number(b.ID)); // เรียงตาม ID

        const { consecutive, nonConsecutive, totalPrice } = countConsecutive(timesForDate);
        countPrice += totalPrice;
        setTotalPriceBooking(countPrice);

        consecutive.map((e, index) => {
          const lastIndex = e.details.length - 1;
          const consecutiveData = {
            user_ID: userID,
            field_ID: IDF,  // field_ID ที่เกี่ยวข้อง
            booking_date: dayjs.utc().toDate(),  // แปลงเป็น DateTime
            desired_booking_date: dayjs.utc(slot.date).toDate(),  // แปลงเป็น DateTime
            Price: consecutive[index].price,
            booking_status: "รอการตรวจสอบ",  // ตั้งสถานะการจองเป็น inspecting หรือสถานะอื่นๆ
            end_Time: dayjs.utc(`${slot.date} ${e.details[lastIndex].value.split(" - ")[1]}`, 'YYYY-MM-DD HH:mm:ss').toDate(),
            start_Time: dayjs.utc(`${slot.date} ${e.details[0].value.split(" - ")[0]}`, 'YYYY-MM-DD HH:mm:ss').toDate(),  // เวลาการเริ่มต้น
          };
          // @ts-expect-error
          newDataForSend.push(consecutiveData); // Add consecutive booking to newDataForSend
          acc.push({ date: slot.date, time: timesForDate, detalis: consecutiveData });
        });
        // Process non-consecutive bookings
        nonConsecutive.map((e, index) => {
          const nonConsecutiveData = {
            user_ID: userID,
            field_ID: IDF,  // field_ID ที่เกี่ยวข้อง
            booking_date: dayjs.utc().toDate(),  // แปลงเป็น DateTime
            desired_booking_date: dayjs.utc(slot.date).toDate(),  // แปลงเป็น DateTime
            Price: nonConsecutive[index].price,
            booking_status: "รอการตรวจสอบ",  // ตั้งสถานะการจองเป็น inspecting หรือสถานะอื่นๆ
            end_Time: dayjs.utc(`${slot.date} ${e.details[0].value.split(" - ")[1]}`, 'YYYY-MM-DD HH:mm:ss').toDate(),  // เวลาสิ้นสุด เช่น เพิ่มเวลาอีก 1 ชั่วโมง
            start_Time: dayjs.utc(`${slot.date} ${e.details[0].value.split(" - ")[0]}`, 'YYYY-MM-DD HH:mm:ss').toDate(),
          };
          // @ts-expect-error
          newDataForSend.push(nonConsecutiveData); // Add non-consecutive booking to newDataForSend
          acc.push({ date: slot.date, time: timesForDate, detalis: nonConsecutiveData });
        });
      }
      return acc;
    }, [] as sepDate[]);
    setDataForSend((prevState) => [...prevState, ...newDataForSend]);
    setDateseperate((prevState) => [...prevState, ...newDates]); // Update state with new dates
  };

  function countConsecutive(
    times: { ID: string; value: string }[],
  ): { consecutive: { count: number, details: { ID: string, value: string }[], price: number }[], nonConsecutive: { count: number, details: { ID: string, value: string }[], price: number }[], totalPrice: number } {
    if (times.length === 0) return { consecutive: [], nonConsecutive: [], totalPrice: 0 };

    // const numberArray: number[] = times.map(item => Number(item.ID));
    const consecutive: { count: number, details: { ID: string, value: string }[], price: number }[] = [];
    const nonConsecutive: { count: number, details: { ID: string, value: string }[], price: number }[] = [];
    let tempConsecutive: { ID: string, value: string }[] = [];

    // ฟังก์ชันสำหรับคำนวณราคา
    const calculatePrice = (times: { ID: string, value: string }[]): number => {
      let totalPrice = 0;

      if (times.length === 1) {
        const time = times[0].value;
        const firstHour = parseInt(time.split(":")[0]); // แยกชั่วโมงจากเวลา (เช่น "10:00" -> 10)
        if (firstHour >= 9 && firstHour < 16) {
          totalPrice = price1hForPeriod1; // ใช้ = แทน ===
        } else if (firstHour >= 16 && firstHour < 24) {
          totalPrice = price1hForPeriod2; // ใช้ = แทน ===
        }
      } else {
        const quantityHour = times.length;
        const firstTime = times[0].value;
        const lastTime = times[times.length - 1].value;
        const firstHour = parseInt(firstTime.split(":")[0]);                                                                      // แยกชั่วโมงจากเวลา (เช่น "10:00" -> 10)
        const lastHour = parseInt(lastTime.split(" - ")[1].split(":")[0]);                                                        // แยกชั่วโมงจากเวลา (เช่น "10:00" -> 10)

        if (quantityHour === 2) {
          if (firstHour >= 15 && firstHour <= 21) {
            totalPrice = price2hForPeriod2; console.log("AAAAAAA")
          } else totalPrice = price2hForPeriod1; console.log("bbbbbbbb")
        } else {
          const evenNum = Math.trunc(quantityHour / 2);
          const oddNum = quantityHour % 2;

          if (firstHour < 16 && lastHour > 22) {
            // แบ่งการจองออกเป็น 3 ส่วน: ก่อน 16:00, ระหว่าง 16:00-22:00, และหลัง 22:00
            const hoursBefore16 = 16 - firstHour;
            const hoursBetween16And22 = 22 - 16;
            const hoursAfter22 = lastHour - 22;

            // คำนวณราคาสำหรับส่วนก่อน 16:00
            const priceBefore16 = (Math.trunc(hoursBefore16 / 2) * price2hForPeriod1 + ((hoursBefore16 % 2) * price1hForPeriod1));

            // คำนวณราคาสำหรับส่วนระหว่าง 16:00-22:00
            const priceBetween16And22 = (Math.trunc(hoursBetween16And22 / 2) * price2hForPeriod2) + ((hoursBetween16And22 % 2) * price1hForPeriod2);

            // คำนวณราคาสำหรับส่วนหลัง 22:00
            const priceAfter22 = (Math.trunc(hoursAfter22 / 2) * price2hForPeriod1) + ((hoursAfter22 % 2) * price1hForPeriod1);

            // รวมราคาทั้งสามส่วน
            totalPrice = priceBefore16 + priceBetween16And22 + priceAfter22;
            console.log("คร่อมหลายช่วงเวลา:", totalPrice);
          } else if (firstHour < 16 && lastHour <= 22) {
            // กรณีจองคร่อมช่วงเวลา ก่อน 16:00 และหลัง 16:00 แต่ไม่เกิน 22:00
            const hoursBefore16 = 16 - firstHour;
            const hoursAfter16 = lastHour - 16;

            // คำนวณราคาสำหรับส่วนก่อน 16:00
            const priceBefore16 = (Math.trunc(hoursBefore16 / 2) * price2hForPeriod1) + ((hoursBefore16 % 2) * price1hForPeriod1);

            // คำนวณราคาสำหรับส่วนหลัง 16:00
            const priceAfter16 = (Math.trunc(hoursAfter16 / 2) * price2hForPeriod2) + ((hoursAfter16 % 2) * price1hForPeriod2);

            // รวมราคาทั้งสองส่วน
            totalPrice = priceBefore16 + priceAfter16;
            console.log("คร่อมช่วงเวลา 16:00:", totalPrice);

          } else if (firstHour >= 16 && lastHour > 22) {
            // กรณีจองคร่อมช่วงเวลา หลัง 16:00 และหลัง 22:00
            const hoursBefore22 = 22 - firstHour;
            const hoursAfter22 = lastHour - 22;

            // คำนวณราคาสำหรับส่วนก่อน 22:00
            const priceBefore22 = (Math.trunc(hoursBefore22 / 2) * price2hForPeriod2) + ((hoursBefore22 % 2) * price1hForPeriod2);

            // คำนวณราคาสำหรับส่วนหลัง 22:00
            const priceAfter22 = (Math.trunc(hoursAfter22 / 2) * price2hForPeriod1) + ((hoursAfter22 % 2) * price1hForPeriod1);

            // รวมราคาทั้งสองส่วน
            totalPrice = priceBefore22 + priceAfter22;
            console.log("คร่อมช่วงเวลา 22:00:", totalPrice);
          }
          if (firstHour >= 9 && lastHour <= 16) {
            // กรณีจองทั้งหมดก่อน 16:00
            totalPrice = (price2hForPeriod1 * evenNum) + (price1hForPeriod1 * oddNum);
            console.log("1111111");
          } else if (firstHour >= 16 && lastHour <= 22) {
            // กรณีจองทั้งหมดระหว่าง 16:00-22:00
            totalPrice = (price2hForPeriod2 * evenNum) + (price1hForPeriod2 * oddNum);
            console.log("2222222");
          } else if (firstHour >= 22 && lastHour <= 24) {
            // กรณีจองทั้งหมดหลัง 22:00
            totalPrice = (price2hForPeriod1 * evenNum) + (price1hForPeriod1 * oddNum);
            console.log("3333333");
          }

        }
        console.log(firstHour)
        console.log(lastHour)
        console.log(times)
      }
      return totalPrice;
    };

    let totalPrice = 0;                                                                                                                                     // สร้างตัวแปรเพื่อเก็บราคาทั้งหมด

    for (let i = 0; i < times.length; i++) {                                                                                                                // ตรวจสอบการต่อเนื่องของเวลา
      if (i === 0 || parseInt(times[i].value.split(":")[0]) === parseInt(times[i - 1].value.split(":")[0]) + 1) {
        tempConsecutive.push(times[i]); // เก็บข้อมูลที่ต่อเนื่องกัน
      } else {
        // หากพบชุดที่ต่อเนื่องเกิน 1 ตัว ให้เพิ่มเข้า consecutive
        if (tempConsecutive.length > 1) {
          const price = calculatePrice(tempConsecutive); // คำนวณราคา
          totalPrice += price; // อัปเดต totalPrice
          consecutive.push({
            count: tempConsecutive.length, // เก็บจำนวนตัวในชุดที่ต่อเนื่อง
            details: [...tempConsecutive],
            price: price
          });
        } else {
          const price = calculatePrice(tempConsecutive); // คำนวณราคา
          totalPrice += price; // อัปเดต totalPrice
          nonConsecutive.push({
            count: tempConsecutive.length, // เก็บจำนวนตัวในชุดที่ไม่ต่อเนื่อง
            details: [...tempConsecutive],
            price: price
          });
        }
        tempConsecutive = [times[i]]; // เริ่มชุดใหม่
      }
    }

    // ตรวจสอบชุดสุดท้ายหลังจากลูป
    if (tempConsecutive.length > 1) {
      const price = calculatePrice(tempConsecutive); // คำนวณราคา
      totalPrice += price; // อัปเดต totalPrice
      consecutive.push({
        count: tempConsecutive.length,
        details: [...tempConsecutive],
        price: price
      });
    } else {
      const price = calculatePrice(tempConsecutive); // คำนวณราคา
      totalPrice += price; // อัปเดต totalPrice
      nonConsecutive.push({
        count: tempConsecutive.length,
        details: [...tempConsecutive],
        price: price
      });
    }
    return { consecutive, nonConsecutive, totalPrice };
  }

  useEffect(() => {
    // console.log(selectedSlots);
    // console.log(dataForSend);
  }, [dateSeparate, dataForSend, slots, dataBooking, selectedSlots,]);

  // const fetchQuantityBooking = async() =>{
  //   try{
  //     const response = await axios.get(`/api/booking/updateDataBooking?oderID=${data.order_ID}`);
  //     const oldBooking =  response.data
  //     if (response.status === 200) {
  //       console.log("ข้อมูลที่ได้รับ:", response.data);
  //       return response.data; // ส่งข้อมูลที่ได้รับจาก API กลับ
  //     } else {
  //       console.error("API ตอบกลับสถานะไม่ถูกต้อง:", response.status);
  //       return null;
  //     }
  //   }catch(error) {
  //     console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
  //     return null;
  //   }
  // };

  const proccessUpdate = async (dataBeforUp: any[]) => {
    try {
      if (data?.bookings?.[0]?.booking_status === 'จองสำเร็จ') {
        console.log("เข้าเคส 2")
        if (totalPriceBooking > data.totalprice || totalPriceBooking < data.totalprice) {
          alert("ราคาการจองใหม่ ไม่เท่ากับราคาที่คุณจ่ายแล้ว!!! ,ไม่สามารถเปลี่ยนแปลงได้ค่ะ")
          handleEditClick();
          return;
        } else {
          const updatedata = dataBeforUp.map(booking => ({
            ...booking,
            order_ID: data.order_ID,
            case_type: 'c2',
            emp_ID: data.emp_ID,
          }));
          sendToApi(updatedata);
        }
      } else if (data?.bookings?.[0]?.booking_status === 'รอการตรวจสอบ' && dataForSend.length === data.bookings.length) {  //เคส 1 ยังไม่จ่าย แล้วเปลี่ยนเวลาใหม่ แล้วมีจำนวน Row เท่ากับของเดิม = เปลี่ยนเวลาได้ /เปลี่ยนวันที่ต้องการจองได้/ เปลี่ยนสนามได้/ orderIDเดิม/ bookingIDเดิม /ราคารวมใหม่/
        console.log("เข้าเคส 1")
        const updatedData = dataBeforUp.map((booking, index) => ({
          ...booking,
          order_ID: data.order_ID,
          booking_ID: data.bookings?.[index]?.booking_ID,
          totalPriceForOrder: totalPriceBooking,
          case_type: 'c1',
          emp_ID: data.emp_ID,
        }));
        sendToApi(updatedData);
      } else if (data?.bookings?.[0]?.booking_status === 'รอการตรวจสอบ' && (dataForSend.length < data.bookings.length || dataForSend.length > data.bookings.length)) {                        //เคส 3 ยังไม่จ่าย แล้วเปลี่ยนเวลาใหม่ แล้วมีจำนวน Row ไม่เท่ากับของเดิม  = (เปรียบเสมือนการจองใหม่หมด แต่ยังเหลือการจองเดิมที่เคยจองใว่ หมายถึง จองเก่ากับจองใหม่จะมี orderID เดียวกัน)      
        console.log("เข้าเคส 3")
        const updatedata = dataBeforUp.map(booking => ({
          ...booking,
          //totalPriceForOrder:totalPriceBooking,
          order_ID: data.order_ID,
          emp_ID: data.emp_ID,
          case_type: 'c3'
        }));
        sendToApi(updatedata);
      }
    } catch (error) {
      console.log('เตรียมข้อมูลส่งไม่ได้ :', error)
    }
  }

  const sendToApi = async (upBooking: any[]) => {
    console.log(upBooking)
    try {
      const dataToupdate = await axios.put('/api/booking/updateDataBooking', upBooking, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (dataToupdate.status === 200) {
        console.log('ส่งไป API ได้', dataToupdate);
        alert("แก้ไขการจองสำเร็จ");
        handleEditClick();
        refrechBooking();
      }
    } catch (error) {
      console.log('ส่งไม่ได้', error)
    }
  }

  if (!slots[currentStartDate]) {
    return <div>Loading...</div>; // Show a loading indicator during hydration
  }

  const handleEditClick = () => {
    setExternalUserData([]);
    setSelectedSlots([]);
    setDateseperate([]);
    setDataForSend([]);
    setUserID(0);
    setTotalPriceBooking(0);
    setIsModalOpenA(false);
    setIsModalOpenB(false);
    setCeckNewData(false)
  }

  const refrechBooking = async () => {
    setIsTableOpen(false)
    await fetchBookings(IDF);
  }

  const proccessingNewdata = () => {
    setDataForSend([])
    handleProcessingBooking();
    if (selectedSlots.length === 0) {
      alert("กรุณาเลือกเวลาก่อนค่ะ !!!");
      handleEditClick(); // รีเซ็ตสถานะต่าง ๆ
      return;
    }
    hhhh();
  };

  const hhhh = () => {
    setCeckNewData(true)
  }


  return (
    <div className=" w-full p-8 ">
      <div className=" flex items-center  flex-col  mb-6">

        <h1 className="text-3xl font-bold text-center text-gray-800  transition duration-300">
          {IDF === 0 ? 'กรุณาเลือกสนาม' : 'สนาม :' + IDF}
        </h1>

        <div className="flex justify-between space-x-4 mt-4">
          {feildData.map((field, Index) => {
            return (
              <button
                key={Index}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200"
                onClick={() => fetchBookings(field.field_ID)}
              >
                Field :&nbsp; {field.field_name}
              </button>
            );
          })}
        </div>
      </div>

      {isTableOpen && (

        <div className="overflow-x-auto w-full max-w-full border-[10px] border-gray-800">
          <input
            type="date"
            value={currentStartDate}
            onChange={(e) => handleDateSearch(e.target.value)}
            className="p-2 border rounded"
          />
          <table className=" table-auto w-full text-center border-collapse border-gray-800">
            <thead>
              <tr>
                <th className="border border-gray-800 text-black min-w-[85px] h-[60px]">DATE</th>
                {slots[currentStartDate]?.map((_, index) => {
                  const time = slots[currentStartDate][index].time;
                  return (
                    <th
                      key={time}
                      className="border border-gray-800 text-black min-w-[110px] h-[60px]"
                    >
                      {time}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Object.keys(slots).map((date) => (
                <tr key={date}>
                  <td className="font-bold border border-gray-800 text-black min-w-[115px] h-[60px]">
                    {dayjs(date).format('DD MMM YYYY')}
                  </td>
                  {slots[date]?.map((slot) => {
                    const currenttime = parseInt(dayjs().format('HH'));
                    const slotTime = parseInt(slot.ID) + 8;
                    return (
                      <td
                        key={`${slot.time}`}
                        className={`border border-gray-800 cursor-pointer 
                        ${dayjs().isSame(date, 'day') &&
                            (slot.time.includes('9:00 - 10:00') ||
                              slot.time.includes('10:00 - 11:00') ||
                              slot.time.includes('11:00 - 12:00') ||
                              slot.time.includes('12:00 - 13:00') ||
                              slotTime <= currenttime
                            ) || dayjs().isAfter(date, 'day')

                            ? 'bg-gray-500 cursor-not-allowed'
                            : slot.status === 'จองสำเร็จ'
                              ? 'bg-red-500 cursor-not-allowed'
                              : slot.status === 'รอการตรวจสอบ'
                                ? 'bg-yellow-500 cursor-not-allowed'  // สีเหลืองสำหรับ inspecting
                                : selectedSlots.find(
                                  (selectedSlot) =>
                                    selectedSlot.time === slot.time && selectedSlot.date === date
                                )
                                  ? 'bg-blue-500'
                                  : slot.status === 'แก้ไข'
                                    ? 'bg-pink-500'
                                    : slot.status === 'ว่าง'
                                      ? 'bg-green-500'  // สีเขียวสำหรับ available
                                      : 'bg-green-500'
                          }
                      `}
                        onClick={() => {
                          handleSlotClick(slot.ID, date, slot.time, slot.status);
                        }}
                      ></td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {isTableOpen && (
        <div>
          <div className="mt-4 p-6 bg-white shadow-lg rounded-lg border border-gray-300">
            <div className="text-lg font-bold text-gray-800 mb-6">
              <h3 className="text-xl text-blue-600">Order ID : {data?.order_ID}</h3>
            </div>

            <div className="overflow-x-auto">
              <h3 className="text-xl text-black-600">ข้อมูลเดิม</h3>
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr>
                    {/* <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">BookingID</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">OrderID</th> */}
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">ชื่อ-นามสกุล</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">สนาม</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">วันที่ต้องการจอง</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">เวลา</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">สถานะการจอง</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">ราคาต่อเซ็ตนี้</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.bookings?.map((e, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                      {/* <td className="px-6 py-4 text-center text-sm text-gray-700">{e.booking_ID}</td>
                        <td className="px-6 py-4 text-center text-sm text-gray-700">{data.order_ID}</td> */}
                      <td className="px-6 py-4 text-center text-sm text-gray-700">{e.users?.user_name} {e.users?.user_lastname}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">{e.fields?.field_name}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">{dayjs(e.desired_booking_date).format('DD - MMMM - YYYY')}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">{dayjs.utc(e.start_Time).format('HH:mm')} - {dayjs.utc(e.end_Time).format('HH:mm')}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">{e.booking_status}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-700">{e.Price} บาท</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-6 text-right text-lg font-semibold">
                ราคารวม {data?.totalprice}
              </div>
            </div>

            {checkedNewdata && (
              <div id="main" className="mt-6">
                <div className="text-lg font-bold text-gray-800 mb-6">
                </div>
                <div className="overflow-x-auto">
                  <h3 className="text-xl text-black-600">{'"ข้อมูลใหม่"'}</h3>

                  <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 text-center">
                      <tr>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">ชื่อ-นามสกุล</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">สนาม</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">วันที่ต้องการจอง</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">เวลา</th>
                        <th className="px-6 py-3 text-center text-sm font-semibold text-gray-600">ราคาต่อเซ็ตนี้</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataForSend.map((e, index) => (
                        <tr key={index} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4 text-center text-sm text-gray-700">
                            {data?.bookings?.[0]?.users?.user_name} {data?.bookings?.[0]?.users?.user_lastname}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-700">{feildData.map((e) => { return (e.field_ID === IDF ? e.field_name : '') })}</td>
                          <td className="px-6 py-4 text-center text-sm text-gray-700">
                            {dayjs(e.desired_booking_date).format('DD - MMMM - YYYY')}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-700">
                            {dayjs.utc(e.start_Time).format('HH:mm')} - {dayjs.utc(e.end_Time).format('HH:mm')}
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-700">{e.Price} บาท</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-6 text-right text-lg font-semibold">ราคารวม {totalPriceBooking}</div>
                </div>
              </div>
            )}
            <div className='w-full mt-4 flex flex-row justify-end gap-4'>
              {!checkedNewdata && (<div>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                  onClick={proccessingNewdata}
                >
                  ตรวจสอบการเปลี่ยนแปลง
                </button>
              </div>)}
              {checkedNewdata && (
                <div>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded"
                    onClick={() => proccessUpdate(dataForSend)}
                  >
                    ยืนยันการแก้ไข
                  </button>
                  <button
                    className="ml-4  px-4 py-2 bg-red-500 text-white rounded"
                    onClick={handleEditClick}
                  >
                    ยกเลิก
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default EditBooking;