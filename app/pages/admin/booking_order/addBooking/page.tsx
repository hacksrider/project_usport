'use client';

import React, { useState, useEffect ,FormEvent} from 'react';
import axios from "axios";
import { useRouter } from 'next/navigation';
import { faSearch  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//import { useSearchParams } from 'next/navigation';
// import MainLayout from '@/app/components/mainLayout';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import Index from '@/app/page';
import { join } from 'path';

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

interface Field {     
    field_ID: number;
    field_name: string;
    status: string;
}

type Slots = Record<string, Slot[]>;

export default function AddBooking(){
    const [isModalOpenA, setIsModalOpenA] = useState(false);
    const [isModalOpenB, setIsModalOpenB] = useState(false);

    const [isTableOpen, setIsTableOpen] = useState(false);
    const [isPaymantPageOpen, setIsPaymantPageOpen] = useState(false);
    const [selectedForm, setSelectedForm] = useState('A');
    const [currentStartDate, setCurrentStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [slots, setSlots] = useState<Slots>({});
    const [selectedSlots, setSelectedSlots] = useState<{ID: string; date: string; time: string }[]>([]);
    const [dataBooking, setDataBooking] = useState<dataBookingFromAPI[]>([]);
    const [feildData, setFeildData] = useState<Field[]>([]); 
    const [externalUserData, setExternalUserData] = useState<Record<string, any>>({});
    const [IDF,setIDF] = useState(0)

    const [userID,setUserID] = useState(0)

    const route = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewImgBanking, setPreviewImgBanking] = useState<string | null>(null);
  

    const fetchBookings = async (field_ID: number) => {
        try {
                setIDF(field_ID)
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
            setSelectedSlots([...selectedSlots, {ID ,date,time }]);   
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
              user_ID: userID,
              field_ID: IDF,  // field_ID ที่เกี่ยวข้อง
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
              user_ID: userID,
              field_ID: IDF,  // field_ID ที่เกี่ยวข้อง
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

const handleChengUserID = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;  // รับค่าจาก input
  console.log(value);  // ใช้ค่าจาก input ตามต้องการ
  setUserID(Number(value))
};

const handleExternalName = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
    setExternalUserData(prevData => ({
      ...prevData,
      [name]: value,
    }));
};

const handleExternalLastName = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setExternalUserData(prevData => ({
    ...prevData,
    [name]: value,
  }));
};

const handleExternalTel = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setExternalUserData(prevData => ({
    ...prevData,
    [name]: value,
  }));
};

// useEffect(()=>{
//   console.log(externalUserData)
// },[externalUserData])

useEffect(() => {
  console.log(dataForSend);
    }, [dateSeparate,dataForSend,slots,dataBooking,selectedSlots,]);   


const checkHasUserID = async (userid : number ,event: React.FormEvent) => {
  
  event.preventDefault();
         console.log(userid)
        const response = await fetch(`/api/user/${userid}`);
        const data = await response.json();
          if (response.ok) {
            console.log('User data:', data);
            openModalB();
          } else {
            alert(`ไม่มี user ID ${userid} นี้ในระบบ`)
            closeModalB();
            return;
          }
    };

const createExternalUser = async (newUserData: Record<string, any>) => {
      try {
        const response = await axios.post("/api/booking/updateDataBooking", newUserData);
          if (response.status === 200 || response.status === 201) {  // เช็คว่า HTTP status เป็น 200 หรือ 201 (ที่สำเร็จ)
              const data = response.data;
              console.log('New User ID:', data.user_ID);
              return data.user_ID
              //return data.user_ID;
                // const updatedNewUserId = dataForSend.map(booking => ({
                //   ...booking,
                //   user_ID: data.user_ID,  // เพิ่ม oder_id ที่ได้รับจากการสร้าง order
                // }));
              //console.log(updatedNewUserId);
          } else {
              alert("เกิดข้อผิดพลาดเกี่ยวกับการบันทึกข้อมูลผู้จอง !!!");
              return ;
          }
      } catch (error) {
          alert("เกิดข้อผิดพลาดเกี่ยวกับการบันทึกข้อมูลผู้จอง !!!");
          console.log("error:", error);  // แสดงข้อมูล error ใน console
      }
};
const[keepOrderID,setKeepOrderID] = useState();

