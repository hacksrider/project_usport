/* eslint-disable @next/next/no-img-element */
'use client';
import MainLayout from "@/app/components/mainLayout";
import { GetReview, ResGetAllReview } from "@/app/interface/review";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PageExercise() {
    const router = useRouter();
    const [dataReview, setDataReview] = useState<GetReview[]>([]);
    const [currentReviews, setCurrentReviews] = useState<GetReview[]>([]); // Initialize as empty array

    const reviewApi = async () => {
        try {
            const res = await axios.get<ResGetAllReview>("/api/review");
            setDataReview(res.data.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    useEffect(() => {
        reviewApi();
    }, []);

    useEffect(() => {
        if (dataReview && Array.isArray(dataReview) && dataReview.length > 0) {
            // Filter out invalid or incomplete entries
            const validReviews = dataReview.filter(review => review && review.Text_review);
            setCurrentReviews(validReviews.slice(0, 3)); // Set the first 3 valid reviews
        }
    }, [dataReview]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (dataReview && dataReview.length > 0 && currentReviews.length > 0) { // Check if dataReview and currentReview exist and not empty
                setCurrentReviews(prev => {
                    const nextReviews = [
                        prev[1],
                        prev[2],
                        dataReview[(dataReview.indexOf(prev[2]) + 1) % dataReview.length]
                    ];
                    return nextReviews;
                });
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [dataReview, currentReviews]); // Add currentReviews here


    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto p-6">
                {/* 🏆 Banner Section */}
                <motion.div
                    className="relative w-full h-[350px] md:h-[450px] bg-cover bg-center rounded-lg overflow-hidden shadow-lg"
                    style={{ backgroundImage: "url('/user/img/fitness-2.jpg')" }}
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
                            onClick={() => router.push('/pages/user/exercise')}
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

                {/* รีวิวจากลูกค้าของเรา */}
                <section className="mt-14">
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-300 text-center">
                        รีวิวจากลูกค้าของเรา
                    </h2>
                    <div className="flex justify-center space-x-8 mt-6">
                        {currentReviews.length > 0 ? (
                            currentReviews.map((review, index) => (
                                <motion.div key={review?.re_ID}
                                    className="p-6 border rounded-lg shadow-md bg-white w-[400px]"
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    transition={{ delay: index * 0.3 }}>
                                    <div className="flex items-center space-x-4">
                                        <img src={review.users.user_profile_picture ? `/${review.users.user_profile_picture}` : "/user/img/user.jpeg"} alt={review.users.user_username} className="w-12 h-12 rounded-full object-cover border-2" /> {/* เพิ่มรูปผู้ใช้ */}
                                        <div>
                                            <h3 className="text-lg font-bold">{review.users.user_name} {review.users.user_lastname}</h3> {/* เพิ่มชื่อผู้ใช้ */}
                                            <p className="text-gray-500">บริการที่ซื้อ : {review.service_of_exercise.service_name}</p> {/* เพิ่มชื่อบริการ */}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 mt-4">&ldquo;{review?.Text_review} &ldquo;</p>
                                    <div className="mt-2 flex">
                                        <p className="mr-2">คะแนน : {review.score}/5</p>

                                        {[...Array(review?.score)].map((_, i) => ( // ใช้คะแนนดาวจากข้อมูล
                                            <span key={i} className="text-yellow-500">★</span>
                                        ))}
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="text-gray-500">Loading reviews...</p>
                        )}
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


