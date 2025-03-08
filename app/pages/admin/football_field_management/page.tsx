'use client'
import React from 'react'
import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AdminInterface } from '../../../interface/admin';

import MainLayoutAdmin from '@/app/components/mainLayoutAdmin'
import axios, { AxiosResponse } from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faBahtSign } from '@fortawesome/free-solid-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';



interface Field {     
    field_ID: number;
    field_name: string;
    status: string;
}

interface PriceData {
    case_type: string;
    field_ID: number;
    period_ID: number;
    price_per_1h: number;
    price_for_2h: number;
}

export default function FootballField_1() {
    const [selectIDF,setSelectIDF]=useState(0);
    const [feildData, setFeildData] = useState<Field[]>([]); 
    const [AddModalOpen, setAddModalOpen] = useState(false);          // สำหรับเปิด/ปิด หน้าเพิ่ม
    const [EditModalOpen, setEditModalOpen] = useState(false);          // สำหรับเปิด/ปิด หน้าเพิ่ม
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);          // สำหรับเปิด/ปิด หน้าเพิ่ม
    const [priceModalOpen, setPriceModalOpen] = useState(false);          // สำหรับเปิด/ปิด หน้าเพิ่ม

    const [price1_1, setPrice1_1] = useState<number>(0);
    const [price1_2, setPrice1_2] = useState<number>(0);
    const [price2_1, setPrice2_1] = useState<number>(0);
    const [price2_2, setPrice2_2] = useState<number>(0);      

    const [inputText, setInputText] = useState('');
    const [isChecked, setIsChecked] = useState(false);
    const [updateOrCreate, setUpdateOrCreate] = useState(false);
    const [dataForSend, setDataForSend] = useState<{ field_name: string; status: boolean }[]>([]);
    const [price, setPrice] = useState<{}[]>([]);
    const [empJob, setEmpJob] = useState<boolean | null>(null);
    const { data,status } = useSession(); 
    const empData = data as AdminInterface;
    const router = useRouter();

     useEffect(() => {
              if (status === 'unauthenticated') {
                    alert("กรุณาเข้าสู่ระบบก่อนค่ะ !!");
                    router.push('/pages/admin');
                    
              } else if (status === 'authenticated' && data) {
                //setIDEmp(empData.user.id)
                setEmpJob(empData.user.emp_job)
              }
              console.log(empJob)
    }, [empJob]);

    useEffect(()=>{
        const fetchFeildData = async()=>{
            try{
                const response = await axios.get('/api/field_management');
                setFeildData(response.data); 
                console.log(response.data);
            }catch (error) {
                console.log("Error fetching data", error);
            }
        }
        fetchFeildData();
        console.log(price)
         console.log(updateOrCreate);
        // console.log(price1_2)
        // console.log(price2_1)
        // console.log(price2_2)
    },[inputText,price,updateOrCreate])

    const addNewField = async() =>{
        try{
            const newData = {
                field_name: inputText,
                status: isChecked,
              };
              setDataForSend([...dataForSend, newData]);
            const response = await axios.post('/api/field_management',newData);
            console.log(response)
            handleReset()
            alert("เพิ่มสนามสำเร็จ");
            closeAddModal()
        }catch (error) {
            console.error("Error sending data to API:", error);
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
          }
    }
    const editField = async() =>{
        try{
            const newData = {
                field_ID:selectIDF,
                field_name: inputText,
                status: isChecked,
              };
              setDataForSend([...dataForSend, newData]);
            const response = await axios.put('/api/field_management',newData);
            console.log(response)
            handleReset()
            alert("แก้ไขข้อมูลสนามสำเร็จ");
            closeEditionClick()
        }catch (error) {
            console.error("Error sending data to API:", error);
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
          }
    }
    const deleteField = async() =>{
        try{
            const response = await axios.delete("/api/field_management", {
                params: { id: selectIDF }, // ส่ง ID ผ่าน params
              });
            console.log(response)
            handleReset()
            alert("ลบข้อมูลสนามสำเร็จ");
            closeDeleteClick()
        }catch (error) {
            console.error("Error sending data to API:", error);
            alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
        }
    }
        
    const sendDataToAPI = async () => {
        try {
            let setupData ;
            if (
                isNaN(price1_1) || 
                isNaN(price1_2) || 
                isNaN(price2_1) || 
                isNaN(price2_2) || 
                price1_1 <= 0 || price1_2 <= 0 || price2_1 <= 0 || price2_2 <= 0
              ) {
                alert("กรุณากรอกข้อมูลที่เป็นตัวเลขที่ถูกต้องสำหรับทุกช่อง");
                return;
            };
            if (updateOrCreate === false) {
                const data  = [
                    {
                      case_type: 'insert',
                      field_ID: selectIDF,
                      period_ID: 1,
                      price_per_1h: price1_1,
                      price_for_2h: price1_2,
                    },
                    {
                      case_type: 'insert',
                      field_ID: selectIDF,
                      period_ID: 2,
                      price_per_1h: price2_1,
                      price_for_2h: price2_2,
                    },
                ];
                setupData = data
            }else if (updateOrCreate === true){
                const priceList=[price1_1,price1_2,price2_1,price2_2]
                const updatedPrice = price.map((addCase,index) => ({
                    ...addCase,
                    case_type: 'update',
                    price_per_1h: priceList[index * 2], // ดึงค่าของ price_per_1h จาก priceList
                    price_for_2h: priceList[index * 2 + 1], // ดึงค่าของ price_for_2h จาก priceList
                  }));
                setupData = updatedPrice
            }
           console.log(setupData)
          const response = await axios.post('/api/field_management/pricefield', setupData, {
            headers: {
              'Content-Type': 'application/json',
            },
          });
         console.log('Success:', response.data);
         response.status === 200 ? alert('เปลี่ยนแปลงราคาเรียบร้อยแล้ว') : alert('เกิดข้อผิดพลาด');
         closeEditionPrice()
        } catch (error) {
          console.error('Error:', error);
        }
      };

    const openAddModal = () => {
        handleReset();
        setAddModalOpen(true);
    };
    const closeAddModal = () => {
        setAddModalOpen(false);
    };
    const openEditionClick = (data: any) => {
        setSelectIDF(data.field_ID)
        setInputText(data.field_name)
        setIsChecked(data.status)
        setEditModalOpen(true)
    }
    const closeEditionClick = () => {
        handleReset();
        setEditModalOpen(false)
    };
    const openDeleteClick = (data: any) => {
        setSelectIDF(data.field_ID)
        setInputText(data.field_name)
        setIsChecked(data.status)
        setDeleteModalOpen(true)
    }
    const closeDeleteClick = () => {
        handleReset();
        setDeleteModalOpen(false)
    };
    const openEditionPrice = (data: any) => {
        console.log(data);
        setPrice(data.pricefield);
        setSelectIDF(data.field_ID)
        const selector = (data.pricefield[0]?.price_per_1h != null && 
                          data.pricefield[0]?.price_for_2h != null && 
                          data.pricefield[1]?.price_per_1h != null && 
                          data.pricefield[1]?.price_for_2h != null);
        setUpdateOrCreate(selector);

        const pricePer1hPeriod1 = data.pricefield[0]?.price_per_1h ?? 0; // 800
        const priceFor2hPeriod1 = data.pricefield[0]?.price_for_2h ?? 0; // 1200
        const pricePer1hPeriod2 = data.pricefield[1]?.price_per_1h ?? 0; // 1000
        const priceFor2hPeriod2 = data.pricefield[1]?.price_for_2h ?? 0; // 1500
            
        setPrice1_1(pricePer1hPeriod1)
        setPrice1_2(priceFor2hPeriod1)
        setPrice2_1(pricePer1hPeriod2)
        setPrice2_2(priceFor2hPeriod2)
        setInputText(data.field_name)
        setPriceModalOpen(true)
    }
    const closeEditionPrice = () => {
        //handleReset();
        setPrice([]);
        setSelectIDF(0)
        setUpdateOrCreate(false);
        setPrice1_1(0);
        setPrice1_2(0);
        setPrice2_1(0);
        setPrice2_2(0);
        setPriceModalOpen(false);
    };
 
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value);
    };
    const handleToggle = () => {
        setIsChecked(!isChecked);
    };
    const handleReset = () =>{
        setInputText(""); // เคลียร์ input text
        setIsChecked(false); // เคลียร์ checkbox
    }

    return (
        <MainLayoutAdmin>
            <h1 className="text-2xl font-semibold mb-5 mt-5 text-black">การจัดการสนามฟุตบอล</h1>
           <div>
           <div className='flex flex-row justify-center flex-wrap h-full w-[1200px] ml-auto mr-auto bg-red-200 p-6 rounded-[20px] ml-auto mr-auto overflow-y-auto'>
            {
                feildData.length === 0 ? ( // ตรวจสอบว่า feildData ว่างหรือไม่
                    <div className='ml-auto mr-auto'>
                    <div className='text-lg w-[15rem] h-[15rem] p-6 rounded shadow-lg font-bold 
                         bg-gray-500 rounded-[20px] shadow-lg flex items-center justify-center'
                    >                   
                            ไม่มีข้อมูลสนาม
                    </div>
                </div>
                ) : (
                    feildData.map((e, index) => {
                    return (
                        <div key={index} className='mr-5 ml-5  mb-10'>
                        <div
                            className='text-lg w-[15rem] h-[15rem] p-6 rounded shadow-lg font-bold rounded-[20px]'
                            style={{
                            backgroundImage: "url('https://media.istockphoto.com/id/499028745/th/%E0%B8%A3%E0%B8%B9%E0%B8%9B%E0%B8%96%E0%B9%88%E0%B8%B2%E0%B8%A2/%E0%B8%AA%E0%B8%99%E0%B8%B2%E0%B8%A1%E0%B8%9F%E0%B8%B8%E0%B8%95%E0%B8%9A%E0%B8%AD%E0%B8%A5%E0%B8%AB%E0%B8%8D%E0%B9%89%E0%B8%B2%E0%B8%AA%E0%B8%B5%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%A7%E0%B8%98%E0%B8%A3%E0%B8%A3%E0%B8%A1%E0%B8%8A%E0%B8%B2%E0%B8%95%E0%B8%B4.jpg?s=170667a&w=0&k=20&c=c3P39qKO_cbBUsw11-FSjF7qpNaldbKqnpWtFV2VKeU=')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            }}
                        >
                            <div className='flex flex-row justify-center flex-wrap bg-gray-300 p-6 rounded-[20px]'>
                                {'สนาม : ' + e.field_name}
                                <div className='flex flex-row item-center justify-center'>
                                    <div
                                    className={`rounded-full w-[25px] h-[25px] border-[1px] border-black mr-3 ${
                                        e.status ? 'bg-green-500' : 'bg-red-500'
                                    }`}
                                    ></div>
                                    {e.status ? 'เปิด' : 'ปิด'}
                                </div>
                            </div>
                            <div className='flex flex-row justify-center mt-5 w-[12rem] h-[2.8rem] p-2 text-red text-3xl rounded-[20px] bg-gray-300'>
                                <FontAwesomeIcon 
                                    icon={faBahtSign}
                                    className={`ml-auto mr-auto transform transition-all duration-300 
                                        hover:scale-105 hover:shadow-xl hover:text-sky-500
                                        ${empJob === false || empJob === null
                                          ? "opacity-50 pointer-events-none cursor-not-allowed"
                                          : "cursor-pointer"
                                        }`} 
                                    onClick={()=>openEditionPrice(e)}
                                />
                                <FontAwesomeIcon
                                    icon={faPen} 
                                    className="ml-auto mr-auto transform transition-all duration-300 
                                                hover:scale-105 hover:shadow-xl hover:text-sky-500"
                                    onClick={()=>openEditionClick(e)}
                                    
                                />
                                <FontAwesomeIcon 
                                    icon={faTrash} 
                                    className="ml-auto mr-auto transform transition-all duration-300 
                                                hover:scale-105 hover:shadow-xl hover:text-sky-500"
                                    onClick={()=>openDeleteClick(e)}
                                />
                            </div>
                          </div>
                        </div>
                      );
                    })
                )
                }
                <div className=' ml-5 '>
                    <div 
                        className='text-lg w-[15rem] h-[15rem] p-6 rounded shadow-lg font-bold 
                                   bg-sky-500 rounded-[20px] shadow-lg transform transition-all duration-300 
                                   hover:scale-105 hover:shadow-xl hover:bg-sky-300
                                   flex items-center justify-center'
                        onClick={openAddModal}
                    >                   
                        <div className='w-[50px] h-[50px] rounded-full border-[2px] border-white flex items-center justify-center'>
                            <FontAwesomeIcon icon={faPlus} className="text-white text-4xl" />
                        </div>
                       
                    </div>
                </div>
            </div>
            {AddModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-semibold mb-4">เพิ่มข้อมูลสนาม</h2>

                    <div className="mb-4">
                    <label htmlFor="textInput" className="block text-sm font-medium text-gray-700">
                        ชื่อสนาม
                    </label>
                    <input
                        id="textInput"
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>

                    <div className="mb-4 flex items-center">
                        <label className="flex items-center cursor-pointer">
                            สถานะ &nbsp;
                            <div className="relative">
                                
                                <input
                                type="checkbox"
                                className="sr-only"
                                checked={isChecked}
                                onChange={handleToggle}
                                />
                                
                                <div
                                className={`w-14 h-8 rounded-full shadow-inner transition-colors ${
                                    isChecked ? "bg-green-500" : "bg-gray-300"
                                }`}
                                ></div>
                               
                                <div
                                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                                    isChecked ? "translate-x-6" : "translate-x-0"
                                }`}
                                ></div>
                            </div>
                           
                            <span className="ml-3 text-gray-700">
                                
                                {isChecked ? "เปิด" : "ปิด"}
                            </span>
                        </label>
                    </div>

                    <div className="flex justify-end ">
                    <button
                        onClick={addNewField}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg mr-3"
                    >
                        ยืนยัน
                    </button>
                    <button
                        type='reset'
                        onClick={handleReset}
                        className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-3"
                    >
                        แก้ไข
                    </button>
                    <button
                        onClick={closeAddModal}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg mr-3"
                    >
                        ปิด
                    </button>
                    </div>
                </div>
                </div>
            )}
            {EditModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4">แก้ไขข้อมูลสนาม</h2>

                        {/* Input field */}
                        <div className="mb-4">
                        <label htmlFor="textInput" className="block text-sm font-medium text-gray-700">
                            ชื่อสนาม
                        </label>
                        <input
                            id="textInput"
                            type="text"
                            value={inputText}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        </div>

                        {/* Toggle switch */}
                        <div className="mb-4 flex items-center">
                        <label className="flex items-center cursor-pointer">
                            สถานะ &nbsp;
                            <div className="relative">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={isChecked}
                                onChange={handleToggle}
                            />
                            <div
                                className={`w-14 h-8 rounded-full shadow-inner transition-colors ${
                                isChecked ? "bg-green-500" : "bg-gray-300"
                                }`}
                            ></div>
                            <div
                                className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
                                isChecked ? "translate-x-6" : "translate-x-0"
                                }`}
                            ></div>
                            </div>
                            <span className="ml-3 text-gray-700">{isChecked ? "เปิด" : "ปิด"}</span>
                        </label>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end">
                        <button
                            onClick={editField}
                            className="bg-green-500 text-white py-2 px-4 rounded-lg mr-3"
                        >
                            ยืนยัน
                        </button>
                        <button
                            type="reset"
                            onClick={handleReset}
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg mr-3"
                        >
                            แก้ไข
                        </button>
                        <button
                            onClick={closeEditionClick}
                            className="bg-red-500 text-white py-2 px-4 rounded-lg mr-3"
                        >
                            ปิด
                        </button>
                        </div>
                    </div>
                    </div>
                )
            }
            {deleteModalOpen && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-">ลบสนาม</h2>
                        <h3> คุณต้องการลบข้อมูลสนามนี้ออกใช่หรือไม่ ?</h3>
                        <div className="mb-4">
                        </div>
                        <div className="mb-4 ml-10 flex flex-col w-full">
                        <label className="flex items-center cursor-pointer">
                            ชื่อสนาม :&nbsp;
                            <span className="ml-3 text-gray-700">{inputText}</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                            สถานะ :&nbsp;
                            <span className="ml-3 text-gray-700">{isChecked ? "เปิด" : "ปิด"}</span>
                        </label>
                        </div>

                        <div className="flex justify-end">
                        <button
                            onClick={deleteField}
                            className="bg-green-500 text-white py-2 px-4 rounded-lg mr-3"
                        >
                            ยืนยัน
                        </button>
                        <button
                            onClick={closeDeleteClick}
                            className="bg-red-500 text-white py-2 px-4 rounded-lg mr-3"
                        >
                            ปิด
                        </button>
                        </div>
                    </div>
                    </div>
                )
            }
            {priceModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-200">
                    <h2 className="text-xl font-semibold mb-4">แก้ไขราคาสนาม</h2>
                    {/* ตารางแสดงข้อมูลสนามและราคา */}
                    <div className="mb-10">
                        <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">ชื่อสนาม</th>
                                <th className="border p-2">ช่วงเวลา</th>
                                <th className="border p-2">ราคา/1 ชม.</th>
                                <th className="border p-2">ราคา/2 ชม.</th>
                            </tr>
                        </thead>
                        <tbody>
                                <tr>
                                    <td>{inputText}</td>
                                    <td>09:00 - 16:00</td>
                                    <td className='pl-5 pr-5'><input
                                        type="number"
                                        placeholder="ราคา/1 ชม."
                                        className="w-full px-2 py-1 border rounded"
                                        value={price1_1}
                                        onChange={(e) => setPrice1_1(parseInt(e.target.value))}
                                        required
                                    />
                                    </td>
                                    <td><input
                                        type="number"
                                        placeholder="ราคา/2 ชม."
                                        className="w-full px-2 py-1 border rounded"
                                        value={price1_2}
                                        onChange={(e) => setPrice1_2(parseInt(e.target.value))}
                                        required
                                    />
                                    </td>
                                </tr>
                                <tr>
                                    <td>{inputText}</td>
                                    <td>16:00 - 00:00</td>
                                    <td className='pl-5 pr-5'><input
                                        type="number"
                                        placeholder="ราคา/1 ชม."
                                        className="w-full px-2 py-1 border rounded"
                                        value={price2_1}
                                        onChange={(e) => setPrice2_1(parseInt(e.target.value))}
                                        required
                                        
                                    />
                                    </td>
                                    <td><input
                                        type="number"
                                        placeholder="ราคา/2 ชม."
                                        className="w-full px-2 py-1 border rounded"
                                        value={price2_2}
                                        onChange={(e) => setPrice2_2(parseInt(e.target.value))}
                                        required
                                    />
                                    </td>
                                </tr>
                        </tbody>
                        </table>
                    </div>

                    {/* ปุ่มยืนยันและปิด */}
                    <div className="flex justify-end">
                        <button
                        onClick={sendDataToAPI}
                        className="bg-green-500 text-white py-2 px-4 rounded-lg mr-3"
                        >
                        ยืนยัน
                        </button>
                        <button
                        onClick={closeEditionPrice}
                        className="bg-red-500 text-white py-2 px-4 rounded-lg mr-3"
                        >
                        ปิด
                        </button>
                    </div>
                    </div>
                </div>
                )}
           </div>
    </MainLayoutAdmin>
    )
}