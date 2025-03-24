"use client";
import React, { useState, useEffect } from "react";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";

interface ContactChannel {
    contact_channels_ID?: number;
    name: string;
    data: string;
    page_contact_ID?: number;
}

interface PageContact {
    page_contact_ID: number;
    title: string;
    subtitle: string;
    banner: string;
    title_contact: string;
    subtitle_contact: string;
    title_map: string;
    link_map: string;
    contact_channels: ContactChannel[];
}

export default function ContactAdmin() {
    const [pageData, setPageData] = useState<PageContact>({
        page_contact_ID: 1,
        title: "",
        subtitle: "",
        banner: "",
        title_contact: "",
        subtitle_contact: "",
        title_map: "",
        link_map: "",
        contact_channels: []
    });

    const [bannerFile, setBannerFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/pages/contactpage');
                const data = await response.json();

                // Find the contact page with ID = 1
                const contactPage = data.find((page: PageContact) => page.page_contact_ID === 1);

                if (contactPage) {
                    setPageData(contactPage);
                } else {
                    setMessage({ text: "ไม่พบข้อมูลหน้าติดต่อ ID = 7", type: "error" });
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setMessage({ text: "เกิดข้อผิดพลาดในการดึงข้อมูล", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPageData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setBannerFile(e.target.files[0]);
        }
    };

    const handleContactChange = (index: number, field: string, value: string) => {
        const updatedChannels = [...pageData.contact_channels];
        updatedChannels[index] = { ...updatedChannels[index], [field]: value };
        setPageData(prev => ({ ...prev, contact_channels: updatedChannels }));
    };

    const addContactMethod = () => {
        setPageData(prev => ({
            ...prev,
            contact_channels: [...prev.contact_channels, { name: "", data: "" }]
        }));
    };

    const removeContactMethod = (index: number) => {
        const updatedChannels = pageData.contact_channels.filter((_, i) => i !== index);
        setPageData(prev => ({ ...prev, contact_channels: updatedChannels }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ text: "", type: "" });

        try {
            const formData = new FormData();

            formData.append("page_contact_ID", pageData.page_contact_ID.toString());
            formData.append("title", pageData.title || "");
            formData.append("subtitle", pageData.subtitle || "");
            formData.append("title_contact", pageData.title_contact || "");
            formData.append("subtitle_contact", pageData.subtitle_contact || "");
            formData.append("title_map", pageData.title_map || "");
            formData.append("link_map", pageData.link_map || "");

            // Add contact channels data
            //   formData.append("contact_channels", JSON.stringify(pageData.contact_channels));
            // In your ContactAdmin component's handleSubmit function:
            formData.append("contactchannels", JSON.stringify(pageData.contact_channels));

            // Add banner if changed
            if (bannerFile) {
                formData.append("banner", bannerFile);
            }

            const response = await fetch('/api/pages/contactpage', {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                // setMessage({ text: "บันทึกข้อมูลสำเร็จ", type: "success" });
                alert("บันทึกข้อมูลสำเร็จ");
                window.location.reload();
            } else {
                const errorData = await response.json();
                setMessage({ text: `การบันทึกล้มเหลว: ${errorData.error || "โปรดลองอีกครั้ง"}`, type: "error" });
            }
        } catch (error) {
            console.error("Error saving data:", error);
            setMessage({ text: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", type: "error" });
        } finally {
            setSaving(false);
        }
    };

    const contactOptions = [
        { label: "โทรศัพท์", value: "โทรศัพท์" },
        { label: "LINE", value: "LINE" },
        { label: "Facebook", value: "Facebook" },
        { label: "WhatsApp", value: "WhatsApp" },
        { label: "Instagram", value: "Instagram" },
        { label: "Telegram", value: "Telegram" },
        { label: "อีเมล", value: "อีเมล" },
        { label: "tiktok", value: "tiktok" },
        { label: "ที่อยู่", value: "ที่อยู่" },
        { label: "youtube", value: "youtube" },
        { label: "อื่นๆ", value: "อื่นๆ" },
    ];

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
            <div className="min-h-screen mb-4 w-full">
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6 mt-2">
                        <h1 className="text-2xl font-bold">แก้ไขหน้าติดต่อเรา</h1>
                        <button
                            onClick={handleSubmit}
                            className={`${saving ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded`}
                            disabled={saving}
                        >
                            {saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                        </button>
                    </div>

                    {message.text && (
                        <div className={`p-4 mb-4 mx-auto max-w-5xl ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} rounded`}>
                            {message.text}
                        </div>
                    )}

                    <div className="px-4 pt-6 pb-2 mx-auto bg-gray-300">
                        <div className="mb-2">
                            <label htmlFor="title" className="mr-2 font-semibold">ส่วนหัว</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={pageData.title || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="subtitle" className="mr-2 font-semibold">คําอธิบายส่วนหัว</label>
                            <textarea
                                id="subtitle"
                                name="subtitle"
                                value={pageData.subtitle || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="banner" className="mr-2 font-semibold">รูปภาพแบนเนอร์</label> <span>(ขนาดแนะ 1260px x 400px) สกุลไฟล์ .jpg, .jpeg, .png</span>
                            {pageData.banner && (
                                <div className="mb-2">
                                    <p className="text-sm text-gray-600">รูปปุจจุบัน: {pageData.banner.split('/').pop()}</p>
                                </div>
                            )}
                            <input
                                type="file"
                                id="banner"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="w-full p-2 border border-gray-300 rounded bg-gray-100"
                            />
                        </div>

                        <hr className="my-4 border-2 border-black" />

                        <div className="mb-2">
                            <label htmlFor="title_contact" className="mr-2 font-semibold">การติดต่อ</label>
                            <input
                                type="text"
                                id="title_contact"
                                name="title_contact"
                                value={pageData.title_contact || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="mb-2">
                            <label htmlFor="subtitle_contact" className="mr-2 font-semibold">คำอธิบายการติดต่อ</label>
                            <textarea
                                id="subtitle_contact"
                                name="subtitle_contact"
                                value={pageData.subtitle_contact || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <hr className="my-4 border-2 border-black" />

                        <div className="mb-6">
                            <label htmlFor="title_map" className="mr-2 font-semibold">ส่วนหัวแผนที่</label>
                            <input
                                type="text"
                                id="title_map"
                                name="title_map"
                                value={pageData.title_map || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="link_map" className="mr-2 font-semibold">ลิ้งค์แผนที่</label>
                            <textarea
                                id="link_map"
                                name="link_map"
                                value={pageData.link_map || ""}
                                onChange={handleInputChange}
                                className="w-full p-2 border border-gray-300 rounded"
                                rows={4}
                            ></textarea>
                        </div>

                        <hr className="my-4 border-2 border-black" />

                        <div className="mb-6">
                            <h2 className="text-lg font-bold mb-2">ช่องทางการติดต่อ</h2>

                            {pageData.contact_channels.map((channel, index) => (
                                <div key={index} className="space-y-4 px-8 py-4 mb-6 bg-green-100">
                                    <div>
                                        <label htmlFor={`channel-name-${index}`} className="mr-2 font-semibold">ช่องทางติดต่อ {index + 1}</label>
                                        <select
                                            id={`channel-name-${index}`}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={channel.name || ""}
                                            onChange={(e) => handleContactChange(index, "name", e.target.value)}
                                        >
                                            <option value="">เลือกช่องทางติดต่อ</option>
                                            {contactOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {channel.name === "อื่นๆ" && (
                                        <div>
                                            <label htmlFor={`channel-custom-${index}`} className="mr-2 font-semibold">ระบุช่องทางการติดต่อ</label>
                                            <input
                                                type="text"
                                                id={`channel-custom-${index}`}
                                                className="w-full p-2 border border-gray-300 rounded"
                                                placeholder="ระบุช่องทางการติดต่อ"
                                                onChange={(e) => handleContactChange(index, "name", e.target.value)}
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label htmlFor={`channel-data-${index}`} className="mr-2 font-semibold">ข้อมูลการติดต่อ {index + 1}</label>
                                        <input
                                            type="text"
                                            id={`channel-data-${index}`}
                                            className="w-full p-2 border border-gray-300 rounded"
                                            value={channel.data || ""}
                                            onChange={(e) => handleContactChange(index, "data", e.target.value)}
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            className="text-red-500 hover:text-red-700"
                                            onClick={() => removeContactMethod(index)}
                                        >
                                            ลบช่องทางการติดต่อ
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                onClick={addContactMethod}
                            >
                                เพิ่มช่องทางการติดต่อ
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center justify-end mb-3 mt-6">
                        <button
                            onClick={handleSubmit}
                            className={`${saving ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-700'} text-white font-bold py-2 px-4 rounded`}
                            disabled={saving}
                        >
                            {saving ? 'กำลังบันทึก...' : 'บันทึกการเปลี่ยนแปลง'}
                        </button>
                    </div>
                </div>

            </div>
        </MainLayoutAdmin>
    );
}