'use client';
import { useEffect, useState } from "react";
import MainLayout from "@/app/components/mainLayout";
import { useSession } from "next-auth/react";
import { UserInterface } from "@/app/interface/user";
import { BuyingService } from "@/app/interface/buyingExercise";
import React from "react";
import axios from "axios";
// import Image from "next/image";
// import { useSearchParams } from "next/navigation";

const statusOrderText = [
    "รอใช้บริการ",
    "กําลังใช้บริการ",
    "หมดอายุ",
]

const statusOrderColor = [
    "text-yellow-500",
    "text-blue-500",
    "text-red-500",
]

interface Booking {
    order_ID: number;
    totalprice: number;
    payment_confirmation: string;
    bookings: {
      booking_ID: number; // มี booking_ID แล้ว
      users: {
        user_ID:number
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

export default function PurchaseOrder() {
    const [buyingService, setBuyingService] = useState<BuyingService[]>([]);
    const [booking_Data, setBooking_Data] = useState<Booking[]>([]);
    // const [orders, setOrders] = useState<Orders[]>([]);
    // const order_ID = useSearchParams()?.get("order_ID");
    const [loading, setLoading] = useState(true);
    const { data, } = useSession();
    const userData = data as UserInterface;
    const user_ID = userData?.user?.id;

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isPaymantPageOpen, setIsPaymantPageOpen] = useState(false);
    const [previewImgBanking, setPreviewImgBanking] = useState<string | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    
    

    useEffect(() => {
        fetch(`/api/buyingexercise?user_ID=${user_ID}`)
            .then((res) => res.json())
            .then((data) => {
                setBuyingService(data.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [user_ID]);

    useEffect(() => {
       const fetchDataBooking = async()=>{
        try{
            const response = await axios.get('/api/booking', {
                params: { user_ID }
            });
            //console.log(response.data)
            setBooking_Data(response.data);
        }catch{
            console.log("เกิดข้อผิดพลาดในการลบข้อมูล")
        }
       }
       fetchDataBooking()
    }, [user_ID]);

    useEffect(()=>{
        console.log(booking_Data)
    },[booking_Data])

    const[keepOrderID,setKeepOrderID] = useState<number | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
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

      const openPayment = (orderID:number) => {
        setKeepOrderID(orderID);
        setIsPaymantPageOpen(true);
        fetchAccountBankData();
      };

      const closePayment = () => {
        setKeepOrderID(null);
        setIsPaymantPageOpen(false);
        window.location.reload();
      };

      const openDetail = (booking: any) => {
        console.log(booking);
        setSelectedBooking(booking);
        setIsDetailOpen(true);
      };

      const closeDetail = () => {
        setSelectedBooking(null);
        setIsDetailOpen(false);
      };

    const formatDateToThai = (dateString: string) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
        return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${date.getFullYear() + 543}`;
    };

    return (
        <MainLayout>
            <div className="mx-auto w-full max-w-[1200px] my-10">
                <h1 className="text-2xl font-semibold mb-5 text-white">คำสั่งซื้อของฉัน</h1>
                {loading ? (
                    <p>Loading orders...</p>
                ) : (
                    <div>
                        <div className="bg-white shadow-md rounded-lg p-5">
                        <h1 className="text-2xl font-semibold mb-5 text-black">บริการออกกำลังกาย</h1>
                            {buyingService.length === 0 ? (
                                <p>No orders found.</p>
                            ) : (
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100 text-center border border-b-2 border-gray-400">
                                            <th className="border p-2">No.</th>
                                            <th className="border p-2">ชื่อบริการ</th>
                                            <th className="border p-2">วันที่ซื้อบริการ</th>
                                            <th className="border p-2">จำนวน</th>
                                            <th className="border p-2">หน่วย</th>
                                            <th className="border p-2">ราคา (บาท)</th>
                                            <th className="border p-2">สถานะการใช้บริการ</th>
                                            <th className="border p-2">สถานะคำสั่งซื้อ</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {buyingService.map((order, i) => {console.log(order); 
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-expect-error
                                        return <React.Fragment key={i}>{order.orders.map((od, j) => {
                                            return(
                                                <tr key={j} className={"text-center " + (j == order.orders.length - 1 ? "border border-b-2 border-gray-400" : "")}>
                                                    {j == 0 ? <td rowSpan={order.orders.length} className="border p-2">{i + 1}</td> : ''}
                                                    <td className="border p-2">{od.service_name}</td>
                                                    <td className="border p-2">{formatDateToThai(order.buying_date)}</td>
                                                    <td className="border p-2">{od.amount_of_time}</td>
                                                    <td className="border p-2">{od.units}</td>
                                                    <td className="border p-2">{od.Price}</td>
                                                    <td className={"border p-2 " + statusOrderColor[od.status_order]}>{statusOrderText[od.status_order] || "error"}</td>
                                                    {j == 0 ? (order.buying_status ? <td rowSpan={order.orders.length} className="border p-2 text-green-500">ยืนยันแล้ว</td> : <td rowSpan={order.orders.length} className="border p-2 text-yellow-500">รอตรวจสอบ</td>) : ''}
                                                </tr>
                                            )
                                            
                                        })}</React.Fragment>
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        <div className="bg-white shadow-md rounded-lg p-5 mt-3">
                        {buyingService.length === 0 ? (
                            <p>No orders found.</p>
                        ) : (
                            <div>
                              <h1 className="text-2xl font-semibold mb-5 text-black">สนามฟุตบอล</h1>
                                <table className="w-full border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100 text-center border border-b-2 border-gray-400">
                                            <th className="border p-2">No.</th>
                                            <th className="border p-2">ชื่อสนาม</th>
                                            <th className="border p-2">วันที่ต้องการจอง</th>
                                            <th className="border p-2">เวลา</th>
                                            <th className="border p-2">ราคา (บาท)</th>
                                            <th className="border p-2">สถานะการใช้บริการ</th>
                                            <th className="border p-2">ส่งหลักฐานการชำระเงิน</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                    {booking_Data.map((items, index) => {
                                        const booking = items.bookings[0]; // ใช้ข้อมูลจากอินเด็กซ์แรกของ bookings
                                        return (
                                            <tr key={index} className="bg-gray-100 text-center border border-b-2 border-gray-400">
                                            <td className="border p-2">{index + 1}</td>
                                            <td className="border p-2">{booking.fields?.field_name}</td>
                                            <td className="border p-2">{formatDateToThai(booking.desired_booking_date.split('T')[0])}</td>
                                            <td className="border p-2">
                                                <button onClick={()=>openDetail(items.bookings)}
                                                        className="text-sky-500 rounded-md hover:scale-105 hover:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 active:scale-95 transition-all duration-200 ease-in-out cursor-pointer"
                                                >
                                                    รายละเอียด     
                                                </button>
                                            </td>
                                            <td className="border p-2">{items.totalprice}</td>
                                            <td className="border p-2">
                                                <p className={`
                                                   ${booking.booking_status === 'รอการตรวจสอบ'?
                                                    'text-yellow-500':
                                                    booking.booking_status === 'จองสำเร็จ'?
                                                    'text-green-500':
                                                    booking.booking_status === 'เกินกำหนดจ่ายงาน'?
                                                    'text-red-500': ''
                                                   } 
                                                `}>{booking.booking_status}</p>
                                            </td>
                                            <td className="border p-2">{
                                                items.payment_confirmation==='n/a'?  
                                                <button onClick={()=>openPayment(items.order_ID)}className="px-6 py-2 bg-sky-500 text-white rounded hover:bg-sky-600">
                                                    อัฟโหลดสลิป     
                                                </button>
                                                : <p className="text-green-500">ส่งสลิปแล้ว</p>
                                                }
                                            </td>
                                            </tr>
                                        );
                                      })
                                    }
                                    </tbody>
                                </table>
                            </div>
                        )}
                        {isDetailOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" >
                                <div className="bg-white p-4 rounded shadow-lg">
                                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                                    <div className="bg-white p-8 rounded-lg w-max-[1200px]">
                                        <h2 className="text-2xl font-bold mb-4">รายละเอียดการจอง</h2>
                                            <table className="min-w-full table-auto border-collapse">
                                                <thead className="bg-gray-200 ">
                                                    <tr className='text-center'>
                                                        <th className="px-4 py-2 border-b  text-sm text-gray-600">Booking ID</th>
                                                        <th className="px-4 py-2 border-b  text-sm text-gray-600">สนาม</th>
                                                        <th className="px-4 py-2 border-b  text-sm text-gray-600">ราคา</th>
                                                        <th className="px-4 py-2 border-b  text-sm text-gray-600">วันที่จอง</th>
                                                        <th className="px-4 py-2 border-b  text-sm text-gray-600">วันที่ต้องการใช้บริการ</th>
                                                        <th className="px-4 py-2 border-b  text-sm text-gray-600">ระยะเวลา</th>
                                                        <th className="px-4 py-2 border-b  text-sm text-gray-600">สถานะการจอง</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedBooking.map((bookingItem: any, index: number) => {
                                                        const strTime = bookingItem.start_Time.split('T')[1].split(':').slice(0, 2).join(':');
                                                        const endTime = bookingItem.end_Time.split('T')[1].split(':').slice(0, 2).join(':');
                                                        const rangTime = `${strTime} - ${endTime}`;
                                                        return (
                                                            <tr key={index} className="hover:bg-gray-50 text-center">
                                                                <td className="px-4 py-2 border-b text-sm text-gray-800">{bookingItem.booking_ID}</td>                                                                
                                                                <td className="px-4 py-2 border-b text-sm text-gray-800">{bookingItem.fields?.field_name}</td>
                                                                <td className="px-4 py-2 border-b text-sm text-gray-800">{bookingItem.Price}</td>
                                                                <td className="px-4 py-2 border-b text-sm text-gray-800">
                                                                    {formatDateToThai(bookingItem.booking_date.split('T')[0])}
                                                                </td>
                                                                <td className="px-4 py-2 border-b text-sm text-gray-800">
                                                                    {formatDateToThai(bookingItem.desired_booking_date.split('T')[0])}
                                                                </td>
                                                                <td className="px-4 py-2 border-b text-sm text-gray-800">{rangTime}</td>
                                                                <td className="px-4 py-2 border-b text-sm text-gray-800">{bookingItem.booking_status}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        <div className='flex justify-end'>
                                            <button
                                                className="mr-10 bg-blue-500 text-white py-2 px-4 rounded mt-4 z-10"
                                                onClick={closeDetail}
                                                >
                                                ปิด
                                            </button>
                                        </div>               
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                         {isPaymantPageOpen && (
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                                <div className="bg-white p-6 rounded-lg max-w-[800px] w-full max-h-[100vh] overflow-y-auto" >
                                <h2 className="text-xl font-semibold mb-4">ชำระเงิน</h2>
                                    <p className="mb-4">ชำระเงิน และอัปโหลดหลักฐานการชำระเงิน</p>
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
                    </div>
                    
                    </div>   
                )}
            </div>
        </MainLayout>
    );
}
