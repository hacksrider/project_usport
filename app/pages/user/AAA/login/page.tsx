'use client';

import MainLayout from "@/app/components/mainLayout";
// import Link from 'next/link';
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
    const { status } = useSession();
    const router = useRouter()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get('callbackUrl') || '/pages/user/pages'
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    
    useEffect(() => {
        if(status === 'authenticated') {
            router.push(callbackUrl)
        }
    })
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const result = await signIn('user', {
                redirect: false,
                username,
                password
            })

            if (result?.error) {
                setError(result.error);
                return false
            } else {
                console.log("pass")
                router.push(callbackUrl);
            }
        } catch (err) { console.log('error from user login ====>>>> ', err, ' <<<<====') }
    }

    return (
        <MainLayout>
            <div className="flex items-center justify-center p-4">
                <div className="w-full max-w-sm p-6 space-y-6 bg-white border rounded-lg shadow-md">
                    <Image src="/user/img/logo-2.jpg" alt="Login" width={96} height={96} className="mx-auto" />
                    <p className="text-center text-gray-600">โปรดระบุชื่อผู้ใช้และรหัสผ่าน</p>

                    <div className="space-y-2">
                        <label htmlFor="Username" className="block text-sm font-medium">ชื่อผู้ใช้/อีเมล</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            type="text"
                            id="Username"
                            placeholder="ชื่อผู้ใช้/อีเมล"
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>

                    <div className="space-y-2 mt-4">
                        <label htmlFor="Password" className="block text-sm font-medium">รหัสผ่าน</label>
                        <div className="flex justify-between items-center">
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                type="password"
                                id="Password"
                                placeholder="รหัสผ่าน"
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                            />
                        </div>
                        <a onClick={() => router.push('/pages/user/AAA/forgot-pass')} className="pt-2 mt-2 text-sm text-blue-500 hover:underline">ลืมรหัสผ่าน?</a>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        onClick={onSubmit} 
                        type="button" className="w-full py-2 mt-6 font-bold text-white bg-black rounded-md hover:bg-gray-800">เข้าสู่ระบบ</button>

                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            Dont have an account?{' '}
                            <a onClick={() => router.push('/pages/user/AAA/register')} className="text-blue-500 hover:underline">สร้างบัญชี</a>
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}