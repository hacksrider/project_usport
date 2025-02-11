// export default EditProfileForm;
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
//นี่คือหน้า Edit User Profile
"use client";
import axios from "axios";
import MainLayout from "@/app/components/mainLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserInterface } from "@/app/interface/user";

const EditProfileForm: React.FC = () => {
  const { data, update } = useSession();
  const userData = data as UserInterface;
  const [formData, setFormData] = useState({
    user_ID: userData?.user?.id || null,
    user_name: "",
    user_lastname: "",
    user_tel: "",
    user_profile_picture: "",
    ID_card_photo: "",
    isCardChange: false,
    isContractChange: false,
    isProfileChange: false
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewIDCard, setPreviewIDCard] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    if (formData.user_ID) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`/api/user/${formData.user_ID}`);
          if (response.status === 200) {
            const userData = response.data;
            setFormData({
              ...formData,
              user_name: userData.user_name || "",
              user_lastname: userData.user_lastname || "",
              user_tel: userData.user_tel || "",
              user_profile_picture: userData.user_profile_picture || "",
              ID_card_photo: userData.ID_card_photo || "",
            });
            setPreviewImage(userData.user_profile_picture ? `/${userData.user_profile_picture}` : null);
            setPreviewIDCard(userData.ID_card_photo ? `/${userData.ID_card_photo}` : null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    }
  }, [formData, formData.user_ID]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file,
        isCardChange: name == "ID_card_photo" ? true : formData.isCardChange,
        isProfileChange: name == "user_profile_picture" ? true : formData.isCardChange,
      });
      if (name === "user_profile_picture") {
        setPreviewImage(URL.createObjectURL(file));
      }
      if (name === "ID_card_photo") {
        setPreviewIDCard(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const apiFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (value instanceof File) {
        apiFormData.append(key, value);
      } else {
        apiFormData.append(key, String(value));
      }
    });

    // ส่งค่ารูปภาพเดิมถ้าไม่ได้เปลี่ยน
    if (!formData.user_profile_picture) {
      apiFormData.append("user_profile_picture", formData.user_profile_picture || "");
    }
    if (!formData.ID_card_photo) {
      apiFormData.append("ID_card_photo", formData.ID_card_photo || "");
    }

    try {
      const response = await axios.put(`/api/user`, apiFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        await update(response.data.data);
        alert("บันทึกข้อมูลสำเร็จ!");
        router.push("/pages/user/profile");
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      console.error(error);
    }
  };

  return (
    <MainLayout>
      <div className="mt-8 mb-8 w-[800px] mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">แก้ไขข้อมูลส่วนตัว</h2>
        <div className="mb-6 text-center">
          <img
            src={
              previewImage ||
              (formData.user_profile_picture
                ? `/${formData.user_profile_picture}`
                : "/user/img/user.jpeg")
            }
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border border-gray-300"
          />
          <label
            htmlFor="user_profile_picture"
            className="bg-green-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-green-700"
          >
            เปลี่ยนรูปโปรไฟล์
          </label>
          <input
            type="file"
            id="user_profile_picture"
            name="user_profile_picture"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="mb-6 text-center">
          <img
            src={
              previewIDCard ||
              (formData.ID_card_photo
                ? `/${formData.ID_card_photo}`
                : "/user/img/noimage.jpg")
            }
            alt="ID Card"
            className="w-32 h-[75px] rounded-md mx-auto mb-4 object-cover border border-gray-300"
          />
          <label
            htmlFor="ID_card_photo"
            className="bg-blue-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-700"
          >
            เปลี่ยนรูปบัตรประชาชน
          </label>
          <input
            type="file"
            id="ID_card_photo"
            name="ID_card_photo"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <form onSubmit={handleSubmit} className="w-3/4 mx-auto">
          <div className="mb-4">
            <label htmlFor="user_name" className="block text-sm font-medium text-gray-700">
              ชื่อ
            </label>
            <input
              type="text"
              id="user_name"
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
              className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="user_lastname" className="block text-sm font-medium text-gray-700">
              นามสกุล
            </label>
            <input
              type="text"
              id="user_lastname"
              name="user_lastname"
              value={formData.user_lastname}
              onChange={handleChange}
              className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="user_tel" className="block text-sm font-medium text-gray-700">
              เบอร์โทรศัพท์
            </label>
            <input
              type="tel"
              id="user_tel"
              name="user_tel"
              value={formData.user_tel}
              onChange={handleChange}
              className="mt-1 pl-2 h-10 block w-full border border-black rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="col-span-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              บันทึกข้อมูล
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default EditProfileForm;
