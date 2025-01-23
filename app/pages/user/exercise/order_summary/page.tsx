/* eslint-disable @next/next/no-img-element */
'use client';

import MainLayout from "@/app/components/mainLayout";
import { useState, useMemo, useEffect } from "react";

export default function OrderSummary() {
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(0);
    const [reviews, setReviews] = useState([
        { id: 1, name: "ผู้ใช้งาน A", content: "บริการดีมาก!", rating: 5 },
        { id: 2, name: "ผู้ใช้งาน B", content: "ฟิตเนสสะอาดและมีอุปกรณ์ครบครัน", rating: 4 },
    ]);
    const [slipFile, setSlipFile] = useState<string | null>(null);

    const formatDate = (date: string) => {
        if (!date) return "";
        const [year, month, day] = date.split("-");
        const thaiYear = parseInt(year, 10) + 543; // แปลงเป็นปีพุทธศักราช
        return `${parseInt(day, 10)}-${parseInt(month, 10)}-${thaiYear}`;
    };

    const [selectedActivities, setSelectedActivities] = useState<
        { name: string; price: number; duration: number; dateStart: string; dateEnd: string }[]
    >([]);
    // const [totalAll, setTotalAll] = useState<number>(0);

    // useEffect(() => {
    //     const activitiesData = sessionStorage.getItem("selectedActivities");
    //     setSelectedActivities(activitiesData ? JSON.parse(activitiesData) : []);

    //     const slipFile = sessionStorage.getItem("uploadedSlip");
    //     if (slipFile) {
    //         setSlipFile(slipFile); // Directly set the base64 string
    //     }
    // }, []);

    useEffect(() => {
        const activitiesData = sessionStorage.getItem("selectedActivities");
        if (activitiesData) {
          setSelectedActivities(JSON.parse(activitiesData));
        }
      
        const slipData = sessionStorage.getItem("uploadedSlip");
        if (slipData) {
          setSlipFile(slipData);
        }
      }, []);
      


    const averageRating = useMemo(() => {
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return parseFloat((totalRating / reviews.length).toFixed(1));
    }, [reviews]);

    const handleReviewSubmit = () => {
        if (reviewText.trim() && reviewRating > 0) {
            setReviews([...reviews, { id: Date.now(), name: "คุณ", content: reviewText, rating: reviewRating }]);
            setReviewText("");
            setReviewRating(0);
        }
    };


    return (
        <MainLayout>
            <div className="w-[800px] p-8 mx-auto">
                <div className="bg-white shadow-2xl rounded-3xl p-12 relative">
                    <h1 className="text-center text-4xl font-extrabold mb-10 text-gray-900 tracking-wide">
                        รายละเอียดการสั่งซื้อ
                    </h1>

                    {/* Order Details */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">รายการที่สั่งซื้อ</h2>
                        <table className="w-full text-left border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200 text-sm">
                                    <th className="w-[25%] px-1 py-3 border border-gray-300 text-left">รายการ</th>
                                    <th className="w-[12%] px-1 py-3 border border-gray-300 text-center">จำนวนวัน</th>
                                    <th className="w-[18%] px-1 py-3 border border-gray-300 text-center">วันที่เริ่ม</th>
                                    <th className="w-[18%] px-1 py-3 border border-gray-300 text-center">วันที่สิ้นสุด</th>
                                    <th className="w-[9%] px-1 py-3 border border-gray-300 text-center">ราคา ฿</th>
                                    <th className="w-[18%] px-1 py-3 border border-gray-300 text-center">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody>
                            {selectedActivities.map((activity, index) => (
                                    <tr key={index}>
                                        <td className="px-1 py-3 border border-gray-300 text-sm">{activity.name}</td>
                                        <td className="px-1 py-3 border border-gray-300 text-sm text-center">{activity.duration}</td>
                                        <td className="px-1 py-3 border border-gray-300 text-sm text-center">{formatDate(activity.dateStart)}</td>
                                        <td className="px-1 py-3 border border-gray-300 text-sm text-center">{formatDate(activity.dateEnd)}</td>
                                        <td className="px-1 py-3 border border-gray-300 text-sm text-center">{activity.price}</td>
                                        <td className="px-1 py-3 border border-gray-300 text-yellow-500 font-bold text-sm text-center">กำลังตรวจสอบ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4">
                            <p className="font-medium">สลิปการโอน:</p>
                            {slipFile ? (
                                <img
                                    src={slipFile} // Use the base64 string directly
                                    alt="Transfer Slip"
                                    className="w-[35%] h-auto rounded-md shadow-md mt-2"
                                />
                            ) : (
                                <p className="text-gray-500 mt-2">ไม่มีสลิปการโอน</p>
                            )}
                        </div>



                    </div>

                    {/* Review Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">เขียนรีวิว</h2>
                        <textarea
                            className="w-full p-4 border border-gray-300 rounded-md text-gray-800 focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder="เขียนความคิดเห็นของคุณ..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                        ></textarea>
                        <div className="flex items-center mt-4 mb-4">
                            <p className="mr-4 text-lg font-medium">ให้คะแนน:</p>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className={`flex items-center justify-center h-10 w-10 text-yellow-400 text-4xl ${reviewRating >= star ? "" : "opacity-20"}`}
                                    onClick={() => setReviewRating(star)}
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
                            onClick={handleReviewSubmit}
                            className="w-full bg-gradient-to-br from-green-500 to-teal-500 text-white py-3 rounded-md font-bold mt-4 hover:from-green-600 hover:to-teal-600 shadow-md"
                        >
                            ส่งรีวิว
                        </button>
                    </div>

                    {/* Reviews Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            รีวิวจากผู้ใช้งาน ({reviews.length})
                        </h2>
                        <div className="mb-6">
                            <p className="text-lg font-medium text-gray-800">คะแนนเฉลี่ย:</p>
                            <p className="text-yellow-400 text-2xl">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <span key={i}>{i < Math.round(averageRating) ? "★" : "☆"}</span>
                                ))}
                            </p>
                            <p className="text-gray-700">{averageRating} / 5</p>
                        </div>
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-gray-100 p-4 rounded-lg mb-4 shadow-md flex items-center"
                            >
                                <img
                                    src="/user/img/hacks.png"
                                    alt="User Avatar"
                                    className="w-12 h-12 rounded-full mr-4"
                                />
                                <div>
                                    <p className="font-bold text-gray-900">{review.name}</p>
                                    <p className="text-yellow-400">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                                        ))}
                                    </p>
                                    <p className="text-gray-700">{review.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
