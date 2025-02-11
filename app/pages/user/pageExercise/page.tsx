/* eslint-disable @next/next/no-img-element */
'use client';
import MainLayout from "@/app/components/mainLayout";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const reviews = [
    { name: "คุณเอก", review: "ที่นี่บริการดีมาก เครื่องออกกำลังกายใหม่และสะอาด" },
    { name: "คุณนิด", review: "คลาสโยคะดีมาก ทำให้สุขภาพดีขึ้นเยอะ" },
    { name: "คุณเบียร์", review: "ชอบสระว่ายน้ำที่นี่ น้ำใสสะอาดสุดๆ" },
    { name: "คุณออม", review: "สถานที่สะอาด พนักงานบริการดีมาก" },
    { name: "คุณมาร์ค", review: "มีคลาสเทรนนิ่งดีมาก แนะนำเลย" },
    { name: "คุณจอย", review: "มีโปรโมชันคุ้มสุดๆ สมัครรายปีราคาดีมาก" },
];
export default function PageExercise() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % reviews.length);
        }, 3000); // ✅ เลื่อนทุก 3 วินาที
        return () => clearInterval(interval);
    }, []);

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto p-6">
                {/* 🏆 Banner Section */}
                <motion.div
                    className="relative w-full h-[350px] md:h-[450px] bg-cover bg-center rounded-lg overflow-hidden shadow-lg"
                    style={{ backgroundImage: "url('/images/banner.jpg')" }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center text-center p-4">
                        <motion.h1
                            className="text-white text-4xl md:text-6xl font-bold"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                        >
                            ยกระดับสุขภาพของคุณกับเรา!
                        </motion.h1>
                        <motion.p
                            className="text-gray-300 text-lg mt-2 max-w-2xl"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.8, duration: 1 }}
                        >
                            ฟิตเนสระดับพรีเมียม, คลาสโยคะ, สระว่ายน้ำมาตรฐาน พร้อมเทรนเนอร์มืออาชีพ
                        </motion.p>
                        <motion.button
                            className="mt-6 px-6 py-3 bg-yellow-500 text-white text-lg font-bold rounded-lg shadow-md hover:bg-yellow-600"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.5 }}
                        >
                            สมัครสมาชิกเลย!
                        </motion.button>
                    </div>
                </motion.div>

                {/* ⭐ จุดเด่นของเรา */}
                <section className="mt-14 text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-300">🔥 จุดเด่นของเรา 🔥</h2>
                    <p className="text-gray-600 mt-2">เหตุผลที่คุณควรเลือกเรา</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                        {[
                            { icon: "🏋️‍♂️", title: "ฟิตเนสทันสมัย", desc: "เครื่องออกกำลังกายใหม่ล่าสุด พร้อมอุปกรณ์ครบครัน" },
                            { icon: "🏊‍♀️", title: "สระว่ายน้ำสะอาด", desc: "สระน้ำมาตรฐาน พร้อมระบบกรองน้ำคุณภาพสูง" },
                            { icon: "🧘‍♀️", title: "คลาสโยคะ", desc: "คลาสโยคะสำหรับทุกระดับ พร้อมเทรนเนอร์มืออาชีพ" },
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                className="p-6 border rounded-lg shadow-md bg-white hover:shadow-xl transition"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.3 }}
                            >
                                <h3 className="text-3xl">{feature.icon}</h3>
                                <h3 className="text-lg font-bold mt-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 💬 รีวิวจากลูกค้า */}
                <section className="mt-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-300 text-center">
                💬 รีวิวจากลูกค้าของเรา
            </h2>

            {/* ✅ รีวิวเลื่อนแบบอินฟินิตี้ */}
            <div className="relative w-full overflow-hidden mt-6">
                <motion.div
                    className="flex gap-6"
                    animate={{ x: `-${index * 33.33}%` }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    style={{ width: `${reviews.length * 33.33}%` }}
                >
                    {[...reviews, ...reviews].map((review, i) => (
                        <div key={i} className="w-1/3 flex-shrink-0 p-4 border rounded-lg shadow-md bg-white">
                            <p className="italic">{review.review}</p>
                            <p className="mt-2 text-right text-sm font-semibold">- {review.name}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>

                {/* 📌 ตารางราคา */}
                <section className="mt-14 text-center">
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-300">💰 ตารางราคา</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                        {[
                            { plan: "รายวัน", price: "150฿", features: ["เข้าใช้บริการ 1 วัน", "ฟิตเนส + สระว่ายน้ำ"] },
                            { plan: "รายเดือน", price: "1,200฿", features: ["เข้าใช้บริการ 30 วัน", "คลาสโยคะ + ฟิตเนส + สระว่ายน้ำ"] },
                            { plan: "รายปี", price: "9,900฿", features: ["เข้าใช้บริการ 365 วัน", "ทุกคลาส + ส่วนลดพิเศษ"] },
                        ].map((item, index) => (
                            <motion.div
                                key={index}
                                className="p-6 border rounded-lg shadow-md bg-white hover:shadow-xl transition"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.3 }}
                            >
                                <h3 className="text-xl font-bold">{item.plan}</h3>
                                <p className="text-2xl font-semibold text-blue-600">{item.price}</p>
                                <ul className="text-gray-600 mt-2">
                                    {item.features.map((f, i) => <li key={i}>✔ {f}</li>)}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </section>


                {/* 🎭 แกลเลอรีรูปภาพ */}
                <section className="mt-14">
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-300 text-center">📸 บรรยากาศภายใน</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                        {["fitness-1.jpg", "fitness-2.jpg", "member_card.jpg"].map((img, index) => (
                            <motion.div
                                key={index}
                                className="rounded-lg overflow-hidden shadow-md"
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: index * 0.3 }}
                            >
                                <img src={`/user/img/${img}`} alt="Gallery" className="w-full h-64 object-cover" />
                            </motion.div>
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
