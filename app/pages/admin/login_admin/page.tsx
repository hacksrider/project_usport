'use client';

import Image from "next/image";

export default function LoginAdmin() {
    return (
        <div
            className="relative flex items-center justify-center p-4 min-h-screen bg-cover bg-center"
            style={{ backgroundImage: "url('/user/img/football-5.jpg')" }}
        >
            {/* Overlay to fade background image */}
            <div className="absolute inset-0 bg-black opacity-50"></div>
            
            <div className="relative w-full max-w-sm p-6 space-y-6 bg-white bg-opacity-90 border rounded-lg shadow-md">
                <Image src="/user/img/logo-2.jpg" alt="Login" width={96} height={96} className="mx-auto" />
                
                <div className="space-y-2">
                    <label htmlFor="text" className="block text-sm font-medium">Username</label>
                    <input
                        type="text"
                        id="username"
                        placeholder="Username"
                        className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                    />
                </div>

                <div className="space-y-2 mt-4">
                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                    <div className="flex justify-between items-center">
                        <input
                            type="password"
                            id="password"
                            placeholder="Password"
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                        />
                    </div>
                </div>
                <button className="w-full py-2 mt-6 font-bold text-white bg-black rounded-md hover:bg-gray-800">Login</button>
            </div>
        </div>
    );
}
