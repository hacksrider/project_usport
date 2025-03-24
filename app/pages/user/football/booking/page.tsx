/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import axios from "axios";
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/app/components/mainLayout';
import { UserInterface } from '../../../../interface/user';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React from 'react';
dayjs.extend(utc);

interface Slot {
  ID: string
  time: string;
  status: string;
}
interface dataBookingFromAPI {
  desired_booking_date: string;
  start_Time: string
  end_Time: string
  booking_status: string;
}

type Slots = Record<string, Slot[]>;

const Booking: React.FC = () => {
  // const [fieldName, setFieldName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymantPageOpen, setIsPaymantPageOpen] = useState(false);
  const [isReveiwOpen, setIsReveiwOpen] = useState(false);
  const [feildDataName, setFeildDataName] = useState<string>('');

  const [currentStartDate, setCurrentStartDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [slots, setSlots] = useState<Slots>({});
  const [selectedSlots, setSelectedSlots] = useState<{ ID: string; date: string; time: string }[]>([]);
  const [dataBooking, setDataBooking] = useState<dataBookingFromAPI[]>([]);

  const searchParams = useSearchParams()
  const IDF = Number(searchParams.get('val'));
  const [IDUSER, setIDUSER] = useState(0);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dataBanking, setDataBanking] = useState([])
  const [selectedImage, setSelectedImage] = useState<"path_image_acc" | "path_image_Prom">('path_image_acc');
  const [previewImgBanking, setPreviewImgBanking] = useState("");

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [dataforReveiw, setDataForReveiw] = useState({})

  const { data, status } = useSession();
  const userData = data as UserInterface;
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      alert("กรุณาเข้าสู่ระบบก่อนค่ะ !!");
      router.push('/pages/user/AAA/login');

    } else if (status === 'authenticated' && data) {
      setIDUSER(Number(userData.user.id))
    }
  }, [data, status, router, userData.user.id]);

  useEffect(() => {
    const fetchBookings = async (field_ID: number) => {
      try {
        const response = await axios.get(`/api/booking/dataBooking?field_ID=${field_ID}`);
        const responseNameField = await axios.post(`/api/booking`);       //D:\Coding U-sport\project_usport\app\api\booking\datafieldAPI\route.ts
        if (responseNameField.status === 200) {
          const dataFromApi = responseNameField.data;
          console.log(dataFromApi)
          setFeildDataName(dataFromApi.find((item: any) => item.field_ID === field_ID)?.field_name || '');
        }
        const data = response.data;
        // console.log(data);
        // if (data && data[0] && data[0].fields) {
        //   setFieldName(data[0].fields.field_name); // ตั้งค่า field_name จากข้อมูลใน API
        // }

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
      } catch (error) {
        console.error("Error fetching bookings:", error);
      };
    };
    fetchBookings(IDF);

  }, [IDF]);

  useEffect(() => {
    const data = {
      field_ID: IDF,
      user_ID: IDUSER,
      rating: rating,
      comment: comment,
    }
    setDataForReveiw(data);
  }, [rating, comment, IDF, IDUSER])

  useEffect(() => {
    const generateWeekSlots = (startDate: string, dataBooking: dataBookingFromAPI[]): Slots => {
      const slots: Slots = {};

      for (let i = 0; i < 7; i++) {
        const date = dayjs(startDate).add(i, 'day').format('YYYY-MM-DD');  // วันที่ของ slot แต่ละวัน
        slots[date] = Array.from({ length: 15 }, (_, index) => {
          const STAhour = 9 + index;
          const ENDhour = 10 + index;
          const time = `${STAhour}:00 - ${ENDhour}:00`;
          let status = 'ว่าง';

          for (let j = 0; j < dataBooking.length; j++) {
            const booking = dataBooking[j];
            const bookingDate = booking.desired_booking_date;
            const str = parseInt(booking.start_Time);
            const end = parseInt(booking.end_Time);
            if (bookingDate === date) {
              if (STAhour >= str && STAhour < end) {
                status = booking.booking_status;  // เปลี่ยนสถานะตามข้อมูลการจองจาก API
                break;
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
    if (status === 'booked') return;
    const isSelected = selectedSlots.find((slot) => slot.date === date && slot.time === time);
    if (isSelected) {                                                                                                 //ถ้ามีข้อมูลในอาเรย์            
      setSelectedSlots(selectedSlots.filter((slot) => !(slot.date === date && slot.time === time)));                  //ทำการลบข้อมูลออกจากอาเรย์ 
    } else if (isSelected == undefined || selectedSlots.length === 0) {                                                 //ถ้าไม่มี หรือว่า อาเรย์ว่างเปล่า
      setSelectedSlots([...selectedSlots, { ID, date, time }]);                                                           //ทำการ add ข้อมูลเข้าไปในอาเรย์
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
        console.log(error);
      }
    }
    fetchPrice();
    // console.log(price1hForPeriod1);
    // console.log(price1hForPeriod2);
    // console.log(price2hForPeriod1);
    // console.log(price2hForPeriod2);
    //console.log(dataBanking)
  }, [IDF, price1hForPeriod1])


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

        // Process consecutive bookings
        consecutive.map((e, index) => {
          const lastIndex = e.details.length - 1;
          const consecutiveData = {
            user_ID: IDUSER,
            field_ID: IDF,  // field_ID ที่เกี่ยวข้อง
            booking_date: dayjs.utc().toDate(),  // แปลงเป็น DateTime
            desired_booking_date: dayjs.utc(slot.date).toDate(),  // แปลงเป็น DateTime
            Price: consecutive[index].price,
            booking_status: "รอการตรวจสอบ",  // ตั้งสถานะการจองเป็น inspecting หรือสถานะอื่นๆ
            end_Time: dayjs.utc(`${slot.date} ${e.details[lastIndex].value.split(" - ")[1]}`, 'YYYY-MM-DD HH:mm:ss').toDate(),
            start_Time: dayjs.utc(`${slot.date} ${e.details[0].value.split(" - ")[0]}`, 'YYYY-MM-DD HH:mm:ss').toDate(),  // เวลาการเริ่มต้น
          };
          newDataForSend.push(consecutiveData); // Add consecutive booking to newDataForSend
          acc.push({ date: slot.date, time: timesForDate, detalis: consecutiveData });
        });
        // Process non-consecutive bookings
        nonConsecutive.map((e, index) => {
          const nonConsecutiveData = {
            user_ID: IDUSER,
            field_ID: IDF,  // field_ID ที่เกี่ยวข้อง
            booking_date: dayjs.utc().toDate(),  // แปลงเป็น DateTime
            desired_booking_date: dayjs.utc(slot.date).toDate(),  // แปลงเป็น DateTime
            Price: nonConsecutive[index].price,
            booking_status: "รอการตรวจสอบ",  // ตั้งสถานะการจองเป็น inspecting หรือสถานะอื่นๆ
            end_Time: dayjs.utc(`${slot.date} ${e.details[0].value.split(" - ")[1]}`, 'YYYY-MM-DD HH:mm:ss').toDate(),  // เวลาสิ้นสุด เช่น เพิ่มเวลาอีก 1 ชั่วโมง
            start_Time: dayjs.utc(`${slot.date} ${e.details[0].value.split(" - ")[0]}`, 'YYYY-MM-DD HH:mm:ss').toDate(),
          };
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
    //console.log("วัน",dateSeparate);  
    //console.log(" ข้อมูลในArray",dataForSend) 
    //console.log("ข้อมูลจากDBMS",dataBooking);
    //console.log(dataBooking);
    //console.log(slots);
    console.log(dataForSend)
  }, [dateSeparate, dataForSend, slots, dataBooking]);

  const [keepOrderID, setKeepOrderID] = useState();

  const sendBookingToAPI = async (bookingData: any[]) => {
    // console.log(bookingData);
    try {
      let keepOrderIDthisLocal;
      if (totalPriceBooking > 0) {
        const dataForcreateOrder = {
          totalprice: totalPriceBooking,
          payment_confirmation: 'n/a',
          emp_ID: 1
        }
        const orderResponse = await axios.post('/api/booking/dataOrder', dataForcreateOrder, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        keepOrderIDthisLocal = orderResponse.data;
        setKeepOrderID(orderResponse.data);
        console.log("ไอดีออเดอร์", keepOrderID)
      }

      if (keepOrderIDthisLocal) {
        const updatedBookingData = bookingData.map(booking => ({
          ...booking,
          order_ID: keepOrderIDthisLocal,  // เพิ่ม oder_id ที่ได้รับจากการสร้าง order
        }));
        console.log(updatedBookingData);

        const response = await axios.post('/api/booking/dataBooking', updatedBookingData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log(response);
        closeModal();
        openPayment();
        //refreshPage();
      } else {
        console.log("เกิดข้อผิดพลาดดดดดนะจ๊ะ");
      }

    } catch (error) {

      if (axios.isAxiosError(error)) {

        console.error('Axios error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'An error occurred while sending booking data.');
      } else {

        console.error('Unexpected error:', error);
        throw new Error('An unexpected error occurred.');
      }
    }
  };


  if (!slots[currentStartDate]) {
    return <div>Loading...</div>; // Show a loading indicator during hydration
  }

  const handleGoBack = () => {
    window.history.back();
  };

  const handleEditClick = () => {
    setSelectedSlots([]);
    setDateseperate([]);
    setDataForSend([]);
    setTotalPriceBooking(0);
    setIsModalOpen(false);
  }

  const handleConfirmBooking = () => {
    handleProcessingBooking();
    setIsModalOpen(true);
    console.log('หน้าต่างเปิด')
  };

  const closeModal = () => {
    setSelectedSlots([]);
    setDateseperate([]);
    setDataForSend([]);
    setTotalPriceBooking(0);
    setIsModalOpen(false);
  };

  const openPayment = () => {
    setIsPaymantPageOpen(true);
    fetchAccountBankData();
  };

  const closePayment = () => {
    setIsPaymantPageOpen(false);
    reveiwOpen();
  };


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // ตรวจสอบประเภทไฟล์
      if (!file.type.startsWith('image/')) {
        alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
        return;
      }

      // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("ไฟล์ต้องมีขนาดไม่เกิน 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      alert("กรุณาเลือกไฟล์ก่อน");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // ส่งข้อมูลไปยัง API
      const response = await fetch(`/api/booking/uploadPayment?order_ID=${keepOrderID}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("อัปโหลดสลิปสำเร็จแล้ว โปรดติดตามสถานะการจอง");
        console.log("ไฟล์ถูกบันทึกที่:", result.filePath);
        closePayment();
        reveiwOpen();
      } else {
        alert("อัปโหลดไฟล์ล้มเหลว!");
        return;
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
    }
  };

  const fetchAccountBankData = async () => {
    try {
      const response = await axios.get('/api/booking/uploadPayment');
      const getdata = response.data;
      console.log(getdata);
      setDataBanking(getdata);
      if (getdata && getdata.length > 0) {
        setPreviewImgBanking(getdata[0].path_image_acc);
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    }
  };

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPath = event.target.value as "path_image_acc" | "path_image_Prom";
    setSelectedImage(selectedPath);
    if (dataBanking.length > 0) {
      const selectedData = dataBanking[0]; // สมมติว่าเลือกแค่ตัวแรก
      setPreviewImgBanking(selectedData[selectedPath]); // ตั้งค่า previewImgBanking ตาม path ที่เลือก
    }
  };

  const reveiwOpen = () => {
    setIsReveiwOpen(true)
  }
  const handleRatingChange = (rating: number) => {
    setRating(rating);
  };
  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };
  const handleSubmitReveiw = async () => {
    try {
      if (rating === 0) {
        alert('โปรให้คะแนนรีวิวสนามด้วยค่ะ');
        return;
      } else {
        const response = await axios.post('/api/booking/reviewField', dataforReveiw);
        if (response.status === 200) {
          alert("ขอบคุณสำหรับการให้คะแนนและข้อคิดเห็นค่ะ")
          closReveiw();
        } else {
          alert("เกิดข้อผิดพลาดค่ะ")
          return;
        }
        console.log(response)
      }
    } catch (error: any) {
      alert("เกิดข้อผิดพลาดค่ะ")
      console.log("error massege :", error)
    }
  };

  const closReveiw = () => {
    setRating(0)
    setComment('')
    setIsReveiwOpen(false)
    window.location.reload();
  }

  const star = [];
  for (let i = 0; i < 5; i++) {
    const value = i + 1
    star.push(
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        className={`h-10 w-10 hover:text-yellow-700 ${value <= rating ? 'text-yellow-500' : 'text-gray-500'} `}   //booking.bookings?.[0].booking_status === 'booked'?'text-gray-400 cursor-not-allowed pointer-events-none' :'text-red-500'
        onClick={() => handleRatingChange(value)}
      />
    )
  }

  return (
    <MainLayout>
      <div className="w-[1500px] p-8 mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex">
            <h1 className="text-2xl font-bold mb-4 text-white">ชื่อสนาม : </h1><span className="text-2xl text-white ml-2">{feildDataName}</span>
          </div>
          <div className="flex justify-end items-center mb-4 space-x-4">
            {/* <div>
                 {fieldName}
              </div> */}
            <div className="flex items-center text-white">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
              <span>ว่าง</span>
            </div>
            <div className="flex items-center text-white">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
              <span>รอการตรวจสอบ</span>
            </div>
            <div className="flex items-center text-white">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
              <span>ไม่ว่าง</span>
            </div>
            <input
              type="date"
              value={currentStartDate}
              onChange={(e) => handleDateSearch(e.target.value)}
              className="p-2 border rounded ml-4"
            />
          </div>
        </div>

        <div className="overflow-x-auto w-full max-w-full border-[10px]">
          <table className="table-auto w-full text-center border-collapse border-gray-300 ">
            <thead>
              <tr>
                <th className="border border-gray-300 text-white min-w-[85px] h-[60px]">DATE</th>
                {slots[currentStartDate]?.map((_, index) => {
                  const time = slots[currentStartDate][index].time;

                  return (
                    <th key={time} className="border border-gray-300 text-white min-w-[110px] h-[60px]">
                      {time}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {Object.keys(slots).map((date) => (
                <tr key={date}>
                  <td className="font-bold border border-gray-300 text-white min-w-[115px] h-[60px]">
                    {dayjs(date).format('DD MMM YYYY')}
                  </td>
                  {slots[date]?.map((slot) => {
                    const currenttime = parseInt(dayjs().format('HH'));
                    const slotTime = parseInt(slot.ID) + 8;
                    return (
                      <td
                        key={`${slot.time}`}
                        className={`border border-gray-300 cursor-pointer 
                                                    ${(dayjs().isSame(date, 'day') &&
                            (slot.time.includes("9:00 - 10:00") ||
                              slot.time.includes("10:00 - 11:00") ||
                              slot.time.includes("11:00 - 12:00") ||
                              slot.time.includes("12:00 - 13:00") ||
                              slotTime <= currenttime
                            )
                          ) || dayjs().isAfter(date, 'day')
                            ? 'bg-gray-500 cursor-not-allowed'  // ถ้าเป็นเวลา 9:00 - 13:00 ของวันนี้ ให้เป็นสีเทา 
                            : slot.status === 'จองสำเร็จ'
                              ? 'bg-red-500 cursor-not-allowed'
                              : slot.status === 'รอการตรวจสอบ'
                                ? 'bg-yellow-500 cursor-not-allowed'
                                : selectedSlots.find((selectedSlot) => selectedSlot.time === slot.time && selectedSlot.date === date)
                                  ? 'bg-blue-500'
                                  : slot.status === 'ว่าง'
                                    ? 'bg-green-500' : 'bg-green-500'
                          }
                                                `}
                        onClick={() => {
                          handleSlotClick(slot.ID, date, slot.time, slot.status);  // ทำการคลิกถ้าเงื่อนไขไม่ตรง     
                        }
                        }
                      >
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-white shadow rounded">
          <h3 className="text-lg font-bold mt-2">Total Price: {totalPriceBooking} บาท &nbsp;&nbsp;&nbsp;&nbsp;
            <button className="mr-2 font-bold bg-blue-400 text-black rounded hover:bg-gray-700 w-40"
              onClick={handleProcessingBooking}> ตรวจสอบราคา </button>
          </h3>

          <div className="flex justify-between mt-4">
            <button
              onClick={handleGoBack}
              className="w-full mr-2 p-3 font-bold bg-gray-500 text-black rounded hover:bg-gray-700"
            >
              ย้อนกลับ
            </button>
            <button
              className="w-full mr-2 p-3 font-bold bg-yellow-300 text-black rounded hover:bg-gray-700"
              onClick={handleEditClick}
            >
              แก้ไข
            </button>
            <button
              onClick={handleConfirmBooking}
              className="w-full ml-2 p-3 font-bold bg-green-500 text-black rounded hover:bg-gray-700"
            >
              ยืนยันการจอง
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">ยืนยันการจอง</h2>
            <p className="mb-4">คุณต้องการยืนยันการจองเวลาเหล่านี้หรือไม่?</p>
            <ul className="mb-4">
              {dataForSend.map((slot, index) => (
                <li key={index} className="text-gray-700">
                  รายการที่ {index + 1 + ' : '}
                  {dayjs.utc(slot.desired_booking_date).format('DD/MM/YYYY') + '  '}
                  {dayjs.utc(slot.start_Time).format('HH:mm') + ' - '}
                  {dayjs.utc(slot.end_Time).format('HH:mm')}
                </li>
              )
              )
              }
              {totalPriceBooking}
            </ul>
            <div className="flex justify-end space-x-4">
              <button onClick={() => sendBookingToAPI(dataForSend)}     //()=>sendBookingToAPI(dataForSend)
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                ยืนยัน
              </button>
              <button onClick={closeModal} className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {isPaymantPageOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-[800px] w-full max-h-[100vh] overflow-y-auto" >
            <h2 className="text-xl font-semibold mb-4">ชำระเงิน</h2>
            <p className="mb-4">ชำระเงิน และอัปโหลดหลักฐานการชำระเงิน</p>
            <p className="mb-4 text-red-500">**กรุณาชำเงินเงินภายใน 15 นาที**</p>
            <div className="flex flex-row">
              <div>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="greeting"
                    value="path_image_acc"
                    checked={selectedImage === "path_image_acc"}
                    onChange={handleRadioChange}
                    className="form-radio h-5 w-5 text-blue-500"
                  />
                  <span className="ml-2">บัญชีธนาคาร</span>
                </label>
              </div>
              <div>
                <label className="ml-5 inline-flex items-center">
                  <input
                    type="radio"
                    name="greeting"
                    value="path_image_Prom"
                    checked={selectedImage === "path_image_Prom"}
                    onChange={handleRadioChange}
                    className="form-radio h-5 w-5 text-green-500"
                  />
                  <span className="ml-2">คิวอาร์โค้ด</span>
                </label>
              </div>
            </div>

            <div className="flex justify-center items-center mt-4">

              <img src={previewImgBanking ? previewImgBanking : undefined} alt="Uploaded Payment" className="mt-4 mb-4 max-w-full h-auto" />
            </div>
            <input
              className="mb-[15px]"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            <div className="flex justify-end space-x-4">
              <button onClick={handleSubmit}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                ยืนยันการชำระเงิน
              </button>
              <button onClick={closePayment} className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600">
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
      {isReveiwOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-2xl font-semibold mb-4">รีวิวสนาม</h2>

            {/* Rating Input */}
            <label className="block text-sm font-medium text-gray-700">คะแนน (1-5) :</label>
            <div className="mb-4 mt-2 flex flex-row justify-between ">
              {
                star
              }
            </div>

            {/* Comment Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">ข้อคิดเห็นเพิ่มเติม :</label>
              <textarea
                value={comment}
                onChange={handleCommentChange}
                rows={4}
                className="mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={closReveiw}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                ปิด
              </button>
              <button
                onClick={handleSubmitReveiw}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                ส่งรีวิว
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
export default Booking;
