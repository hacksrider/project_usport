'use client';

import React, { useState, useEffect } from 'react';
import MainLayoutAdmin from '@/app/components/mainLayoutAdmin';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AddBooking from './addBooking/page';
import EditBooking  from './editBooking/page';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons'; // นำเข้าไอคอนดินสอ
import { useRouter } from 'next/navigation';
import { ServiceAll, ServicesInterface } from '@/app/interface/services';
import axios from 'axios';
import Booking from '../../user/football/booking/page';

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




export default function BookingOrder() {
    const [showOrderPage, setShowOrderPage] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);          // สำหรับเปิด/ปิด หน้าย่อยรูปภาพ
    const [isDetailOpen, setIsDetailOpen] = useState(false);        // สำหรับเปิด/ปิด หน้าย่อยหน้ารายละเอียด
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);        // สำหรับเปิด/ปิด หน้าย่อยหน้าลบ
    const [isApproveOpen, setIsApproveOpen] = useState(false);      // สำหรับเปิด/ปิด หน้าย่อยอนุมัติ
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // สำหรับเปิด/ปิด หน้าย่อยแก้ไข
    const [showBookingPage, setShowBookingPage] = useState(false);  // สำหรับเปิด/ปิด หน้าเพิ่ม
    const [showEditBookingPage, setShowEditBookingPage] = useState(false);  // สำหรับเปิด/ปิด หน้าเพิ่ม

    const [keepOrderID,setKeepOrderID] = useState(0);               //เก็บ order ID
    const [fullImage, setFullImage] = useState('');                 // เก็บพาธ
    const [selectedBookingForEdit, setSelectedBookingForEdit] = useState<any>(null); //เก็บสถานะการจอง
    const [datafromBooking,setDataFromBooking] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);

    const myData = { name: 'John', age: 30 };

    const fetchBooking = async () =>{
        try{
            const bookingOrder = await axios.get('/api/booking/dataOrder');
            setDataFromBooking(bookingOrder.data)
            console.log(bookingOrder.data)
        }catch{
            console.log("ดึงข้อมูลไม่ได้")
        }
    }

    const deleteBooking = async (orderID : number)=>{
       // console.log(orderID)
        try{
            const deleteBooking = await axios.delete(`/api/booking/updateDataBooking?order_ID=${orderID}`);
            console.log(deleteBooking.data)
            refreshData();
            closeDeleteModal();
        }catch{
            console.log("เกิดข้อผิดพลาดในการลบข้อมูล")
        }
    }

    const approveBooking = async(orderID : number, status : string) =>{
        try{
            const updateBookingStatus  = await axios.put(`/api/booking/dataBooking?order_ID=${orderID}&status=${status}`)
            console.log(updateBookingStatus.data)
            closeApprovement();
            refreshData();
        }catch{
            console.log("เกิดข้อผิดพลาดในการอัปเดตสถานะ")
            alert("เกิดข้อผิดพลาดในการอนุมัติ")
        }
    };

    useEffect(()=>{    
        fetchBooking();
    },[])

    const refreshData = async () => {
        await fetchBooking(); // เรียกฟังก์ชัน fetchData ใหม่เพื่อรีเฟรชข้อมูล
    };

    const openBookingPage = () => {
        setShowOrderPage(false);
        setShowBookingPage(true); // เมื่อคลิกปุ่มจะทำให้แสดงหน้า "การจอง"
    };
    
    const closBookingPage=()=>{
        setShowBookingPage(false);
        setShowOrderPage(true)
        refreshData();
    }

    const openEditBookingPage = () => {
        setShowOrderPage(false);
        setShowBookingPage(false)
        setShowEditBookingPage(true); // เมื่อคลิกปุ่มจะทำให้แสดงหน้า "การจอง"
    };
    
    const closEditBookingPage=()=>{
        setShowEditBookingPage(false);
        setShowOrderPage(true)
        refreshData();
    }


    const openDeleteModal = (orderID : number) => {
        setKeepOrderID(orderID);
        setIsDeleteOpen(true)
    };
    
    const closeDeleteModal=()=>{
        setKeepOrderID(0); 
        setIsDeleteOpen(false)
    }

    const openApprovement = (ordID: number) => {
        setKeepOrderID(ordID); // เก็บ URL รูปภาพที่คลิก
        setIsApproveOpen(true); // เปิด modal
      };
    
      // ฟังก์ชันเพื่อปิด modal
      const closeApprovement = () => {
        setKeepOrderID(0); // เก็บ URL รูปภาพที่คลิก
        setIsApproveOpen(false);  // ปิด modal
        refreshData();
      };

    const openModal = (imageSrc: string) => {
        setFullImage(imageSrc); // เก็บ URL รูปภาพที่คลิก
        setIsModalOpen(true); // เปิด modal
      };
    
      const closeModal = () => {
        setFullImage(''); // เก็บ URL รูปภาพที่คลิก
        setIsModalOpen(false); // ปิด modal
      };

      const openDetail = (booking: any) => {
        console.log(booking);
        setSelectedBooking(booking);
        setIsDetailOpen(true);
      };
    
      const closeDetail = () => {
        setIsDetailOpen(false);
        setSelectedBooking(null); 
      };

      const openEditModal = (booking: any) => {
        setSelectedBookingForEdit(booking); // เก็บข้อมูลการจองที่เลือก
        setIsEditModalOpen(true); // เปิดโมดอลแก้ไข
      };
      
      const closeEditModal = () => {
        setIsEditModalOpen(false); // ปิดโมดอลแก้ไข
        setSelectedBookingForEdit(null); // ล้างข้อมูลการจองที่เลือก
      };
    
     return (
             <MainLayoutAdmin>
                <h1 className="text-2xl font-semibold mb-3 text-black">{ showOrderPage===true?'รวมคำสั่งจองสนามฟุตบอล':'เพิ่มการจองสนาม'}      </h1>
                    <div>
                       {showOrderPage &&(
                            <div className="w-full bg-gray-300 ml-2 p-6 rounded shadow-md">
                            <div className="p-0 ">
                                <div className=' w-full flex flex-row items-center justify-between'>
                                    <p>คำสั่งจองสนามฟุตบอล</p>
                                    <button className='bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none'
                                            onClick={openBookingPage}
                                        >
                                        + เพิ่มการจองสนาม
                                    </button>
                                </div>
                                <table className="table-auto w-full bg-white rounded shadow mt-4">
                                    <thead>
                                        <tr className="bg-gray-100 text-center border-2 border-gray-800">
                                            <th className="px-4 py-2 text-gray-800 bg-gray-400">orderID.</th>
                                            <th className="px-4 py-2 text-gray-800 bg-gray-400">ชื่อ - นามสกุล</th>
                                            <th className="px-4 py-2 text-gray-800 bg-gray-400">ประเภทสมาชิก</th>
                                            <th className="px-4 py-2 text-gray-800 bg-gray-400">สนาม</th>
                                            <th className="px-4 py-2 text-gray-800 bg-gray-400">ราคารวม</th>
                                            <th className="px-4 py-2 text-gray-800 bg-gray-400">สลิปโอนเงิน</th>
                                            <th className="px-4 py-2 text-gray-800 bg-gray-400">สถานะ</th>
                                            <th className="px-4 py-2 text-gray-800 bg-gray-400">รายละเอียด</th>
                                            <th className="px-4 py-2 text-gray-800 border-2 border-gray-800 bg-gray-400">การจัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datafromBooking.map((booking, index) => { 
                                                     const usertype =   booking.bookings?.[0]?.users?.type_of_user
                                                return (    
                                                    <tr key={index} className="text-center border-2 border-gray-400 ">
                                                        <td className="px-4 py-2">{booking.order_ID}</td>
                                                        <td className="px-4 py-2">{booking.bookings?.[0]?.users?.user_name+'  '+booking.bookings?.[0]?.users?.user_lastname}</td>
                                                        <td className={`px-4 py-2 ${usertype ==='external'? 'text-pink-500' : 'text-yellow-500'}` }>{usertype ==='external'? usertype : 'internal'}</td>
                                                        <td className="px-4 py-2">{booking.bookings?.[0]?.fields?.field_name}</td>
                                                        <td className="px-4 py-2">{booking.totalprice}</td>
                                                        <td className="px-4 py-2 flex justify-center items-center">{
                                                                                booking.payment_confirmation==='n/a'? 
                                                                                booking.payment_confirmation : 
                                                                                <img src={booking.payment_confirmation}
                                                                                    style={{width:'50px',height:'70px'}}
                                                                                    onClick={ () => openModal(booking.payment_confirmation? 
                                                                                        booking.payment_confirmation : ''
                                                                                    )}
                                                                                ></img> 
                                                                                }
                                                        </td>
                                                        <td className={`px-4 py-2 ${
                                                                            booking.bookings?.[0]?.booking_status === 'inspecting' ? 'text-red-500' :
                                                                            booking.bookings?.[0]?.booking_status === 'available' ? 'text-pink-500' :
                                                                             'text-green-600' 
                                                                            
                                                                            }`}>"{booking.bookings?.[0]?.booking_status}"</td>
                                                        <td className="text-blue-500 italic hover:text-blue-700">
                                                            <button onClick={()=>openDetail(booking.bookings)}>ดูรายละเอียด</button>
                                                         </td>
                                                        <td className="px-4 py-2 border-2 border-gray-400 ">
                                                            <button 
                                                                className={`text-blue-500 hover:text-blue-700 ${
                                                                    booking.bookings?.[0]?.booking_status === 'booked'?
                                                                        'text-gray-400 italic cursor-not-allowed pointer-events-none' :''
                                                                    }`
                                                                }
                                                                onClick={()=>openApprovement(booking.order_ID)}
                                                                disabled={booking.bookings?.[0]?.booking_status === "booked"}
                                                              >อนุมัติ  
                                                            </button>
                                                                <span className="mx-2 mr-5 ml-5 border-r-2 border-gray-800"></span>
                                                            <FontAwesomeIcon 
                                                                icon={faPen} 
                                                                className={` ml-2 mr-2 h-5 w-5 hover:text-red-700 ${booking.bookings?.[0].booking_status === 'booked'?'text-gray-400 cursor-not-allowed pointer-events-none' :'text-red-500'}`}
                                                                onClick={() => openEditModal(booking)} 
                                                            />
                                                                <span className="mx-2 mr-5 ml-5 border-r-2 border-gray-800"></span>
                                                            <FontAwesomeIcon 
                                                                icon={faTrashAlt} 
                                                                className="ml-2 h-full w-5  text-red-500 hover:text-red-700"
                                                                onClick={()=>openDeleteModal(booking.order_ID)}
                                                            /> 
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                                {isModalOpen && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={closeModal}>
                                        <div className="bg-white p-4 rounded shadow-lg">
                                            <img
                                            src={fullImage}
                                            alt="Full Image"
                                            className="max-w-full max-h-[80vh]" // จำกัดขนาดรูปภาพ
                                            />
                                        </div>
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
                                                                <th className="px-4 py-2 border-b  text-sm text-gray-600">Order ID</th>
                                                                <th className="px-4 py-2 border-b  text-sm text-gray-600">ชื่อผู้ใช้</th>
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
                                                                        <td className="px-4 py-2 border-b text-sm text-gray-800">{bookingItem.order_ID}</td>
                                                                        <td className="px-4 py-2 border-b text-sm text-gray-800">{bookingItem.users?.user_name}</td>
                                                                        <td className="px-4 py-2 border-b text-sm text-gray-800">{bookingItem.fields?.field_name}</td>
                                                                        <td className="px-4 py-2 border-b text-sm text-gray-800">{bookingItem.Price}</td>
                                                                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                                                                            {dayjs(bookingItem.booking_date.split('T')[0]).format('DD-MM-YYYY')}
                                                                        </td>
                                                                        <td className="px-4 py-2 border-b text-sm text-gray-800">
                                                                            {dayjs(bookingItem.desired_booking_date.split('T')[0]).format('DD-MM-YYYY')}
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

                                { isDeleteOpen&&(
                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                                        <div className="bg-white p-6 rounded-lg max-w-md w-full">
                                            <h2 className="text-xl font-semibold mb-4">อนุมัติการจอง</h2>
                                                <p className="mb-4">คุณต้องลบการจองสนาม oder ID : {keepOrderID} หรือไม่</p>
                                                    <div className="flex justify-end space-x-4">
                                                        <button     
                                                            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                            onClick={()=>deleteBooking(keepOrderID)}
                                                         >ยืนยัน
                                                        </button>
                                                        <button  
                                                            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                                            onClick={closeDeleteModal}
                                                         >ยกเลิก
                                                        </button>
                                                </div>
                                        </div>
                                    </div>
                                )}
                                { isApproveOpen&&(
                                    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                                        <div className="bg-white p-6 rounded-lg max-w-md w-full">
                                            <h2 className="text-xl font-semibold mb-4">อนุมัติการจอง</h2>
                                                <p className="mb-4">คุณต้องการอนุมัติการจองสนาม oder ID : {keepOrderID} หรือไม่</p>
                                                    <div className="flex justify-end space-x-4">
                                                        <button     
                                                                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-600"
                                                                onClick={()=>approveBooking(keepOrderID,'booked')}
                                                            >
                                                            อนุมัติ
                                                         </button>
                                                         <button     
                                                                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-green-600"
                                                                onClick={()=>approveBooking(keepOrderID,'available')}
                                                            >
                                                            ไม่อนุมัติ
                                                         </button>
                                                        <button  
                                                                className="px-6 py-2  bg-gray-500 text-white rounded hover:bg-red-600"
                                                                onClick={closeApprovement}
                                                            >
                                                            ยกเลิก
                                                        </button>  
                                                </div>
                                        </div>
                                    </div>
                                )}
                                {isEditModalOpen && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                        <div className="bg-white p-6 rounded-lg max-w-md w-full">
                                        <h2 className="text-xl font-semibold mb-4">การแก้ไข</h2>
                                        <form onSubmit={(e) => {
                                            approveBooking(selectedBookingForEdit?.order_ID,selectedBookingForEdit?.bookings[0]?.booking_status)
                                            e.preventDefault();
                                            closeEditModal();
                                        }}>
                                            <div className="mb-4">
                                            <label className="block text-gray-700">สถานะการจอง</label>
                                                <select className="w-full px-3 py-2 border rounded"
                                                    value={selectedBookingForEdit?.bookings?.[0]?.booking_status}
                                                    onChange={(e) => {
                                                        setSelectedBookingForEdit((prev: any) => ({
                                                            ...prev,
                                                            bookings: [{
                                                                ...prev.bookings[0],
                                                                booking_status: e.target.value,
                                                            }],
                                                        }));
                                                    }}
                                                >
                                                    <option value="booked">booked</option>
                                                    <option value="inspecting">inspecting</option>
                                                    <option value="available">available</option>
                                                </select>
                                            </div>

                                            <div className="mb-4">
                                            <label className="block text-gray-700">แก้ไขการจอง</label>
                                                        <button
                                                            type="button"
                                                            className="px-6 py-2 bg-red-500 text-white rounded hover:bg-gray-600"
                                                            onClick={openEditBookingPage}
                                                        >
                                                            Edit
                                                        </button>
                                            </div>
                                            <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                                                onClick={closeEditModal}
                                            >
                                                ยกเลิก
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                บันทึก
                                            </button>
                                            </div>
                                        </form>
                                        </div>
                                    </div>
                                    )}
                            </div>
                        </div>
                       )}
                        
                        {showBookingPage&&(
                                    <div className=' w-[1600px] bg-gray-300 ml-2 p-6 rounded shadow-md'>
                                        <div className='flex items-end w-full '>
                                            <button 
                                                className='text-2xl font-bold ml-auto  mr-15 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200'
                                                onClick={closBookingPage}
                                                >ปิด
                                            </button>
                                        </div>                             
                                        <AddBooking></AddBooking>
                                    </div>
                                )}

                            {showEditBookingPage && (
                            <div className='w-[1600px] bg-gray-300 ml-2 p-6 rounded shadow-md'>
                                <div className='flex items-end w-full'>
                                <button 
                                    className='text-2xl font-bold ml-auto mr-15 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition duration-200'
                                    onClick={closEditBookingPage}
                                >
                                    ปิด
                                </button>
                                </div>
                                <EditBooking data={selectedBookingForEdit}></EditBooking>
                            </div>
                            )}


            </div>
        </MainLayoutAdmin>
     );
}