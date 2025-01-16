'use client'

// import { View, Text } from 'react-native'
import React from 'react'
import {
    Card,
    CardContent,
    // CardDescription,
    // CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import MainLayout from '@/app/components/mainLayout'

export default function Feild() {
    return (
        <MainLayout>
            <div className='flex flex-col items-center'>
                <a href="/pages/user/football/booking">
                    <Card
                        className='text-white mb-5 w-[35rem] h-[7rem] hover:scale-105 hover:border-2 hover:border-red-700 mt-12 h-[7rem] mt-12'
                        style={{
                            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7 )), url('/user/img/football-1.jpg')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <CardHeader className='text-2xl text-center'>
                            <CardTitle>สนามฟุตบอล 1</CardTitle>
                            <CardContent className='text-xl text-center'>สนามฟุตบอล VIP</CardContent>
                        </CardHeader>

                    </Card></a>
                <Card
                    className='text-white mb-5 w-[35rem] h-[7rem] hover:scale-105 hover:border-2 hover:border-red-700'
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7 )), url('/user/img/football-2.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <CardHeader className='text-2xl text-center'>
                        <CardTitle>สนามฟุตบอล 2</CardTitle>
                        <CardContent className='text-xl text-center'>สนามฟุตบอล VIP</CardContent>
                    </CardHeader>
                </Card>
                <Card
                    className='text-white mb-5 w-[35rem] h-[7rem] hover:scale-105 hover:border-2 hover:border-red-700'
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7 )), url('/user/img/football-5.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <CardHeader className='text-2xl text-center'>
                        <CardTitle>สนามฟุตบอล 3</CardTitle>
                        <CardContent className='text-xl text-center'>สนามฟุตบอล regular</CardContent>
                    </CardHeader>
                </Card>
                <Card
                    className='text-white mb-12 w-[35rem] h-[7rem] hover:scale-105 hover:border-2 hover:border-red-700'
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7 )), url('/user/img/football-7.jpg')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <CardHeader className='text-2xl text-center'>
                        <CardTitle>สนามฟุตบอล 4</CardTitle>
                        <CardContent className='text-xl text-center'>สนามฟุตบอล regular</CardContent>
                    </CardHeader>
                </Card>
            </div>
        </MainLayout>
    )
}
