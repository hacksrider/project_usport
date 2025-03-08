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
        page_home_id: 9,
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
                const page = data.find((p: PageData) => p.page_home_id === 9);
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

    const addGalleryImage = (gallery: Gallery[]) => {
        setPageData((prev) => ({
            ...prev,
            page_home_gallery: [...gallery, { picture_gallery: null }],
        }));
    };

    const removeGalleryImage = (index: number) => {
        setPageData((prev) => ({
            ...prev,
            page_home_gallery: prev.page_home_gallery.filter((_, i) => i !== index),
        }));
    };

    // In your handleSubmit function, replace the gallery handling section:

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
                <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg">
                    <label className="block">หัวข้อ</label>
                    <input type="text" name="title" value={pageData.title} onChange={handleInputChange} className="w-full p-2 border rounded" />
                    <label className="block mt-4">รายละเอียด</label>
                    <textarea name="subtitle" value={pageData.subtitle} onChange={handleInputChange} className="w-full p-2 border rounded"></textarea>
                    <label className="block mt-4">แบนเนอร์</label>
                    <input type="file" onChange={(e) => handleFileChange(e, "banner")} className="w-full p-2 border rounded" />

                    {/* Exercise Section */}
                    <h2 className="mt-6 text-lg font-semibold">บริการ</h2>
                    <button type="button" onClick={addExercise} className="mb-2 bg-green-500 text-white px-4 py-2 rounded">เพิ่มบริการ</button>
                    {pageData.page_home_exercise.map((exercise, index) => (
                        <div key={index} className="mt-2 border p-2 rounded flex gap-2">
                            <input 
                                type="text" 
                                value={exercise.name_exercise || ''} 
                                onChange={(e) => handleExerciseChange(index, 'name_exercise', e.target.value)} 
                                className="w-full p-1 border rounded" 
                            />
                            <textarea 
                                value={exercise.description || ''} 
                                onChange={(e) => handleExerciseChange(index, 'description', e.target.value)} 
                                className="w-full p-1 border rounded mt-2"
                            ></textarea>
                            <input 
                                type="file" 
                                onChange={(e) => handleFileChange(e, "page_home_exercise", index, "banner_exercise")} 
                            />
                            <button 
                                type="button" 
                                onClick={() => removeExercise(index)} 
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                ลบ
                            </button>
                        </div>
                    ))}

                    {/* Promotion Section */}
                    <h2 className="mt-6 text-lg font-semibold">โปรโมชั่น</h2>
                    <button type="button" onClick={addPromotion} className="mb-2 bg-green-500 text-white px-4 py-2 rounded">เพิ่มโปรโมชั่น</button>
                    {pageData.page_home_promotion.map((promotion, index) => (
                        <div key={index} className="mt-2 border p-2 rounded flex gap-2">
                            <input 
                                type="text" 
                                value={promotion.title_promotion || ''} 
                                onChange={(e) => handlePromotionChange(index, 'title_promotion', e.target.value)} 
                                className="w-full p-1 border rounded" 
                            />
                            <textarea 
                                value={promotion.detail_promotion || ''} 
                                onChange={(e) => handlePromotionChange(index, 'detail_promotion', e.target.value)} 
                                className="w-full p-1 border rounded mt-2"
                            ></textarea>
                            <input 
                                type="file" 
                                onChange={(e) => handleFileChange(e, "page_home_promotion", index, "banner_promotion")} 
                            />
                            <button 
                                type="button" 
                                onClick={() => removePromotion(index)} 
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                ลบ
                            </button>
                        </div>
                    ))}

                    {/* Gallery Section */}
                    <h2 className="mt-6 text-lg font-semibold">แกลเลอรี่</h2>
                    <button 
                        type="button" 
                        onClick={() => addGalleryImage(pageData.page_home_gallery)} 
                        className="mb-2 bg-green-500 text-white px-4 py-2 rounded"
                    >
                        เพิ่มรูปภาพ
                    </button>
                    {pageData.page_home_gallery.map((gallery, index) => (
                        <div key={index} className="mt-2 border p-2 rounded flex gap-2">
                            <input 
                                type="file" 
                                onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    handleGalleryChange(index, file);
                                }} 
                            />
                            <button 
                                type="button" 
                                onClick={() => removeGalleryImage(index)} 
                                className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                                ลบ
                            </button>
                        </div>
                    ))}

                    <button type="submit" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">บันทึก</button>
                </form>
            </div>
        </MainLayoutAdmin>
    );
}