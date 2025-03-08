/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";

export default function EditExercisePage() {
    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [banner, setBanner] = useState<File | null>(null);
    const [exerciseData, setExerciseData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        async function fetchData() {
            const response = await fetch("/api/pages/exercisepage");
            const data = await response.json();
            const exercise = data.find((item: any) => item.page_exercise_ID === 6);
            if (exercise) {
                setTitle(exercise.title);
                setSubtitle(exercise.subtitle);
                setExerciseData(exercise.exercise_data || []);
            }
            setLoading(false);
        }
        fetchData();
    }, []);

    const handleAddExercise = () => {
        setExerciseData([
            ...exerciseData,
            { name: "", price: "", detail: "", table_price: "", banner: null, picture: null },
        ]);
    };

    const handleRemoveExercise = (index: number) => {
        setExerciseData(exerciseData.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("page_exercise_ID", "6");
        formData.append("title", title);
        formData.append("subtitle", subtitle);
        if (banner) formData.append("banner", banner);
        formData.append("exerciseData", JSON.stringify(exerciseData));

        await fetch("/api/pages/exercisepage", {
            method: "PUT",
            body: formData,
        });
        alert("ข้อมูลถูกอัปเดตเรียบร้อย");
        window.location.reload();
    };

    const handleExerciseFileChange = (index: number, field: "banner" | "picture", file: File | null) => {
        const updatedExerciseData = [...exerciseData];
        updatedExerciseData[index][field] = file;
        setExerciseData(updatedExerciseData);
    };

    if (loading) {
        return (
            <MainLayoutAdmin>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-xl">กำลังโหลดข้อมูล...</div>
                </div>
            </MainLayoutAdmin>
        );
    }

    return (
        <MainLayoutAdmin>
            <form onSubmit={handleSubmit} className="p-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900">แก้ไขหน้าบริการออกกำลังกาย</h1>
                    <button
                        type="submit"
                        className="ml-4 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        บันทึกการเปลี่ยนแปลง
                    </button>
                </div>
                <Card className="shadow-lg rounded-lg bg-gray-300">
                    <CardContent className="p-3">
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">ส่วนหัวปก</label>
                            <input
                                className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">คำอธิบายปก</label>
                            <input
                                className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={subtitle}
                                onChange={(e) => setSubtitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">แบนเนอร์รูปปก</label>
                            <input
                                type="file"
                                onChange={(e) => setBanner(e.target.files?.[0] || null)}
                                className="mt-2 block w-full px-4 py-2 border rounded-md text-gray-800 bg-white"
                            />
                        </div>
                        <hr className="border-2 border-gray-700" />
                        <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-4">ข้อมูลบริการ</h2>
                        {exerciseData.map((item, index) => (
                            <Card key={index} className="p-3 mb-2 bg-green-100 border rounded-lg shadow-sm">
                                <CardContent>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700">ชื่อบริการ</label>
                                        <input
                                            placeholder="Name"
                                            value={item.name}
                                            onChange={(e) => {
                                                const newExerciseData = [...exerciseData];
                                                newExerciseData[index].name = e.target.value;
                                                setExerciseData(newExerciseData);
                                            }}
                                            className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700">รูปภาพบริการ</label>
                                        <input
                                            type="file"
                                            onChange={(e) => handleExerciseFileChange(index, "banner", e.target.files?.[0] || null)}
                                            className="mt-2 block w-full px-4 py-2 border rounded-md bg-white"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700">ราคาเริ่มต้น</label>
                                        <input
                                            placeholder="Price"
                                            value={item.price}
                                            onChange={(e) => {
                                                const newExerciseData = [...exerciseData];
                                                newExerciseData[index].price = e.target.value;
                                                setExerciseData(newExerciseData);
                                            }}
                                            className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700">รายละเอียด</label>
                                        <input
                                            placeholder="Detail"
                                            value={item.detail}
                                            onChange={(e) => {
                                                const newExerciseData = [...exerciseData];
                                                newExerciseData[index].detail = e.target.value;
                                                setExerciseData(newExerciseData);
                                            }}
                                            className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700">ราคา</label>
                                        <input
                                            placeholder="Table Price"
                                            value={item.table_price}
                                            onChange={(e) => {
                                                const newExerciseData = [...exerciseData];
                                                newExerciseData[index].table_price = e.target.value;
                                                setExerciseData(newExerciseData);
                                            }}
                                            className="mt-2 block w-full px-4 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="block text-sm font-medium text-gray-700">รูปภาพบรรยากาศ</label>
                                        <input
                                            type="file"
                                            onChange={(e) => handleExerciseFileChange(index, "picture", e.target.files?.[0] || null)}
                                            className="mt-2 block w-full px-4 py-2 border rounded-md bg-white"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleRemoveExercise(index)}
                                        className="mt-4 bg-red-500 text-white py-2 px-6 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        Remove
                                    </button>
                                </CardContent>
                            </Card>
                        ))}
                        <div className="mt-6 flex justify-between">
                            <button
                                onClick={handleAddExercise}
                                className="bg-green-500 text-white py-2 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                เพิ่มบริการ
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="ml-4 bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                บันทึกการเปลี่ยนแปลง
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </MainLayoutAdmin>
    );
}
