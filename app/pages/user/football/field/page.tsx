'use client'

import axios from "axios";
//import { useRouter } from "next/navigation";
import React, { useEffect, useState } from 'react'
import {Card, CardHeader, CardTitle,} from "@/components/ui/card"
import MainLayout from '@/app/components/mainLayout'
import { useRouter } from 'next/navigation';


interface Field {     
    field_ID: number;
    field_name: string;
    status: string;
}

export default function Feild() {
    const [feildData, setFeildData] = useState<Field[]>([]); 
    const [ValBuffer, setVarBuffer] = useState(0); 
    const route = useRouter();

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
    }, [ValBuffer]);

    const showVal = ( getVal: number ):void =>{
        setVarBuffer(getVal);
        route.push(`/pages/user/football/booking?val=${getVal}`);                                                                                //
    }

    const handleListFeild = () => {
        return feildData.map((field, index) => (
            <Card
                key={index}
                className={`text-white mb-5 w-[30rem] h-[5rem] hover:scale-105 hover:border-2 hover:border-red-700 transition-all duration-300 ${JSON.parse(field.status) === false ? 'pointer-events-none opacity-50' : ''}`}
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/user/img/สนามหญ้าเทียม.jpg')`, // ปรับโปร่งใสให้ลดลง
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(1.2)', // เพิ่มความสว่างของภาพ
                }}
                onClick={() => JSON.parse(field.status) !== false && showVal(field.field_ID)}
            >
                <CardHeader className='text-2xl text-center'>
                    <CardTitle>สนาม {field.field_name}</CardTitle>
                </CardHeader>
            </Card>
        ));
    };

    return (
        <MainLayout>
            <div className='flex flex-col items-center mt-20'>
            <h1 className="text-5xl font-extrabold text-white mb-12 text-center">
                    เลือกสนามที่คุณต้องการเล่น
                </h1>

                <div className="w-full flex flex-wrap justify-center gap-6">
                    {handleListFeild()}
                </div>

                {/* รูปภาพ 4 รูป พร้อมข้อความ */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full mt-8 mb-4">
                    <div className="relative h-72 bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
                         style={{ backgroundImage: "url('/user/img/football-1.jpg')", filter: "brightness(1.2)" }}>
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center text-white text-xl font-semibold">
                            
                        </div>
                    </div>

                    <div className="relative h-72 bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
                         style={{ backgroundImage: "url('/user/img/football-2.jpg')", filter: "brightness(1.2)" }}>
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center text-white text-xl font-semibold">
                            
                        </div>
                    </div>

                    <div className="relative h-72 bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
                         style={{ backgroundImage: "url('/user/img/football-3.jpg')", filter: "brightness(1.2)" }}>
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center text-white text-xl font-semibold">
                            
                        </div>
                    </div>

                    <div className="relative h-72 bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
                         style={{ backgroundImage: "url('/user/img/football-4.jpg')", filter: "brightness(1.2)" }}>
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center text-white text-xl font-semibold">
                            
                        </div>
                    </div>
                </div>

              

                {/* {handleListFeild()} */}
                    
            </div>
        </MainLayout>
        
    );
}
