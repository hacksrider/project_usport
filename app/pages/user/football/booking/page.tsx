'use client';

import axios from "axios";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/app/components/mainLayout';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React from 'react';

dayjs.extend(utc);

interface Slot {
    ID :  string
    time: string;
    status: string ;                   //'available' เขียว | 'booked'แดง |'inspecting' เหลือง
}

interface dataBookingFromAPI{
  desired_booking_date: string;
  start_Time:string
  end_Time:string
  booking_status: string;
}

type Slots = Record<string, Slot[]>;


const Booking : React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPaymantPageOpen, setIsPaymantPageOpen] = useState(false);
    const [currentStartDate, setCurrentStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [slots, setSlots] = useState<Slots>({});
    const [selectedSlots, setSelectedSlots] = useState<{ID: string; date: string; time: string }[]>([]);
    const [dataBooking, setDataBooking] = useState<dataBookingFromAPI[]>([]);
    const searchParams = useSearchParams()
    const IDF = Number(searchParams.get('val'));
    const route = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImgBanking, setPreviewImgBanking] = useState<string | null>(null);
  
    useEffect(() => {
      const fetchBookings = async (field_ID: number) => {
          try {
              const response = await axios.get(`/api/booking/dataBooking?field_ID=${field_ID}`);
              const data = response.data;
              console.log(data);
              const updatedData = data.map((booking: dataBookingFromAPI) => {
                  const date = dayjs(booking.desired_booking_date).format('YYYY-MM-DD');
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
      
  }, []);  


  useEffect(() => {
    const generateWeekSlots = (startDate: string, dataBooking: dataBookingFromAPI[]): Slots => {
        const slots: Slots = {};

        for (let i = 0; i < 7; i++) {
            const date = dayjs(startDate).add(i, 'day').format('YYYY-MM-DD');  // วันที่ของ slot แต่ละวัน
            slots[date] = Array.from({ length: 15 }, (_, index) => {
                let STAhour = 9 + index;
                let ENDhour = 10 + index;
                if (ENDhour === 24) {
                    ENDhour = 0;
                }
                const time = `${STAhour}:00 - ${ENDhour}:00`;

                // เริ่มต้นสถานะเป็น 'available'
                let status = 'available';
                  
                
                for (let j = 0; j < dataBooking.length; j++) {
                    const booking = dataBooking[j];
                    const bookingDate = booking.desired_booking_date; 
                    const str = parseInt(booking.start_Time);
                    const end =parseInt(booking.end_Time);

                    
                    if (bookingDate === date) {
                          // console.log("เวลาเริ่ม",STAhour);
                          // console.log("เวลาเริ่มตัวเปรียบเทียบ",str);
                          // console.log("เวลาจบ",ENDhour);
                          // console.log("เวลาจบตัวเปรียบเทียบ",end);

                           if ( STAhour >= str && STAhour < end) {
                              //console.log("สามารถตรวจพบเวลาเริ่มต้นได้");
                              status = booking.booking_status;  // เปลี่ยนสถานะตามข้อมูลการจองจาก API
                             // console.log("ถูกต้อง",bookingDate);
                              break;  
                           }
                            //console.log("ไม่เข้าเงื่อนไข");
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

    const handleSlotClick = ( ID: string, date: string, time: string, status: string) => {
        if (status === 'booked') return;
        const isSelected = selectedSlots.find((slot) => slot.date === date && slot.time === time);
        if (isSelected) {                                                                                                 //ถ้ามีข้อมูลในอาเรย์            
            setSelectedSlots(selectedSlots.filter((slot) => !(slot.date === date && slot.time === time)));                  //ทำการลบข้อมูลออกจากอาเรย์ 
        } else if(isSelected == undefined || selectedSlots.length === 0) {                                                 //ถ้าไม่มี หรือว่า อาเรย์ว่างเปล่า
            setSelectedSlots([...selectedSlots, {ID ,date,time }]);                                                           //ทำการ add ข้อมูลเข้าไปในอาเรย์
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

    
    const pricePer1_1 = 800;
    const pricePer1_2 = 1000;
    const pricePer2_1 = 1200;
    const pricePer2_2 = 1500;
    
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
            const lastIndex = e.details.length - 1 ;
            const consecutiveData = {
              user_ID: 1,
              field_ID: 1,  // field_ID ที่เกี่ยวข้อง
              booking_date: dayjs().toDate(),  // แปลงเป็น DateTime
              desired_booking_date: dayjs(slot.date).toDate(),  // แปลงเป็น DateTime
              Price: consecutive[index].price,
              booking_status: "inspecting",  // ตั้งสถานะการจองเป็น inspecting หรือสถานะอื่นๆ
              end_Time: dayjs.utc(`${slot.date} ${e.details[lastIndex].value.split(" - ")[1]}`, 'YYYY-MM-DD HH:mm:ss').toDate(),
              start_Time: dayjs.utc(`${slot.date} ${e.details[0].value.split(" - ")[0]}`, 'YYYY-MM-DD HH:mm:ss').toDate(),  // เวลาการเริ่มต้น
            };
            newDataForSend.push(consecutiveData); // Add consecutive booking to newDataForSend
            acc.push({ date: slot.date, time: timesForDate, detalis: consecutiveData });
          });
          // Process non-consecutive bookings
          nonConsecutive.map((e, index) => {
            const nonConsecutiveData = {
              user_ID: 1,
              field_ID: 1,  // field_ID ที่เกี่ยวข้อง
              booking_date: dayjs().toDate(),  // แปลงเป็น DateTime
              desired_booking_date: dayjs(slot.date).toDate(),  // แปลงเป็น DateTime
              Price: nonConsecutive[index].price,
              booking_status: "inspecting",  // ตั้งสถานะการจองเป็น inspecting หรือสถานะอื่นๆ
              end_Time: dayjs.utc(slot.date).add(1, 'hour').toDate(),  // เวลาสิ้นสุด เช่น เพิ่มเวลาอีก 1 ชั่วโมง
              start_Time: dayjs.utc(slot.date).toDate(),  // เวลาการเริ่มต้นจาก slot
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
  ): { consecutive: { count: number, details: { ID: string, value: string }[],price:number }[], nonConsecutive: { count: number, details: { ID: string, value: string }[],price:number }[], totalPrice: number } {
    if (times.length === 0) return { consecutive: [], nonConsecutive: [], totalPrice: 0 };

   // const numberArray: number[] = times.map(item => Number(item.ID));
    let consecutive: { count: number, details: { ID: string, value : string}[], price:number }[] = [];
    let nonConsecutive: { count: number, details: { ID: string, value : string }[], price:number }[] = [];
    let tempConsecutive: { ID: string, value: string }[] = [];
  
    // ฟังก์ชันสำหรับคำนวณราคา
    const calculatePrice = (times: { ID: string, value: string }[]): number => {
        let totalPrice = 0;

        if (times.length === 1) {
            const time = times[0].value;
            const firstHour = parseInt(time.split(":")[0]); // แยกชั่วโมงจากเวลา (เช่น "10:00" -> 10)
            if (firstHour >= 9 && firstHour < 16) {
                totalPrice = pricePer1_1; // ใช้ = แทน ===
            }else if(firstHour >= 16 && firstHour < 24) {
                totalPrice = pricePer1_2; // ใช้ = แทน ===
            }
        } else {
            const quantityHour = times.length;
            const firstTime = times[0].value;
            const lastTime = times[times.length - 1].value;
            const firstHour = parseInt(firstTime.split(":")[0]);                                                                      // แยกชั่วโมงจากเวลา (เช่น "10:00" -> 10)
            const lastHour = parseInt(lastTime.split(" - ")[1].split(":")[0]);                                                        // แยกชั่วโมงจากเวลา (เช่น "10:00" -> 10)
            
                if (quantityHour === 2) {
                    if(firstHour >= 15 && firstHour <= 21){
                        totalPrice = pricePer2_2;                    console.log("AAAAAAA")
                    } else totalPrice = pricePer2_1;                 console.log("bbbbbbbb")
                }else{
                    const evenNum = Math.trunc(quantityHour / 2); 
                    const oddNum = quantityHour%2 ;                                                                                    
                    if (firstHour >= 9 && firstHour <=13 ) {                                                                           //1_1 = 800 
                        totalPrice = ( pricePer2_1 * evenNum ) + ( pricePer1_1 * oddNum ); console.log("1111111")                      //1_2 = 1000                                      
                    }else if(firstHour === 14 || firstHour === 21){                                                                    //2_1 = 1200
                        totalPrice = ( pricePer2_1 * evenNum ) + ( pricePer1_2 * oddNum ); console.log("2222222")                      //2_2 = 1500
                    }                                                                                                                                                                                                                                                                  
                    if (firstHour === 15 || firstHour === 20) {
                        totalPrice = ( pricePer2_2 * evenNum ) + ( pricePer1_1 * oddNum ); console.log("3333333")
                    }else if(firstHour >= 16 && lastHour < 22) {
                        totalPrice = ( pricePer2_2 * evenNum ) + ( pricePer1_2 * oddNum ); console.log("4444444")
                    }

                    // console.log(evenNum);
                    // console.log(oddNum);
                    // console.log("ราคานอกขอบเขต",totalPrice);
                }
            // console.log('จำนวนชั่วโมง',quantityHour);
            // console.log('เริ่ม',firstHour);
            // console.log('จบ',lastHour); 
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
        //console.log(dataForSend)
    }, [dateSeparate,dataForSend,slots,dataBooking]);   

const[keepOrderID,setKeepOrderID] = useState();

const sendBookingToAPI = async (bookingData: any[]) => {
  // console.log(bookingData);
   try {
    let keepOrderIDthisLocal ;
    if (totalPriceBooking > 0) {
      const dataForcreateOrder = {
        totalprice : totalPriceBooking,
        payment_confirmation :'n/a',
        emp_ID: 1
      }
      const orderResponse = await axios.post('/api/booking/dataOrder', dataForcreateOrder, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      keepOrderIDthisLocal = orderResponse.data;
      setKeepOrderID(orderResponse.data);
      console.log("ไอดีออเดอร์",keepOrderID)
    }
    
    if (keepOrderIDthisLocal) {
      const updatedBookingData = bookingData.map(booking => ({
        ...booking,
        order_ID: keepOrderIDthisLocal,  // เพิ่ม oder_id ที่ได้รับจากการสร้าง order
      }));
      console.log(updatedBookingData);

      const response = await axios.post('/api/booking/dataBooking',  updatedBookingData , {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      closeModal();
      openPayment();
      //refreshPage();
    }else{
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

const handleEditClick = ()=>{
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
    window.location.reload();
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
        alert("อัปโหลดไฟล์สำเร็จ!");
        console.log("ไฟล์ถูกบันทึกที่:", result.filePath);
        closePayment();
      } else {
        alert("อัปโหลดไฟล์ล้มเหลว!");
      }
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการอัปโหลด");
    }
  };

  const fetchAccountBankData = async () => {
    try {
          const response = await axios.get('/api/booking/uploadPayment');
          console.log(response);
          setPreviewImgBanking(response.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    }
  };


    return (
        <MainLayout>
            <div className="w-[1500px] p-8 mx-auto">
                <div className="flex justify-end items-center mb-4">
                    <input
                        type="date"
                        value={currentStartDate}
                        onChange={(e) => handleDateSearch(e.target.value)}
                        className="p-2 border rounded"
                    />
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
                                        return (
                                            <td
                                                key={`${slot.time}`}
                                                className={`border border-gray-300 cursor-pointer 
                                                    ${
                                                          dayjs().isSame(date,'day') && (
                                                            slot.time.includes("9:00 - 10:00")  ||
                                                            slot.time.includes("10:00 - 11:00") ||
                                                            slot.time.includes("11:00 - 12:00") ||
                                                            slot.time.includes("12:00 - 13:00") 
                                                          ) 
                                                        ? 'bg-gray-500 cursor-not-allowed'  // ถ้าเป็นเวลา 9:00 - 13:00 ของวันนี้ ให้เป็นสีเทา 
                                                        : slot.status === 'booked'
                                                        ? 'bg-red-500 cursor-not-allowed'
                                                        : slot.status === 'inspecting' 
                                                        ? 'bg-yellow-500 cursor-not-allowed' 
                                                        : selectedSlots.find((selectedSlot) => selectedSlot.time === slot.time && selectedSlot.date === date)
                                                        ? 'bg-blue-500'  
                                                        : slot.status === 'available' 
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
                      รายการที่ {index+1+' :'} {dayjs.utc(slot.desired_booking_date).format('DD-MM-YYYY')} {slot.start_Time.toString().split(' ')[4].split(':').slice(0,2).join(':')} - {slot.end_Time.toString().split(' ')[4].split(':').slice(0,2).join(':')}
                    </li>
                  )
                )
              }
              {totalPriceBooking}
            </ul>
            <div className="flex justify-end space-x-4">
              <button onClick={ ()=>sendBookingToAPI(dataForSend) }     //()=>sendBookingToAPI(dataForSend)
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
                  <ul className="mb-4">
                  {/* {    
                  
                  testaaaa.map((slot, index) => (
                      <li
                        key={index}
                        className={`p-4 rounded-lg my-2 ${colors[index % colors.length]} shadow-md`}
                      >
                        {dayjs(slot.date).format('DD-MM-YYYY')} {slot.time}
                      </li>
                    ))} */}
              </ul>
                    
              <div className="flex justify-center items-center mt-4">
              <img src={previewImgBanking? previewImgBanking : undefined } alt="Uploaded Payment" className="mt-4 max-w-full h-auto" />
              </div>
              <input
                  className="mb-[15px]"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {/* <button onClick={handleSubmit}>ส่งไฟล์</button> */}
                  
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
    </MainLayout>
  );
}
export default Booking;
