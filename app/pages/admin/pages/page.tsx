/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";

// Define types for the data structures
interface Exercise {
    name_exercise: string;
    description: string;
    banner_exercise: File | string | null;
}

interface Promotion {
    title_promotion: string;
    detail_promotion: string;
    banner_promotion: File | string | null;
}

interface Gallery {
    picture_gallery: File | string | null;
}

interface PageData {
    page_home_id: number;
    title: string;
    subtitle: string;
    banner: File | string | null;
    page_home_exercise: Exercise[];
    page_home_promotion: Promotion[];
    page_home_gallery: Gallery[];
}

export default function HomeAdmin() {
    const [pageData, setPageData] = useState<PageData>({
        page_home_id: 1,
        title: "",
        subtitle: "",
        banner: null,
        page_home_exercise: [],
        page_home_promotion: [],
        page_home_gallery: [],
    });

    useEffect(() => {
        const fetchPageData = async () => {
            try {
                const response = await fetch("/api/pages/homepage");
                const data = await response.json();
                console.log(data); // ตรวจสอบข้อมูลที่ได้รับจาก API
                const page = data.find((p: PageData) => p.page_home_id === 1);
                if (page) {
                    setPageData(page);
                }
            } catch (error) {
                console.error("Error fetching page data", error);
            }
        };

        fetchPageData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPageData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        key: keyof PageData,
        index?: number,
        key2?: string
    ) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            if (key === "banner") {
                setPageData(prev => ({ ...prev, banner: file }));
            } else if (index !== undefined && key2 && Array.isArray(pageData[key])) {
                // Create a copy of the array
                const updatedData = [...(pageData[key] as any[])];
                // Update the specific field at the specified index
                updatedData[index] = {
                    ...updatedData[index],
                    [key2]: file
                };
                // Update the state
                setPageData({
                    ...pageData,
                    [key]: updatedData
                });
            }
        }
    };

    // Exercise management
    const handleExerciseChange = (index: number, field: keyof Exercise, value: string) => {
        setPageData((prev) => {
            const updatedExercises = [...prev.page_home_exercise];
            updatedExercises[index] = {
                ...updatedExercises[index],
                [field]: value
            };
            return { ...prev, page_home_exercise: updatedExercises };
        });
    };

    const addExercise = () => {
        setPageData((prev) => ({
            ...prev,
            page_home_exercise: [...prev.page_home_exercise, { name_exercise: "", description: "", banner_exercise: null }],
        }));
    };

    const removeExercise = (index: number) => {
        setPageData((prev) => ({
            ...prev,
            page_home_exercise: prev.page_home_exercise.filter((_, i) => i !== index),
        }));
    };

    // Promotion management
    const handlePromotionChange = (index: number, field: keyof Promotion, value: string) => {
        setPageData((prev) => {
            const updatedPromotions = [...prev.page_home_promotion];
            updatedPromotions[index] = {
                ...updatedPromotions[index],
                [field]: value
            };
            return { ...prev, page_home_promotion: updatedPromotions };
        });
    };

    const addPromotion = () => {
        setPageData((prev) => ({
            ...prev,
            page_home_promotion: [...prev.page_home_promotion, { title_promotion: "", detail_promotion: "", banner_promotion: null }],
        }));
    };

    const removePromotion = (index: number) => {
        setPageData((prev) => ({
            ...prev,
            page_home_promotion: prev.page_home_promotion.filter((_, i) => i !== index),
        }));
    };

    // Gallery management
    const handleGalleryChange = (index: number, file: File | null) => {
        setPageData((prev) => {
            const updatedGallery = [...prev.page_home_gallery];
            updatedGallery[index] = { picture_gallery: file };
            return { ...prev, page_home_gallery: updatedGallery };
        });
    };

    const addGalleryImage = () => {
        setPageData((prev) => ({
            ...prev,
            page_home_gallery: [...prev.page_home_gallery, { picture_gallery: null }],
        }));
    };

    const removeGalleryImage = (index: number) => {
        setPageData((prev) => ({
            ...prev,
            page_home_gallery: prev.page_home_gallery.filter((_, i) => i !== index),
        }));
    };

    // Helper to get file name from path
    const getFileNameFromPath = (path: string) => {
        if (!path) return "";
        const parts = path.split('/');
        return parts[parts.length - 1];
    };

    // Function to render image preview
    // const renderImagePreview = (imagePath: string | null) => {
    //     if (!imagePath) return null;

    //     // For client-side previews of File objects
    //     if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
    //         return (
    //             <div className="mt-2">
    //                 <img src={imagePath} alt="Preview" className="h-20 object-cover rounded" />
    //             </div>
    //         );
    //     }

    //     // For server-stored images
    //     if (typeof imagePath === 'string') {
    //         // Assuming your images are served from a public folder
    //         const publicPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    //         return (
    //             <div className="mt-2">
    //                 <img src={publicPath} alt="Preview" className="h-20 object-cover rounded" />
    //                 <span className="text-sm text-gray-500 ml-2">{getFileNameFromPath(imagePath)}</span>
    //             </div>
    //         );
    //     }
    //     return null;
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        // Append page ID, title, and subtitle
        formData.append("page_home_id", pageData.page_home_id.toString());
        formData.append("title", pageData.title || "");
        formData.append("subtitle", pageData.subtitle || "");

        // Handle banner
        if (pageData.banner instanceof File) {
            formData.append("banner", pageData.banner);
        } else if (typeof pageData.banner === "string") {
            formData.append("existingBanner", pageData.banner);
        }

        // Handle gallery images - include both new and existing images
        pageData.page_home_gallery.forEach((item) => {
            if (item.picture_gallery instanceof File) {
                formData.append("gallery", item.picture_gallery);
            } else if (typeof item.picture_gallery === "string") {
                // Append existing image paths
                formData.append("existingGallery", item.picture_gallery);
            }
        });

        // Process exercises
        const exercisesMetadata = pageData.page_home_exercise.map(exercise => ({
            name: exercise.name_exercise || "",
            description: exercise.description || "",
            banner: exercise.banner_exercise instanceof File
                ? exercise.banner_exercise.name
                : exercise.banner_exercise || null
        }));

        formData.append("page_home_exercise", JSON.stringify(exercisesMetadata));
        // Append exercise files
        pageData.page_home_exercise.forEach(exercise => {
            if (exercise.banner_exercise instanceof File) {
                formData.append("exerciseFiles", exercise.banner_exercise);
            }
        });

        // Process promotions
        const promotionsMetadata = pageData.page_home_promotion.map(promotion => ({
            title: promotion.title_promotion || "",
            detail: promotion.detail_promotion || "",
            banner: promotion.banner_promotion instanceof File
                ? promotion.banner_promotion.name
                : promotion.banner_promotion || null,
        }));

        formData.append("promotions", JSON.stringify(promotionsMetadata));

        // Append promotion files
        pageData.page_home_promotion.forEach(promotion => {
            if (promotion.banner_promotion instanceof File) {
                formData.append("promotionFiles", promotion.banner_promotion);
            }
        });

        console.log('formData entries -------> ', [...formData.entries()]);

        try {
            const response = await fetch("/api/pages/homepage", {
                method: "PUT",
                body: formData,
            });
            const result = await response.json();
            if (response.ok) {
                alert("ข้อมูลถูกอัปเดตเรียบร้อย");
                window.location.reload();
            } else {
                alert(`เกิดข้อผิดพลาด: ${result.error}`);
            }
        } catch (error) {
            console.error("Error updating page", error);
            alert("ไม่สามารถบันทึกข้อมูลได้");
        }
    };

    return (
        <MainLayoutAdmin>
            <div className="p-8 space-y-8">
                <h1 className="text-2xl font-semibold text-black">แก้ไขหน้าแรก</h1>
                <form onSubmit={handleSubmit} className="bg-gray-400 p-6 shadow rounded-lg">
                    <h2 className="text-lg font-semibold">หน้าปก</h2>
                    <div className="mt-2 border p-4 rounded bg-gray-200">
                        <div className="mb-4">
                            <label className="block font-medium mb-1">หัวข้อ</label>
                            <input
                                type="text"
                                name="title"
                                value={pageData.title}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block font-medium mb-1">รายละเอียด</label>
                            <textarea
                                name="subtitle"
                                value={pageData.subtitle}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                                rows={3}
                            ></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="block font-medium mb-1">แบนเนอร์</label>
                            {typeof pageData.banner === 'string' && (
                                <div className="mb-2">
                                    <div className="flex items-center">
                                        <img
                                            src={pageData.banner.startsWith('/') ? 'http://localhost:4000/'+pageData.banner : `http://localhost:4000/${pageData.banner}`}
                                            alt="Current banner"
                                            className="h-24 object-cover rounded mr-2"
                                        />
                                        <span className="text-sm text-gray-600">{getFileNameFromPath(pageData.banner)}</span>
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center">
                                <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600">
                                    <span>{typeof pageData.banner === 'string' ? 'เปลี่ยนแบนเนอร์' : 'เลือกแบนเนอร์'}</span>
                                    <input
                                        type="file"
                                        onChange={(e) => handleFileChange(e, "banner")}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>
                                {pageData.banner instanceof File && (
                                    <span className="ml-2 text-sm text-gray-600">{pageData.banner.name}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Exercise Section */}
                    <div className="border-t pt-6 mt-2">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold">บริการ</h2>
                            <button
                                type="button"
                                onClick={addExercise}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                เพิ่มบริการ
                            </button>
                        </div>

                        {pageData.page_home_exercise.map((exercise, index) => (
                            <div key={index} className="mt-2 border p-4 rounded bg-gray-200">
                                <div className="flex justify-between">
                                    <h3 className="font-medium">บริการที่ {index + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => removeExercise(index)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                    >
                                        ลบ
                                    </button>
                                </div>

                                <div className="mt-2">
                                    <label className="block text-sm font-medium mb-1">ชื่อบริการ</label>
                                    <input
                                        type="text"
                                        value={exercise.name_exercise || ''}
                                        onChange={(e) => handleExerciseChange(index, 'name_exercise', e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div className="mt-2">
                                    <label className="block text-sm font-medium mb-1">รายละเอียด</label>
                                    <textarea
                                        value={exercise.description || ''}
                                        onChange={(e) => handleExerciseChange(index, 'description', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        rows={2}
                                    ></textarea>
                                </div>

                                <div className="mt-2">
                                    <label className="block text-sm font-medium mb-1">รูปภาพ</label>
                                    {typeof exercise.banner_exercise === 'string' && (
                                        <div className="mb-2 flex items-center">
                                            <img
                                                src={exercise.banner_exercise.startsWith('/') ? 'http://localhost:4000/'+exercise.banner_exercise : `http://localhost:4000/${exercise.banner_exercise}`}
                                                alt="Exercise banner"
                                                className="h-16 object-cover rounded mr-2"
                                            />
                                            <span className="text-sm text-gray-600">{getFileNameFromPath(exercise.banner_exercise)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <label className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 text-sm">
                                            <span>{typeof exercise.banner_exercise === 'string' ? 'เปลี่ยนรูป' : 'เลือกรูป'}</span>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, "page_home_exercise", index, "banner_exercise")}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                        {exercise.banner_exercise instanceof File && (
                                            <span className="ml-2 text-sm text-gray-600">{exercise.banner_exercise.name}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Promotion Section */}
                    <div className="border-t pt-6 mt-2">
                        <div className="flex justify-between items-center mb-2">
                            <h2 className="text-lg font-semibold">โปรโมชั่น</h2>
                            <button
                                type="button"
                                onClick={addPromotion}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                เพิ่มโปรโมชั่น
                            </button>
                        </div>

                        {pageData.page_home_promotion.map((promotion, index) => (
                            <div key={index} className="mt-2 border p-4 rounded bg-gray-200">
                                <div className="flex justify-between">
                                    <h3 className="font-medium">โปรโมชั่นที่ {index + 1}</h3>
                                    <button
                                        type="button"
                                        onClick={() => removePromotion(index)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                    >
                                        ลบ
                                    </button>
                                </div>

                                <div className="mt-2">
                                    <label className="block text-sm font-medium mb-1">ชื่อโปรโมชั่น</label>
                                    <input
                                        type="text"
                                        value={promotion.title_promotion || ''}
                                        onChange={(e) => handlePromotionChange(index, 'title_promotion', e.target.value)}
                                        className="w-full p-2 border rounded"
                                    />
                                </div>

                                <div className="mt-2">
                                    <label className="block text-sm font-medium mb-1">รายละเอียด</label>
                                    <textarea
                                        value={promotion.detail_promotion || ''}
                                        onChange={(e) => handlePromotionChange(index, 'detail_promotion', e.target.value)}
                                        className="w-full p-2 border rounded"
                                        rows={2}
                                    ></textarea>
                                </div>

                                <div className="mt-2">
                                    <label className="block text-sm font-medium mb-1">รูปภาพ</label>
                                    {typeof promotion.banner_promotion === 'string' && (
                                        <div className="mb-2 flex items-center">
                                            <img
                                                src={promotion.banner_promotion.startsWith('/') ? 'http://localhost:4000/'+promotion.banner_promotion : `http://localhost:4000/${promotion.banner_promotion}`}
                                                alt="Promotion banner"
                                                className="h-16 object-cover rounded mr-2"
                                            />
                                            <span className="text-sm text-gray-600">{getFileNameFromPath(promotion.banner_promotion)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center">
                                        <label className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 text-sm">
                                            <span>{typeof promotion.banner_promotion === 'string' ? 'เปลี่ยนรูป' : 'เลือกรูป'}</span>
                                            <input
                                                type="file"
                                                onChange={(e) => handleFileChange(e, "page_home_promotion", index, "banner_promotion")}
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                        {promotion.banner_promotion instanceof File && (
                                            <span className="ml-2 text-sm text-gray-600">{promotion.banner_promotion.name}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Gallery Section */}
                    <div className="border-t pt-6 mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">แกลเลอรี่</h2>
                            <button
                                type="button"
                                onClick={addGalleryImage}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                เพิ่มรูปภาพ
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-200">
                            {pageData.page_home_gallery.map((gallery, index) => (
                                <div key={index} className="border p-4 rounded">
                                    {typeof gallery.picture_gallery === 'string' && (
                                        <div className="mb-2">
                                            <img
                                                src={gallery.picture_gallery.startsWith('/') ? 'http://localhost:4000/'+gallery.picture_gallery : `http://localhost:4000/${gallery.picture_gallery}`}
                                                alt="Gallery image"
                                                className="h-32 w-full object-cover rounded"
                                            />
                                            <span className="text-sm text-gray-600 block mt-1 truncate">
                                                {getFileNameFromPath(gallery.picture_gallery)}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-end mt-2">
                                        <label className="inline-flex items-center px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 text-sm">
                                            <span>เลือกรูป</span>
                                            <input 
                                                type="file" 
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] || null;
                                                    handleGalleryChange(index, file);
                                                }} 
                                                className="hidden"
                                                accept="image/*"
                                            />
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(index)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                        >
                                            ลบ
                                        </button>
                                    </div>

                                    {gallery.picture_gallery instanceof File && (
                                        <span className="text-sm text-gray-600 block mt-1 truncate">
                                            {gallery.picture_gallery.name}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-6 flex justify-end">
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 font-medium"
                        >
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </MainLayoutAdmin>
    );
}