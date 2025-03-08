'use client';
import React, { useEffect } from 'react';
import MainLayoutAdmin from '@/app/components/mainLayoutAdmin';
import { useRouter } from 'next/navigation';
import { ServiceAll, ServicesInterface } from '@/app/interface/services';
import axios from 'axios';

export default function AdminExercise() {
    const [services, setServices] = React.useState<ServiceAll[]>([]);
    const [confirmDelete, setConfirmDelete] = React.useState<{ show: boolean; serviceId: number | null }>({ show: false, serviceId: null });
    const router = useRouter();

    const fetchServices = async () => {
        try {
            const response = await axios.get('/api/services');
            const data: ServicesInterface = await response.data;
            setServices(data.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    const handleDelete = async (serviceId: number) => {
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            await axios.delete(`/api/services/${serviceId}`).then(r => {
                alert('ลบสำเร็จ');
                fetchServices();
            }).catch(e => {
                if (e.response.data.error == "P2003") {
                    alert("มีการใช้อยู่")
                }
            });
        } catch (error) {
            console.error('Error deleting service:', error);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    return (
        <MainLayoutAdmin>
            <h1 className="text-2xl font-semibold mb-3 ml-2 text-black">บริการการออกกำลังกาย</h1>
            <div className="bg-gray-300 p-6 rounded shadow-md ml-2">
                <div className="flex-grow">

                    <div className="flex justify-between mb-4">
                        <h1 className='text-2xl font-semibold'>บริการทั้งหมด</h1>
                        <button
                            onClick={() => router.push('/pages/admin/exercise/add_service')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition flex items-center space-x-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            <span>เพิ่มบริการ</span>
                        </button>
                    </div>

                    <div className="rounded-[10px] border border-stroke bg-white p-4 shadow-1 dark:border-dark-3 dark:bg-gray-dark dark:shadow-card sm:p-7.5">
                        <div className="max-w-full overflow-x-auto">
                            <table className="w-full table-auto border-solid border-2 border-black">
                                <thead>
                                    <tr className="bg-red-300 text-left dark:bg-dark-2 border-solid border-2 border-black">
                                        <th className="min-w-[10%] text-center px-4 py-4 font-medium text-dark dark:text-white xl:pl-7.5">
                                            ลำดับ
                                        </th>
                                        <th className="min-w-[50%] text-left px-4 py-4 font-medium text-dark dark:text-white">
                                            บริการ
                                        </th>
                                        <th className="min-w-[20%] text-center px-4 py-4 font-medium text-dark dark:text-white">
                                            สถานะ
                                        </th>
                                        <th className="min-w-[20%] text-center px-4 py-4 font-medium text-dark dark:text-white xl:pr-7.5">
                                            เลือก
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className='bg-gray-100'>
                                    {services.map((v, index) => (
                                        <tr key={index}>
                                            <td className={`min-w-[10%] text-center border-solid border-1 border-gray-300 px-4 py-4 dark:border-dark-3 xl:pl-7.5 ${index === services.length - 1 ? "border-b-0" : "border-b"}`}>
                                                <h5 className="text-dark dark:text-white">
                                                    {index + 1}
                                                </h5>
                                            </td>
                                            <td className={`min-w-[50%] text-left border-solid border-1 border-gray-300 px-4 py-4 dark:border-dark-3 ${index === services.length - 1 ? "border-b-0" : "border-b"}`}>
                                                <p className="text-dark dark:text-white">
                                                    <a
                                                        className='hover:underline dark:text-white dark:hover:text-white hover:text-blue-500 cursor-pointer'
                                                        onClick={() => { router.push(`/pages/admin/exercise/${v.service_ID}`); }}
                                                    >{v.service_name}</a>
                                                </p>
                                            </td>
                                            <td className={`min-w-[20%] text-center border-solid border-1 border-gray-300 px-4 py-4 dark:border-dark-3 ${index === services.length - 1 ? "border-b-0" : "border-b"}`}>
                                                <p className={`inline-flex rounded-full px-3.5 py-1 text-body-sm font-medium ${v.Status ? "bg-[#219653]/[0.08] text-[#219653]" : "bg-[#D34053]/[0.08] text-[#D34053]"}`}>
                                                    {v.Status ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                                                </p>
                                            </td>
                                            <td className={`min-w-[20%] text-center border-solid border-1 border-gray-300 px-4 py-4 dark:border-dark-3 xl:pr-7.5 ${index === services.length - 1 ? "border-b-0" : "border-b"}`}>
                                                <div className="flex items-center justify-center space-x-3.5">
                                                    <button className="hover:text-primary border border-solid border-1 border-gray-300 p-1.5 bg-gray-300 hover:bg-yellow-400"
                                                        onClick={() => {
                                                            router.push(`/pages/admin/exercise/${v.service_ID}`);
                                                        }}
                                                    >
                                                        <svg
                                                            className="fill-current"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path d="M3 21H9L19.712 10.288C20.1024 9.89758 20.1024 9.26542 19.712 8.875L15.125 4.287C14.7346 3.89658 14.1024 3.89658 13.712 4.287L3 15V21ZM5.5 18.5L14.288 9.712L15.712 11.138L6.925 20H5.5V18.5ZM16.838 9.012L15.413 7.587L16.587 6.413L18.013 7.837L16.838 9.012ZM3 16.25L12.75 6.5L17.25 11L7.5 20.75H3V16.25Z" fill="currentColor" />
                                                        </svg>
                                                    </button>
                                                    <button className="hover:text-primary border border-solid border-1 border-gray-300 p-1.5 bg-gray-300 hover:bg-red-500"
                                                        onClick={() => setConfirmDelete({ show: true, serviceId: v.service_ID })}
                                                    >
                                                        <svg
                                                            className="fill-current"
                                                            width="20"
                                                            height="20"
                                                            viewBox="0 0 20 20"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                clipRule="evenodd"
                                                                d="M8.59048 1.87502H11.4084C11.5887 1.8749 11.7458 1.8748 11.8941 1.89849C12.4802 1.99208 12.9874 2.35762 13.2615 2.88403C13.3309 3.01727 13.3805 3.16634 13.4374 3.33745L13.5304 3.61654C13.5461 3.66378 13.5506 3.67715 13.5545 3.68768C13.7004 4.09111 14.0787 4.36383 14.5076 4.3747C14.5189 4.37498 14.5327 4.37503 14.5828 4.37503H17.0828C17.4279 4.37503 17.7078 4.65485 17.7078 5.00003C17.7078 5.34521 17.4279 5.62503 17.0828 5.62503H2.91602C2.57084 5.62503 2.29102 5.34521 2.29102 5.00003C2.29102 4.65485 2.57084 4.37503 2.91602 4.37503H5.41609C5.46612 4.37503 5.47993 4.37498 5.49121 4.3747C5.92009 4.36383 6.29844 4.09113 6.44437 3.6877C6.44821 3.67709 6.45262 3.66401 6.46844 3.61654L6.56145 3.33747C6.61836 3.16637 6.66795 3.01728 6.73734 2.88403C7.01146 2.35762 7.51862 1.99208 8.1047 1.89849C8.25305 1.8748 8.41016 1.8749 8.59048 1.87502ZM7.50614 4.37503C7.54907 4.29085 7.5871 4.20337 7.61983 4.1129C7.62977 4.08543 7.63951 4.05619 7.65203 4.01861L7.7352 3.7691C7.81118 3.54118 7.82867 3.49469 7.84602 3.46137C7.9374 3.2859 8.10645 3.16405 8.30181 3.13285C8.33892 3.12693 8.38854 3.12503 8.6288 3.12503H11.37C11.6103 3.12503 11.6599 3.12693 11.697 3.13285C11.8924 3.16405 12.0614 3.2859 12.1528 3.46137C12.1702 3.49469 12.1877 3.54117 12.2636 3.7691L12.3468 4.01846L12.379 4.11292C12.4117 4.20338 12.4498 4.29085 12.4927 4.37503H7.50614Z"
                                                                fill=""
                                                            />
                                                            <path
                                                                d="M4.92859 7.04179C4.90563 6.69738 4.60781 6.43679 4.2634 6.45975C3.91899 6.48271 3.6584 6.78053 3.68136 7.12494L4.06757 12.9181C4.13881 13.987 4.19636 14.8505 4.33134 15.528C4.47167 16.2324 4.71036 16.8208 5.20335 17.2821C5.69635 17.7433 6.2993 17.9423 7.01151 18.0355C7.69653 18.1251 8.56189 18.125 9.63318 18.125H10.3656C11.4369 18.125 12.3023 18.1251 12.9873 18.0355C13.6995 17.9423 14.3025 17.7433 14.7955 17.2821C15.2885 16.8208 15.5272 16.2324 15.6675 15.528C15.8025 14.8505 15.86 13.987 15.9313 12.9181L16.3175 7.12494C16.3404 6.78053 16.0798 6.48271 15.7354 6.45975C15.391 6.43679 15.0932 6.69738 15.0702 7.04179L14.687 12.7911C14.6121 13.9143 14.5587 14.6958 14.4416 15.2838C14.328 15.8542 14.1693 16.1561 13.9415 16.3692C13.7137 16.5824 13.4019 16.7206 12.8252 16.796C12.2307 16.8738 11.4474 16.875 10.3217 16.875H9.67718C8.55148 16.875 7.76814 16.8738 7.17364 16.796C6.59697 16.7206 6.28518 16.5824 6.05733 16.3692C5.82949 16.1561 5.67088 15.8542 5.55725 15.2838C5.44011 14.6958 5.38675 13.9143 5.31187 12.7911L4.92859 7.04179Z"
                                                                fill=""
                                                            />
                                                            <path
                                                                d="M7.8539 8.5448C8.19737 8.51045 8.50364 8.76104 8.53799 9.10451L8.95466 13.2712C8.989 13.6146 8.73841 13.9209 8.39495 13.9553C8.05148 13.9896 7.74521 13.739 7.71086 13.3956L7.29419 9.22889C7.25985 8.88542 7.51044 8.57915 7.8539 8.5448Z"
                                                                fill=""
                                                            />
                                                            <path
                                                                d="M12.1449 8.5448C12.4884 8.57915 12.739 8.88542 12.7047 9.22889L12.288 13.3956C12.2536 13.739 11.9474 13.9896 11.6039 13.9553C11.2604 13.9209 11.0098 13.6146 11.0442 13.2712L11.4609 9.10451C11.4952 8.76104 11.8015 8.51045 12.1449 8.5448Z"
                                                                fill=""
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {confirmDelete.show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded shadow-lg p-6 w-96">
                        <h2 className="text-lg font-semibold mb-4">คุณแน่ใจหรือไม่ที่จะลบบริการนี้</h2>
                        <div className="flex justify-end space-x-4">
                            <button
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => setConfirmDelete({ show: false, serviceId: null })}
                            >ยกเลิก</button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={() => {
                                    if (confirmDelete.serviceId !== null) {
                                        handleDelete(confirmDelete.serviceId);
                                    }
                                    setConfirmDelete({ show: false, serviceId: null });
                                }}
                            >ตกลง</button>
                        </div>
                    </div>
                </div>
            )}
        </MainLayoutAdmin>
    );
}
