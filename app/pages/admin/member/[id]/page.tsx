/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import MainLayoutAdmin from "@/app/components/mainLayoutAdmin";

export default function EditMember() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [formData, setFormData] = useState({
    user_name: "",
    user_lastname: "",
    user_date_of_birth: "",
    user_email: "",
    user_tel: "",
    user_username: "",
    status_of_VIP: false,
    ID_card_photo: null as File | null,
    accom_rent_contrac_photo: null as File | null,
    user_profile_picture: null as File | null,
  });

  const [previewImages, setPreviewImages] = useState({
    ID_card_photo: "/user/img/noimage.jpg",
    accom_rent_contrac_photo: "/user/img/noimage.jpg",
    user_profile_picture: "/user/img/user.jpeg",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/user/${userId}`);
        setFormData(response.data);
        setPreviewImages({
          ID_card_photo: response.data.ID_card_photo ? `/${response.data.ID_card_photo}` : "/user/img/noimage.jpg",
          accom_rent_contrac_photo: response.data.accom_rent_contrac_photo ? `/${response.data.accom_rent_contrac_photo}` : "/user/img/noimage.jpg",
          user_profile_picture: response.data.user_profile_picture ? `/${response.data.user_profile_picture}` : "/user/img/user.jpeg",
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("ไม่สามารถดึงข้อมูลสมาชิกได้");
      }
    };
    fetchUser();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else if (type === "file") {
      const file = files ? files[0] : null;
      setFormData({
        ...formData,
        [name]: file,
      });

      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewImages((prev) => ({
            ...prev,
            [name]: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleRemoveFile = (fieldName: keyof typeof formData) => {
    setFormData({
      ...formData,
      [fieldName]: null,
    });
    setPreviewImages((prev) => ({
      ...prev,
      [fieldName]: "/user/img/noimage.jpg",
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const form = new FormData();
  
      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          form.append(key, value ? "true" : "false");
        } else if (value instanceof File) {
          form.append(key, value);
        } else if (typeof value === "string" || value === null) {
          form.append(key, value || ""); // ใช้ "" สำหรับค่าที่เป็น null
        }
      });
  
      // ระบุสถานะการลบรูปภาพ
      form.append("isAccomPhotoDeleted", formData.accom_rent_contrac_photo === null ? "true" : "false");
  
      await axios.put(`/api/user/${userId}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("บันทึกข้อมูลสำเร็จ!");
      router.push("/pages/admin/member");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };
  

  return (
    <MainLayoutAdmin>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-3 text-black">แก้ไขข้อมูลสมาชิก</h1>
      </div>
      <div className="max-w-5xl mx-auto bg-gray-300 p-10 rounded-lg shadow-xl">
        <form
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          onSubmit={handleFormSubmit}>

          {/* User Name */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700">ชื่อ</label>
            <input
              type="text"
              name="user_name"
              value={formData.user_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* User Lastname */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700">นามสกุล</label>
            <input
              type="text"
              name="user_lastname"
              value={formData.user_lastname}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* User Date of Birth */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700">วันเดือนปีเกิด</label>
            <input
              type="date"
              name="user_date_of_birth"
              value={formData.user_date_of_birth}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* User Email */}
          <div className="col-span-2">
            <label className="block text-sm font-semibold text-gray-700">อีเมล</label>
            <input
              type="email"
              name="user_email"
              value={formData.user_email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* User Telephone */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700">เบอร์โทร</label>
            <input
              type="tel"
              name="user_tel"
              value={formData.user_tel}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* User Username */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700">ชื่อผู้ใช้</label>
            <input
              type="text"
              name="user_username"
              value={formData.user_username}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* ID Card Photo */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700">รูปบัตรประชาชน</label>
            <div className="flex items-center gap-4">
            <img
                src={previewImages.ID_card_photo}
                alt="ID Card Preview"
                className="w-16 h-16 rounded-md border border-gray-800 object-cover cursor-pointer"
                onClick={() => window.open(previewImages.ID_card_photo, "_blank")}
              />
              <input
                type="file"
                name="ID_card_photo"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Accommodation Rental Contract Photo */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700">รูปหลักฐานที่พักอาศัย</label>
            <div className="flex items-center gap-4">
            <img
                src={previewImages.accom_rent_contrac_photo}
                alt="Accommodation Proof Preview"
                className="w-16 h-16 rounded-md border border-gray-800 object-cover cursor-pointer"
                onClick={() => window.open(previewImages.accom_rent_contrac_photo, "_blank")}
              />
              <input
                type="file"
                name="accom_rent_contrac_photo"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => handleRemoveFile("accom_rent_contrac_photo")}
                className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                ลบ
              </button>
            </div>
          </div>

          {/* User Profile Picture */}
          <div className="col-span-1">
            <label className="block text-sm font-semibold text-gray-700">รูปโปรไฟล์</label>
            <div className="flex items-center gap-4">
            <img
                src={previewImages.user_profile_picture}
                alt="Profile Picture Preview"
                className="w-16 h-16 rounded-full border border-gray-800 object-cover cursor-pointer"
                onClick={() => window.open(previewImages.user_profile_picture, "_blank")}
              />
              <input
                type="file"
                name="user_profile_picture"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          
          {/* Status of VIP */}
          <div className="col-span-3 flex items-center gap-4">
            <label className="block text-sm font-semibold text-gray-700">สถานะ VIP</label>
            <input
              type="checkbox"
              name="status_of_VIP"
              checked={formData.status_of_VIP}
              onChange={handleInputChange}
              className="h-6 w-6 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">สมาชิก VIP</span>
          </div>
          {/* Submit Button */}
          <div className="col-span-3 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push("/pages/admin/member")}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700"
            >
              บันทึก
            </button>
          </div>
        </form>
      </div>
    </MainLayoutAdmin>
  );
}
