/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
'use client';
import MainLayout from "@/app/components/mainLayout";
import { GetDataExercise, GetAllExercise } from "@/app/interface/pages/exercise/exercise";
import { GetReview, ResGetAllReview } from "@/app/interface/review";
import axios from "axios";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";
import { useState, useEffect } from "react";

export default function PageExercise() {
    const router = useRouter();
    const [dataReview, setDataReview] = useState<GetReview[]>([]);
    const [currentReviews, setCurrentReviews] = useState<GetReview[]>([]); // Initialize as empty array
    const [reviewCount, setReviewCount] = useState<number | null>(null);
    const [showAll, setShowAll] = useState(false);
    const [dataExercise, setDataExercise] = useState<GetDataExercise[]>([]);

    const reviewApi = async () => {
        try {
            const res = await axios.get<ResGetAllReview>("/api/review");
            // @ts-expect-error
            setDataReview(res.data.data.data);
            // @ts-expect-error
            setReviewCount(res.data.data.reviewCount); // ดึงจำนวนรีวิวทั้งหมด
        } catch (error) {
            console.error("Error fetching Review:", error);
        }
    };
    useEffect(() => {
        reviewApi();
    }, []);

    const ExercisePageAPI = async () => {
        try {
            const response = await axios.get<GetAllExercise>("/api/pages/exercisepage");
            setDataExercise(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    useEffect(() => {
        ExercisePageAPI();
    }, []);



    useEffect(() => {
        // เมื่อได้รับข้อมูล review แล้วคัดกรองข้อมูลที่มี Text_review
        if (dataReview && Array.isArray(dataReview) && dataReview.length > 0) {
            const validReviews = dataReview.filter(review => review && review.Text_review);
            // ถ้ามีมากกว่า 3 ให้ slice เอา 3 อันแรก ถ้าน้อยกว่าหรือเท่ากับ 3 ก็ใช้ข้อมูลทั้งหมด
            setCurrentReviews(validReviews.length > 3 ? validReviews.slice(0, 3) : validReviews);
        }
    }, [dataReview]);


    useEffect(() => {
        if (dataReview.length > 3) { // เฉพาะเมื่อ review มากกว่า 3 เท่านั้น
            const interval = setInterval(() => {
                setCurrentReviews(prev => {
                    // หา index ของรีวิวสุดท้ายใน currentReviews ใน dataReview
                    const lastReviewIndex = dataReview.findIndex(r => r.re_ID === prev[2].re_ID);
                    const nextIndex = (lastReviewIndex + 1) % dataReview.length;
                    // เลื่อนรีวิว โดยเอา review ที่ 2 กับ 3 จาก prev แล้วเติมรีวิวใหม่ที่ได้จากการคำนวณ
                    return [prev[1], prev[2], dataReview[nextIndex]];
                });
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [dataReview]);

    const formatTextWithLineBreaks = (text: string) => {
        return text.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < text.split('\n').length - 1 && <br />}
          </React.Fragment>
        ));
      };

    return (
        <MainLayout>
            {dataExercise.map((item) => (
                <div key={item.page_exercise_ID} className="max-w-7xl mx-auto p-6">
                    {/* 🏆 Banner Section */}
                    <motion.div

                        className="relative w-full h-[350px] md:h-[450px] bg-cover bg-center rounded-lg overflow-hidden shadow-lg"
                        style={{ backgroundImage: `url(http://localhost:4000/${item.banner})` }}
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
                                {item.title}
                            </motion.h1>
                            <motion.p
                                className="text-gray-300 text-lg mt-2 max-w-2xl"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.8, duration: 1 }}
                            >
                                {item.subtitle}
                            </motion.p>
                            <motion.button
                                onClick={() => router.push('/pages/user/exercise/pageExercise')}
                                className="mt-6 px-6 py-3 bg-yellow-500 text-white text-lg font-bold rounded-lg shadow-md hover:bg-yellow-600"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                            >
                                สมัครสมาชิกเลย!
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* ⭐ บริการออกกำลังกาย */}
                    <section className="mt-14 text-center">
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-100">🏡 บริการออกกำลังกาย 🏡</h2>
                        {/* <p className="text-gray-600 mt-2">Choose the best place for your stay</p> */}
                       
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                                    {item.exercise_data.map((item1, index) => {
                                        console.log("item1 ==>", item1); return (
                                            <motion.div
                                                key={item1.exercise_data_ID}
                                                className="p-4 border rounded-lg shadow-md bg-white hover:shadow-xl transition overflow-hidden"
                                                initial={{ y: 20, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.3 }}
                                            >
                                                <img src={`http://localhost:4000/${item1.banner}`} alt={item1.name} className="w-full h-48 object-cover rounded-t-lg" />
                                                <div className="p-4 flex items-end justify-between">
                                                    <div className="flex flex-col">
                                                        <h3 className="text-lg font-bold text-left">{item1.name}</h3>
                                                        <p className="text-gray-600 text-left">ราคาเริ่มต้น</p>
                                                    </div>
                                                    <p className="text-green-500 text-xl font-semibold">{item1.price}</p>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </div>
                    </section>

                    {/* ⭐ จุดเด่นของเรา */}
                    <section className="mt-14 text-center">
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-100">🔥 จุดเด่นของเรา 🔥</h2>
                        {/* <p className="text-gray-600 mt-2">เหตุผลที่คุณควรเลือกเรา</p> */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                            {item.exercise_data.map((item2, index) => (
                                <motion.div
                                    key={index}
                                    className="p-6 border rounded-lg shadow-md bg-white hover:shadow-xl transition"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.3 }}
                                >
                                    {/* <h3 className="text-3xl">{item2.icon}</h3> */}
                                    <h3 className="text-lg font-bold mt-2">{item2.name}</h3>
                                    <p className="text-gray-600">{formatTextWithLineBreaks(item2.detail)}</p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* รีวิวจากลูกค้าของเรา */}
                    <section className="mt-14">
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-300 text-center">
                            รีวิวบริการทั้งหมด <button className="hover:text-blue-500" onClick={() => setShowAll(true)}>({reviewCount || 0})</button>
                        </h2>
                        <div className="flex flex-col items-center space-y-6 mt-6">
                            <div className="flex justify-center space-x-8">
                                {currentReviews.length > 0 ? (
                                    currentReviews.map((review, index) => (
                                        <motion.div key={review?.re_ID}
                                            className="p-6 border rounded-lg shadow-md bg-white w-[400px]"
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            transition={{ delay: index * 0.3 }}>
                                            <div className="flex items-center space-x-4">
                                                <img src={review.users.user_profile_picture ? `/${review.users.user_profile_picture}` : "/user/img/user.jpeg"}
                                                    alt={review.users.user_username}
                                                    className="w-12 h-12 rounded-full object-cover border-2" />
                                                <div>
                                                    <h3 className="text-lg font-bold">{review.users.user_name} {review.users.user_lastname}</h3>
                                                    <p className="text-gray-500">บริการที่ซื้อ : {review.service_of_exercise.service_name}</p>
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mt-4">&ldquo;{review?.Text_review} &ldquo;</p>
                                            <div className="mt-2 flex">
                                                <p className="mr-2">คะแนน : {review.score}/5</p>
                                                {[...Array(review?.score)].map((_, i) => (
                                                    <span key={i} className="text-yellow-500">★</span>
                                                ))}
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Loading reviews...</p>
                                )}
                            </div>

                            {showAll && (
                                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-3/4 max-h-[80vh] overflow-y-auto">
                                        <div className="sticky top-0 bg-blue-200 p-4 z-10 shadow-md">
                                            <button onClick={() => setShowAll(false)} className="absolute top-2 right-2 text-gray-700 text-lg">✕</button>
                                            <h4 className="text-body-2xlg font-bold text-dark">รีวิวทั้งหมด ({reviewCount || 0})</h4>
                                        </div>
                                        {dataReview.map((review, key) => (
                                            <div className="flex items-center gap-4.5 px-7.5 py-1 hover:bg-gray-1 dark:hover:bg-dark-2 border-t-2" key={key}>
                                                <div className="relative h-8 w-8 border-2 mr-4 border-gray-300 rounded-full">
                                                    <img
                                                        width={32}
                                                        height={32}
                                                        src={review.users.user_profile_picture ? `http://localhost:4000/${review.users.user_profile_picture}` : "/user/img/user.jpeg"}
                                                        alt={review.users.user_name}
                                                    />
                                                </div>
                                                <div className="w-full">
                                                    <div>
                                                        <div className="flex items-center justify-between">
                                                            <h5 className="font-medium text-[12px] mt-1 leading-[8px] text-dark dark:text-white">
                                                                {review.users.user_name} {review.users.user_lastname} {" "}
                                                                {[...Array(5)].map((_, index) => (
                                                                    <span key={index} className={`${index < review.score ? "text-yellow-400" : "text-gray-300"} text-sm`}>
                                                                        ★
                                                                    </span>
                                                                ))}
                                                            </h5>
                                                            <span className="text-[12px] leading-[8px] text-green-600">
                                                                {review.service_of_exercise.service_name}
                                                            </span>
                                                        </div>
                                                        <p>
                                                            <span className="text-[12px] leading-[8px] text-gray-600">
                                                                {review.Text_review}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                    </section>

                    {/* 📌 ตารางราคา */}
                    <section className="mt-14 text-center">
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-300">💰 ตารางราคา</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                            {item.exercise_data.map((item3, index) => (
                                <motion.div
                                    key={index}
                                    className="p-6 border rounded-lg shadow-md bg-white hover:shadow-xl transition"
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.3 }}
                                >
                                    <p className="text-2xl font-semibold text-blue-600 mb-2">{item3.name}</p>
                                    <h3 className="text-gray-600">{formatTextWithLineBreaks(item3.table_price)}</h3>
                                    {/* <ul className="text-gray-600 mt-2">
                                        {item3.features.map((f, i) => <li key={i}>✔ {f}</li>)}
                                    </ul> */}
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* 🎭 แกลเลอรีรูปภาพ */}
                    <section className="mt-14">
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-300 text-center">📸 บรรยากาศภายใน</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                            {item.exercise_data.map((img, index) => (
                                <motion.div
                                    key={index}
                                    className="rounded-lg overflow-hidden shadow-md"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: index * 0.3 }}
                                >
                                    <img src={`http://localhost:4000/${img.picture}`} alt="Gallery" className="w-full h-64 object-cover" />
                                </motion.div>
                            ))}
                        </div>
                    </section>

                </div>
            ))}

        </MainLayout>
    );
}


