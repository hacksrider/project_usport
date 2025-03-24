/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import axios from "axios";
import React, { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, } from "@/components/ui/card"
import MainLayout from '@/app/components/mainLayout'
import { useRouter } from 'next/navigation';

interface Field {
    field_ID: number;
    field_name: string;
    status: string;
}

interface Review {
    review_ID: number;
    user_ID: number;
    field_ID: number;
    rating: number;
    comment: string;
    created_at: string;
    user: {
        user_ID: number;
        user_name: string;
        user_lastname: string;
        // Other user fields if needed
    };
    field: {
        field_ID: number;
        field_name: string;
        // Other field fields if needed
    };
}

export default function Field() {
    const [fieldData, setFieldData] = useState<Field[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [valBuffer, setValBuffer] = useState(0);
    const [showReviewsPopup, setShowReviewsPopup] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchFieldData = async () => {
            try {
                const response = await axios.post(`/api/booking`);
                if (response.status === 200) {
                    const dataFromApi = response.data;
                    console.log("Field data:", dataFromApi);
                    setFieldData(dataFromApi);
                }
            } catch (error) {
                console.log("Error fetching field data", error);
            }
        };


        fetchFieldData();
    }, []);  // Use an empty dependency array so this only runs once after initial render

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`/api/booking/reviewField`);
                if (response.status === 200 && response.data.data && response.data.data.data) {
                    console.log("Reviews data:", response.data.data.data);
                    setReviews(Array.isArray(response.data.data.data) ? response.data.data.data : []);
                }
            } catch (error) {
                console.log("Error fetching reviews", error);
                setReviews([]); // ป้องกันค่าเป็น undefined/null
            }
        };
    
        fetchReviews();
    }, []);
    
    


    // Handle click outside popup to close it
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const popupElement = document.getElementById('reviewsPopup');
            const popupContentElement = document.getElementById('reviewsPopupContent');

            if (popupElement && !popupContentElement?.contains(event.target as Node) &&
                popupElement.contains(event.target as Node)) {
                setShowReviewsPopup(false);
            }
        };

        if (showReviewsPopup) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showReviewsPopup]);

    // Handle scroll lock when popup is open
    useEffect(() => {
        if (showReviewsPopup) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showReviewsPopup]);

    const showVal = (getVal: number): void => {
        setValBuffer(getVal);
        router.push(`/pages/user/football/booking?val=${getVal}`);
    }

    const handleListField = () => {
        return fieldData.map((field) => (
            <Card
                key={`field-${field.field_ID}`}
                className={`text-white mb-5 w-[40rem] h-[5rem] hover:scale-105 hover:border-2 hover:border-red-700 transition-all duration-300 ${JSON.parse(field.status) === false ? 'pointer-events-none opacity-50' : ''}`}
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('/user/img/สนามหญ้าเทียม.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(1.2)',
                }}
                onClick={() => JSON.parse(field.status) !== false && showVal(field.field_ID)}
            >
                <CardHeader className='text-2xl text-center'>
                    <CardTitle>{field.field_name}</CardTitle>
                </CardHeader>
            </Card>
        ));
    };


    // Function to render stars based on rating
    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[...Array(5)].map((_, i) => (
                    <svg key={`star-${i}`} className={`h-5 w-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    // Format date from ISO string to Thai locale date
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString;
        }
    };

    return (
        <MainLayout>
            <div className='flex flex-col items-center mt-20'>
                <h1 className="text-5xl font-extrabold text-white mb-12 text-center">
                    เลือกสนามที่คุณต้องการเล่น
                </h1>

                <div className="w-full flex flex-wrap justify-center gap-6">
                    {handleListField()}
                </div>

                {/* รูปภาพ 4 รูป พร้อมข้อความ */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full mt-8 mb-4">
                    <div key="img-1" className="relative h-72 bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
                        style={{ backgroundImage: "url('/user/img/football-1.jpg')", filter: "brightness(1.2)" }}>
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center text-white text-xl font-semibold">

                        </div>
                    </div>

                    <div key="img-2" className="relative h-72 bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
                        style={{ backgroundImage: "url('/user/img/football-2.jpg')", filter: "brightness(1.2)" }}>
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center text-white text-xl font-semibold">

                        </div>
                    </div>

                    <div key="img-3" className="relative h-72 bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
                        style={{ backgroundImage: "url('/user/img/football-3.jpg')", filter: "brightness(1.2)" }}>
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center text-white text-xl font-semibold">

                        </div>
                    </div>

                    <div key="img-4" className="relative h-72 bg-cover bg-center rounded-lg shadow-lg overflow-hidden"
                        style={{ backgroundImage: "url('/user/img/football-4.jpg')", filter: "brightness(1.2)" }}>
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex justify-center items-center text-white text-xl font-semibold">

                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="w-full bg-gray-900 bg-opacity-70 rounded-xl p-8 mt-12 mb-16">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-4xl font-bold text-white">รีวิวจากผู้ใช้</h2>
                        <div className="flex items-center gap-2">
                            <div className="text-3xl font-bold text-white">{averageRating}</div>
                            <div className="flex">
                                {renderStars(parseInt(averageRating))}
                                <span className="text-white ml-2">({reviews.length} รีวิว)</span>
                            </div>
                        </div>
                    </div>

                    {/* Reviews preview list - show only first 6 */}
                    <div className="space-y-6">
                        {reviews.slice(0, 6).map((review) => (
                            <div key={`preview-review-${review.review_ID}`} className="bg-gray-800 rounded-lg p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-xl font-semibold text-white">{review.user?.user_name} {review.user?.user_lastname}</h3>
                                    <span className="text-white text-sm">{review.field.field_name}</span>
                                </div>
                                <div className="mb-2">
                                    {renderStars(review.rating)}
                                </div>
                                <p className="text-white">&quot;{review.comment}&quot;</p>
                            </div>
                        ))}
                    </div>

                    {/* Show all reviews button */}
                    {reviews.length > 6 && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={() => setShowReviewsPopup(true)}
                                className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                            >
                                แสดงรีวิวทั้งหมด ({reviews.length})
                            </button>
                        </div>
                    )}
                </div>

                {/* Reviews Popup */}
                {showReviewsPopup && (
                    <div
                        id="reviewsPopup"
                        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                        style={{ backdropFilter: 'blur(4px)' }}
                    >
                        <div
                            id="reviewsPopupContent"
                            className="bg-gray-900 rounded-xl p-6 w-full max-w-4xl max-h-screen overflow-hidden flex flex-col"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-3xl font-bold text-white">รีวิวทั้งหมด</h2>
                                <button
                                    onClick={() => setShowReviewsPopup(false)}
                                    className="text-gray-400 hover:text-white text-2xl font-bold"
                                >
                                    &times;
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="text-4xl font-bold text-white">{averageRating}</div>
                                <div>
                                    <div className="flex">
                                        {renderStars(parseInt(averageRating))}
                                    </div>
                                    <span className="text-gray-400">จาก {reviews.length} รีวิว</span>
                                </div>
                            </div>

                            {/* Scrollable review list */}
                            <div className="overflow-y-auto pr-2 flex-grow" style={{ maxHeight: 'calc(80vh - 120px)' }}>
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={`popup-review-${review.review_ID}`} className="bg-gray-800 rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <h3 className="text-xl font-semibold text-white">{review.user?.user_name} {review.user?.user_lastname}</h3>
                                                <span className="text-gray-400 text-sm">{formatDate(review.created_at)}</span>
                                            </div>
                                            <div className="mb-2">
                                                {renderStars(review.rating)}
                                            </div>
                                            <p className="text-gray-300">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Close button */}
                            <div className="mt-6 flex justify-center">
                                <button
                                    onClick={() => setShowReviewsPopup(false)}
                                    className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                                >
                                    ปิด
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}