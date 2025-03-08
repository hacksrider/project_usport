/* eslint-disable @next/next/no-img-element */
'use client';

import MainLayout from "@/app/components/mainLayout";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function Review() {
    const [score, setScore] = useState<number>(0);
    const [Text_review, setTextreview] = useState<string>("");
    
    const params = useParams<{ id: string }>();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const data = {
            service_ID: params.id,
            score,
            Text_review,
        };

        try {
            // console.log("Submitting review:", data);
            const response = await axios.post("/api/review", data);
            if (response.status === 201) {
                alert("บันทึกข้อมูลสำเร็จ!");
                router.push("/pages/user/purchase_order");
                setScore(0);
                setTextreview("");
            }
        } catch (err) {
            console.error("Error submitting the form:", err);
            alert("เกิดข้อผิดพลาด กรุณาลองอีกครั้ง");
        }
    };

    return (
        <MainLayout>
            <div className="w-[800px] p-8 mx-auto">
                <div className="bg-white shadow-2xl rounded-3xl p-12 relative">
                    <h1 className="text-center text-4xl font-extrabold mb-10 text-gray-900 tracking-wide">
                        เขียนความคิดเห็นของคุณ
                    </h1>

                    {/* Review Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">เขียนรีวิว</h2>
                        <textarea
                            className="w-full p-4 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder="เขียนความคิดเห็นของคุณ..."
                            value={Text_review}
                            onChange={(e) => setTextreview(e.target.value)}
                        ></textarea>

                        <div className="flex items-center mt-4 mb-4">
                            <p className="mr-4 text-lg font-medium">ให้คะแนน:</p>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className={`flex items-center justify-center h-10 w-10 text-yellow-400 text-4xl ${score >= star ? "" : "opacity-20"}`}
                                    onClick={() => setScore(star)}
                                    style={{
                                        WebkitTextStroke: "1px black",
                                        textShadow: "0 0 1px black",
                                    }}
                                >
                                    ★
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleSubmit}
                            className="w-full bg-gradient-to-br from-green-500 to-teal-500 text-white py-3 rounded-md font-bold mt-4 hover:from-green-600 hover:to-teal-600 shadow-md"
                        >
                            ส่งรีวิว
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
