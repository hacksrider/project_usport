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
                className='text-white mb-5 w-[35rem] h-[5rem] hover:scale-105 hover:border-2 hover:border-red-700'
                style={
                        {
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/user/img/football-2.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        }
                }
                onClick={() => showVal(field.field_ID)}
            >
                <CardHeader className='text-2xl text-center'>
                    <CardTitle> สนาม {field.field_name}</CardTitle> 
                </CardHeader>
            </Card>
        ));
    };

    return (
        <MainLayout>
            <div className='flex flex-col items-center mt-20'>
                {handleListFeild()}
                    {/* <div>
                        <h1 className="text-white">{ValBuffer}</h1>
                    </div> */}
            </div>
        </MainLayout>
        
    );
}
