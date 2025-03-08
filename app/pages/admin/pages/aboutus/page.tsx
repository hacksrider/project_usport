/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";

export default function About_admin() {
  const [pageAbout, setPageAbout] = useState({
    page_about_id: 5,
    title: "",
    detail: "",
    detail_usport1: "",
    detail_usport2: "",
    banner: "",
    video: "",
    exerciseTopics: [{ id: Date.now(), title: "", detail: "" }],
  });

  // ฟังก์ชันสำหรับโหลดข้อมูลเมื่อหน้าโหลด
  useEffect(() => {
    const fetchPageAbout = async () => {
      try {
        const response = await fetch("/api/pages/aboutuspage");
        const data = await response.json();
        const pageData = data.find((page: any) => page.page_about_id === 5);
        if (pageData) {
          setPageAbout({
            ...pageData,
            exerciseTopics: pageData.exercise_about.map((exercise: any) => ({
              id: exercise.exercise_about_id,
              title: exercise.title,
              detail: exercise.detail,
            })),
          });
        }
      } catch (error) {
        console.error("Error fetching page about data", error);
      }
    };

    fetchPageAbout();
  }, []);

  const addExerciseTopic = () => {
    setPageAbout({
      ...pageAbout,
      exerciseTopics: [...pageAbout.exerciseTopics, { id: Date.now(), title: "", detail: "" }],
    });
  };

  const removeExerciseTopic = (id: number) => {
    setPageAbout({
      ...pageAbout,
      exerciseTopics: pageAbout.exerciseTopics.filter((topic) => topic.id !== id),
    });
  };

  const handleInputChange = (id: number, field: string, value: string) => {
    setPageAbout({
      ...pageAbout,
      exerciseTopics: pageAbout.exerciseTopics.map((topic) =>
        topic.id === id ? { ...topic, [field]: value } : topic
      ),
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("page_about_id", pageAbout.page_about_id.toString());
    formData.append("title", pageAbout.title);
    formData.append("detail", pageAbout.detail);
    formData.append("detail_usport1", pageAbout.detail_usport1);
    formData.append("detail_usport2", pageAbout.detail_usport2);
    // @ts-expect-error
    if (pageAbout.banner instanceof File) {
      formData.append("banner", pageAbout.banner);
    }
    // @ts-expect-error
    if (pageAbout.video instanceof File) {
      formData.append("video", pageAbout.video);
    }


    // เพิ่มข้อมูล exercise topics
    formData.append("exercises", JSON.stringify(pageAbout.exerciseTopics));

    // ส่งข้อมูลไปที่ API สำหรับอัปเดตข้อมูล
    try {
      const response = await fetch(`/api/pages/aboutuspage`, {
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
      console.error("Error submitting data", error);
      alert("ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  return (
    <MainLayoutAdmin>
      <div className="p-8">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-semibold ml-2 text-black">แก้ไขหน้าเกี่ยวกับเรา</h1>
        <div className="text-right">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>
      <div className="w-full bg-gray-300 ml-2 p-6 rounded shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* ตาราง page_about คอลัม title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">หัวข้อ</label>
              <input
                type="text"
                className="w-full p-2 mt-2 border rounded"
                value={pageAbout.title}
                onChange={(e) => setPageAbout({ ...pageAbout, title: e.target.value })}
              />
            </div>
            {/* ตาราง page_about คอลัม detail */}
            <div>
              <label className="block text-sm font-medium text-gray-700">รายละเอียด</label>
              <textarea
                className="w-full p-2 mt-2 border rounded"
                value={pageAbout.detail || ""} // กรณีค่าเป็น null ใช้ "" แทน
                onChange={(e) => setPageAbout({ ...pageAbout, detail: e.target.value })}
              />
            </div>
            {/* ตาราง page_about คอลัม banner */}
            <div>
              <label className="block text-sm font-medium text-gray-700">รูปภาพแบนเนอร์</label>
              <input
                type="file"
                className="w-full p-2 mt-2 border rounded bg-slate-50"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  if (file) {
                    // @ts-expect-error
                    setPageAbout({ ...pageAbout, banner: file }); // เก็บเป็น File Object
                  }
                }}
              />
            </div>
            <hr className="border-gray-400 bottom-2" />
            {/* ตาราง page_about คอลัม detail_usport1 */}
            <div>
              <h1 className="text-xl font-semibold text-black mb-2">เรื่องราวของเรา</h1>
              <label className="block text-sm font-medium text-gray-700">รายละเอียดกีฬา 1</label>
              <textarea
                className="w-full p-2 mt-2 border rounded"
                value={pageAbout.detail_usport1 || ""} // กรณีค่าเป็น null ใช้ "" แทน
                onChange={(e) => setPageAbout({ ...pageAbout, detail_usport1: e.target.value })}
              />
            </div>
            {/* ตาราง page_about คอลัม detail_usport2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700">รายละเอียดกีฬา 2</label>
              <textarea
                className="w-full p-2 mt-2 border rounded"
                value={pageAbout.detail_usport2 || ""} // กรณีค่าเป็น null ใช้ "" แทน
                onChange={(e) => setPageAbout({ ...pageAbout, detail_usport2: e.target.value })}
              />
            </div>
            <hr className="border-gray-400 bottom-2" />
            {/* ตาราง page_about คอลัม video */}
            <div>
              <label className="block text-sm font-medium text-gray-700">คลิปวิดีโอ</label>
              <input
                type="file"
                className="w-full p-2 mt-2 border rounded bg-slate-50"
                onChange={(e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  if (file) {
                    // @ts-expect-error
                    setPageAbout({ ...pageAbout, video: file }); // เก็บเป็น File Object
                  }
                }}

              />
            </div>
            <hr className="border-gray-400 bottom-2" />

            <div>
              <h2 className="text-lg font-semibold text-gray-800">หัวข้อการออกกำลังกาย</h2>
              {pageAbout.exerciseTopics.map((topic, topicIndex) => (
                <div key={topicIndex} className="bg-green-100 p-4 rounded shadow mt-4 relative">
                  {/* ตาราง exercise_about คอลัม title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">ชื่อหัวข้อการออกกำลังกาย {topicIndex + 1}</label>
                    <input
                      type="text"
                      className="w-full p-2 mt-2 border rounded"
                      value={topic.title}
                      onChange={(e) => handleInputChange(topic.id, "title", e.target.value)}
                    />
                  </div>
                  {/* ตาราง exercise_about คอลัม detail */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">รายละเอียดการออกกำลังกาย {topicIndex + 1}</label>
                    <textarea
                      className="w-full p-2 mt-2 border rounded"
                      value={topic.detail}
                      onChange={(e) => handleInputChange(topic.id, "detail", e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-red-500 text-sm"
                      onClick={() => removeExerciseTopic(topic.id)}
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                onClick={addExerciseTopic}
              >
                เพิ่มหัวข้อการออกกำลังกาย
              </button>
            </div>
            <div className="text-right">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              >
                บันทึกการเปลี่ยนแปลง
              </button>
            </div>
          </div>
        </form>
      </div>
      </div>
    </MainLayoutAdmin>
  );
}