const sendBookingToAPI = async (bookingData: any[], key :string) => {
   try {
      //let bufferData =bookingData ;

      if (bookingData.length === 0 ) {
        alert("กรุณาเลือกเวลาด้วยค่ะ !!!!");
        return; // ออกจากฟังก์ชันทันที
      } else {
        if (key === 'external') {
          const newuser = await createExternalUser(externalUserData);  // รอให้สร้างผู้ใช้เสร็จก่อน
          console.log("เข้าexternal");
          bookingData = bookingData.map(booking => ({
            ...booking,
            user_ID: newuser,  // เพิ่ม user_ID ที่ได้รับจากการสร้างผู้ใช้
          }));
      }
      }
      console.log("ผ่าน external มาแล้ว")
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
      }
      
      if (keepOrderIDthisLocal) {
        const updatedBookingData = bookingData.map(booking => ({
          ...booking,
          order_ID: keepOrderIDthisLocal,  // เพิ่ม oder_id ที่ได้รับจากการสร้าง order
        }));
        console.log(updatedBookingData);
        const response = await axios.post('/api/booking/dataBooking',updatedBookingData , {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        response.status === 200? alert("จองสนามสำเร็จแล้ว") : alert("จองสนามสำเร็จแล้ว") 
        console.log("data :",response)
        closeModalA();
        closeModalB();
        refrechBooking();
    }else {
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

const handleEditClick = ()=>{
  setExternalUserData([]);
  setSelectedSlots([]);
  setDateseperate([]);
  setDataForSend([]);
  setUserID(0);
  setTotalPriceBooking(0);
  setIsModalOpenA(false);
  setIsModalOpenB(false);
}


const openModalA = (event: React.FormEvent) => {
   event.preventDefault();
      if (selectedSlots.length === 0) {
          alert("กรุณาเลือกเวลาด้วยค่ะ !!!!");
          handleEditClick();
          return ;
      }else{
        handleProcessingBooking();
      }
      setIsModalOpenA(true)
  };

  const closeModalA = () => {
    setSelectedSlots([]);
    setDateseperate([]);
    setDataForSend([]);
    setTotalPriceBooking(0);
    setIsModalOpenA(false);
  };

  const openModalB = () => {
    handleProcessingBooking();
    setIsModalOpenB(true);
    console.log('หน้าต่างเปิด')
  };

  const closeModalB = () => {
    setSelectedSlots([]);
    setDateseperate([]);
    setDataForSend([]);
    setTotalPriceBooking(0);
    setIsModalOpenB(false);
    setSelectedForm('B')
  };

  const openPayment = () => {
    setIsPaymantPageOpen(true);
    fetchAccountBankData();
  };

  const closePayment = () => {
    setIsPaymantPageOpen(false);
    refrechBooking()
  };

  const refrechBooking = async ()=>{
    await fetchBookings(IDF);
  }


  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0];
  //   if (file) {
  //     // ตรวจสอบประเภทไฟล์
  //     if (!file.type.startsWith('image/')) {
  //       alert("กรุณาเลือกไฟล์รูปภาพเท่านั้น");
  //       return;
  //     }
  
  //     // ตรวจสอบขนาดไฟล์ (ไม่เกิน 5MB)
  //     if (file.size > 5 * 1024 * 1024) {
  //       alert("ไฟล์ต้องมีขนาดไม่เกิน 5MB");
  //       return;
  //     }
  //     setSelectedFile(file);
  //   }
  // };

  // const handleSubmit = async () => {
  //   if (!selectedFile) {
  //     alert("กรุณาเลือกไฟล์ก่อน");
  //     return;
  //   }
  
  //   const formData = new FormData();
  //   formData.append('file', selectedFile);
  
  //   try {
  //     // ส่งข้อมูลไปยัง API
  //     const response = await fetch(`/api/booking/uploadPayment?order_ID=${keepOrderID}`, {
  //       method: 'POST',
  //       body: formData,
  //     });
  
  //     if (response.ok) {
  //       const result = await response.json();
  //       alert("บันทึกข้อมูลสำเร็จ");
  //       console.log("ไฟล์ถูกบันทึกที่:", result.filePath);
  //       closePayment();
  //     } else {
  //       alert("บันทึกข้อมูลล้มเหลว!");
  //     }
  //   } catch (error) {
  //     console.error("เกิดข้อผิดพลาด:", error);
  //     alert("เกิดข้อผิดพลาดในการอัปโหลด");
  //   }
  // };

  const fetchAccountBankData = async () => {
    try {
          const response = await axios.get('/api/booking/uploadPayment');
          console.log(response);
          setPreviewImgBanking(response.data);
    } catch (error) {
      console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
    }
  };

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedForm(event.target.value); // เปลี่ยนสถานะตามการเลือก
  };


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
                    onClick={()=>fetchBookings(field.field_ID)}
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
                    return (
                      <td
                        key={`${slot.time}`}
                        className={`border border-gray-800 cursor-pointer 
                          ${
                            dayjs().isSame(date, 'day') &&
                            (slot.time.includes('9:00 - 10:00') ||
                              slot.time.includes('10:00 - 11:00') ||
                              slot.time.includes('11:00 - 12:00') ||
                              slot.time.includes('12:00 - 13:00'))
                              ? 'bg-gray-500 cursor-not-allowed'
                              : slot.status === 'booked'
                              ? 'bg-red-500 cursor-not-allowed'
                              : slot.status === 'inspecting'
                              ? 'bg-yellow-500 cursor-not-allowed'
                              : selectedSlots.find(
                                  (selectedSlot) =>
                                    selectedSlot.time === slot.time && selectedSlot.date === date
                                )
                              ? 'bg-blue-500'
                              : slot.status === 'available'
                              ? 'bg-green-500'
                              : ''
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
          <div className="  mt-4 p-4 bg-gray-200 shadow rounded border border-[2px] border-gray-500">
                <h3 className="text-lg font-bold mt-2">
                Total Price: {totalPriceBooking} บาท &nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                        className="mr-2 font-bold bg-blue-400 text-black rounded hover:bg-gray-700 w-40"
                        onClick={handleProcessingBooking}
                    >
                        ตรวจสอบราคา
                    </button>
                </h3>

                

                <div className="flex justify-center">
                  <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">ข้อมูลผู้จอง</h2>
                    
                    {/* Radio Buttons */}
                    <div className="mb-4 flex justify-around">
                      <div>
                        <input
                          type="radio"
                          id="formA"
                          name="formSelect"
                          value="A"
                          checked={selectedForm === 'A'}
                          onChange={handleFormChange}
                        />
                        <label htmlFor="formA" className="ml-2">ลูกค้าภายนอก</label>
                      </div>
                      <div>
                        <input
                          type="radio"
                          id="formB"
                          name="formSelect"
                          value="B"
                          checked={selectedForm === 'B'}
                          onChange={handleFormChange}
                        />
                        <label htmlFor="formB" className="ml-2">ลูกค้าในระบบ</label>
                      </div>
                    </div>
                    
                    {/* Form A */}
                    {selectedForm === 'A' && (
                      <form className="mb-6" onSubmit={(e)=>openModalA(e)}>
                        <div className="mb-4">
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                          <input
                            type="text"
                            id="firstName"
                            name="user_name"
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your first name"
                            required
                            onChange={handleExternalName}
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                          <input
                            type="text"
                            id="lastName"
                            name="user_lastname"
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your last name"
                            required
                            onChange={handleExternalLastName}
                          />
                        </div>

                        <div className="mb-4">
                          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                          <input
                            type="tel"
                            id="phone"
                            name="user_tel"
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder='Enter your phone number'
                            pattern="^[0-9]{10}$"
                            title="Phone number must be exactly 10 digits"
                            required
                            onChange={handleExternalTel}
                          />
                        </div>

                        <div className="flex justify-around mt-4">
                          <button
                            type="reset"
                            className="w-[500px] mr-2 p-3 font-bold bg-yellow-300 text-black rounded hover:bg-gray-700"
                            // handleEditClick 
                            onClick={handleEditClick}
                          >
                            แก้ไข
                          </button>
                          <button
                            type="submit"
                            className="w-[500px] ml-2 p-3 font-bold bg-green-500 text-black rounded hover:bg-gray-700"
                          >
                            ยืนยันการจอง
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Form B */}
                    {selectedForm === 'B' && (
                      <form className="mb-6 " onSubmit={(e)=>checkHasUserID(userID,e)}>
                        <div className="mb-4">
                          <label htmlFor="firstNameB" className="block text-sm font-medium text-gray-700">User ID</label>
                          <input
                            type="text"
                            id="firstNameB"
                            name="firstNameB"
                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your first name"
                            onChange={handleChengUserID}
                          />
                        </div>

                        <div className="flex justify-around mt-4">
                          <button
                              type="reset"
                              className="w-[500px] mr-2 p-3 font-bold bg-yellow-300 text-black rounded hover:bg-gray-700"
                              onClick={handleEditClick}
                            >
                              แก้ไข
                           </button>
                          <button
                              type="submit"
                              className="w-[500px] ml-2 p-3 font-bold bg-green-500 text-black rounded hover:bg-gray-700"
                            >
                              ยืนยันการจอง
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
            </div>
        </div>
        
      )}

      {isModalOpenA && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-semibold mb-4">ยืนยันการจอง</h2>
            <p className="mb-4">คุณต้องการยืนยันการจองเวลาเหล่านี้หรือไม่?</p>
            <ul className="mb-4">
              {dataForSend.map((slot, index) => (
                <li key={index} className="text-gray-700">
                  รายการที่ {index+1+' :'} {dayjs(slot.desired_booking_date).format('DD-MM-YYYY')} {slot.start_Time.toString().split(' ')[4].split(':').slice(0,2).join(':')} - {slot.end_Time.toString().split(' ')[4].split(':').slice(0,2).join(':')}
                </li>
              ))}
              {totalPriceBooking}
            </ul>
            <div className="flex justify-end space-x-4">
              <button
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={()=>sendBookingToAPI(dataForSend,'external')}
              >
                ยืนยัน
              </button>
              <button
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={closeModalA}
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpenB && (
              <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg max-w-md w-full">
                  <h2 className="text-xl font-semibold mb-4">ยืนยันการจอง</h2>
                  <p className="mb-4">คุณต้องการยืนยันการจองเวลาเหล่านี้หรือไม่?</p>
                  <ul className="mb-4">
                    {dataForSend.map((slot, index) => (
                      <li key={index} className="text-gray-700">
                         รายการที่ {index+1+' :'} {dayjs(slot.desired_booking_date).format('DD-MM-YYYY')} {slot.start_Time.toString().split(' ')[4].split(':').slice(0,2).join(':')} - {slot.end_Time.toString().split(' ')[4].split(':').slice(0,2).join(':')}
                      </li>
                    ))}
                     ราคารวม {totalPriceBooking}
                  </ul>
                  <div className="flex justify-end space-x-4">
                    <button
                      className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={()=>sendBookingToAPI(dataForSend,'internal')}
                    >
                      ยืนยัน
                    </button>
                    <button
                      className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={closeModalB}
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              </div>
            )}
  
      {/* {isPaymantPageOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-[800px] w-full max-h-[100vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">ชำระเงิน</h2>
            <p className="mb-4">ชำระเงิน และอัปโหลดหลักฐานการชำระเงิน</p>
            <ul className="mb-4"></ul>
  
            <div className="flex justify-center items-center mt-4">
              <img
                src={previewImgBanking ? previewImgBanking : undefined}
                alt="Uploaded Payment"
                className="mt-4 max-w-full h-auto"
              />
            </div>
            <input
              className="mb-[15px]"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
  
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                ยืนยันการชำระเงิน
              </button>
              <button
                onClick={closePayment}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );

}