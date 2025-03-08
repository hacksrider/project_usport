'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon
import { faDumbbell, faFutbol, faHouse, faAddressCard, faSquarePollHorizontal } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { AdminInterface } from '../interface/admin';

interface MainLayoutAdminProp {
    children: React.ReactNode;
}

export default function MainLayoutAdmin({ children }: MainLayoutAdminProp) {
    const { data, status } = useSession();
    const adminData = data as AdminInterface;
    const router = useRouter();
    const pathName = usePathname();

    const [dropdownVisible, setDropdownVisible] = useState(false); // Manage dropdown visibility
    const [activeMenu, setActiveMenu] = useState(''); // Default active item

    useEffect(() => {
        if(status === 'unauthenticated') {
            router.push('/pages/admin');
          }
        // Ensure activeMenu is set based on the current pathname
        const pName = pathName.split('/').filter(Boolean).pop();
        if (pName) {
            setActiveMenu(pName);
        }
    }, [pathName, router, status]);

    const handleMenuClick = (menu: string, route: string) => {
        setActiveMenu(menu);
        router.push(route);
    };


    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const imageAdmin = () => {
        if (adminData.user.emp_sex === 'ชาย') {
            return "/user/img/adminM.png";
        }
        if (adminData.user.emp_sex === 'หญิง') {
            return "/user/img/adminF.png";
        }
        else{
            return "/user/img/adminAll.png";
        }
    }

    return (
        <>
            {status === 'authenticated' && (
                <div className="flex flex-col w-full">
                    <div className="w-full h-16 text-white pl-4 bg-red-800 flex items-center justify-between fixed top-0 z-50">
                        <Image src="/user/img/logo.png" alt="Login" width={96} height={96} className="ml-12 mt-0" unoptimized />
                        <button className="flex items-center justifly-center mr-4 text-white focus:outline-none" onClick={toggleDropdown}>
                            <span className="text-3xl pr-4">☰</span>
                        </button>
                        {dropdownVisible && (
                            <div className="absolute top-16 right-8 bg-white text-black shadow-lg rounded w-36">
                                <ul>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            router.push('/pages/admin/profile');
                                            setDropdownVisible(false);
                                        }}
                                    >
                                        ดูโปรไฟล์
                                    </li>
                                    <li
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => {
                                            signOut({ callbackUrl: '/pages/admin' })
                                            setDropdownVisible(false);
                                        }}
                                    >
                                        Logout
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="mt-7 mr-5">
                        {/* Sidebar */}
                        <aside className="fixed w-58 h-full bg-black text-white p-6 flex flex-col justify-between overflow-y-auto">
                            <div className="mt-10">
                                <div className="flex flex-col items-center mb-3">
                                    <div className="w-[100px] h-[100px] rounded-full bg-gray-300 mb-4 overflow-hidden">
                                        <img
                                            src={imageAdmin()}
                                            alt="Profile Image"
                                            width={100}
                                            height={100}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <h2 className="text-lg font-semibold">{adminData.user.emp_name ? adminData.user.emp_name : "N/A"} {adminData.user.emp_lastname ? adminData.user.emp_lastname : "N/A"}</h2>
                                    {adminData.user.emp_job ? <p className="text-sm text-gray-400">ผู้จัดการ</p> : <p className="text-sm text-gray-400">พนักงาน</p>}
                                </div>
                                <nav className='mb-6'>
                                    <ul className="space-y-0 text-sm">
                                        <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'dashboard' ? 'bg-gray-500' : ''
                                                }`}
                                            onClick={() => handleMenuClick('dashboard', '/pages/admin/dashboard')}
                                        >
                                            <span className="mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                                </svg>
                                            </span>
                                            แดชบอร์ด
                                        </li>

                                        <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'report' ? 'bg-gray-500' : ''
                                                }`}
                                            onClick={() => handleMenuClick('report', '/pages/admin/report')}
                                        >
                                            <span className="mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
                                                </svg>
                                            </span>
                                            รายงาน
                                        </li>

                                        <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'exercise_order' ? 'bg-gray-500' : ''
                                                }`}
                                            onClick={() => handleMenuClick('exercise_order', '/pages/admin/exercise_order')}
                                        >
                                            <span className="mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                                </svg>
                                            </span>
                                            คำสั่งซื้อ
                                        </li>

                                        <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'booking_order' ? 'bg-gray-500' : ''
                                                }`}
                                            onClick={() => handleMenuClick('booking_order', '/pages/admin/booking_order')}
                                        >
                                            <span className="mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                                </svg>
                                            </span>
                                            คำสั่งจองสนาม
                                        </li>

                                        <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'request' ? 'bg-gray-500' : ''
                                                }`}
                                            onClick={() => handleMenuClick('request', '#')}
                                        >
                                            <span className="mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                                                    <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                                                </svg>
                                            </span>
                                            คำขอ VIP
                                        </li>

                                        <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'member' ? 'bg-gray-500' : ''
                                                }`}
                                            onClick={() => handleMenuClick('member', '/pages/admin/member')}
                                        >
                                            <span className="mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                    <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                                                    <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                                                </svg>
                                            </span>
                                            สมาชิก
                                        </li>

                                        {adminData.user.emp_job && (
                                            <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'employees' ? 'bg-gray-500' : ''
                                                }`}
                                            onClick={() => handleMenuClick('employees', '/pages/admin/employees')}
                                        >
                                            <span className="mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                                </svg>
                                            </span>
                                            พนักงาน
                                        </li>
                                        )}

                                        <br />
                                        <hr className='pt-2 border-gray-400 ' />
                                        <div className="text-wite text-lg mt-2">บริการ</div>
                                        <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'fitness' ? 'bg-gray-500' : ''}`}
                                            onClick={() => {
                                                setActiveMenu('fitness');
                                                router.push('/pages/admin/exercise');
                                            }}
                                        >
                                            <span className="mr-3"><FontAwesomeIcon className='text-xs' icon={faDumbbell} /></span>บริการการออกกำลังกาย
                                        </li>
                                        <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'swim' ? 'bg-gray-500' : ''}`}
                                            onClick={() => {
                                                setActiveMenu('swim');
                                                router.push('/pages/admin/football_field_management');
                                            }}
                                        >
                                            <span className="mr-3"><FontAwesomeIcon className='text-[15px]' icon={faFutbol} /></span>สนามฟุตบอลหญ้าเทียม
                                        </li>
                                        <br />
                                        <hr className='pt-2 border-gray-400 ' />
                                        <div className="text-wite text-lg mt-2">หน้าเว็บไซต์</div>
                                        <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'home_page' ? 'bg-gray-500' : ''}`}
                                            onClick={() => {
                                                setActiveMenu('home_page');
                                                router.push('/pages/admin/pages');
                                            }}
                                        >
                                            <span className="mr-3"><FontAwesomeIcon icon={faHouse} /></span>หน้าแรก
                                        </li>
                                        <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'about_page' ? 'bg-gray-500' : ''}`}
                                            onClick={() => {
                                                setActiveMenu('about_page');
                                                router.push('/pages/admin/pages/aboutus');
                                            }}
                                        >
                                            <span className="mr-3"><FontAwesomeIcon icon={faAddressCard} /></span>หน้าเกี่ยวกับเรา
                                        </li>
                                        <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'service_page' ? 'bg-gray-500' : ''}`}
                                            onClick={() => {
                                                setActiveMenu('service_page');
                                                router.push('/pages/admin/pages/exercise');
                                            }}
                                        >
                                            <span className="mr-3"><FontAwesomeIcon icon={faSquarePollHorizontal} className='text-[18px]' /></span>หน้าบริการออกกำลังกาย
                                        </li>
                                        <li
                                            className={`cursor-pointer flex items-center px-2 py-1 rounded ${activeMenu === 'contact_page' ? 'bg-gray-500' : ''}`}
                                            onClick={() => {
                                                setActiveMenu('contact_page');
                                                router.push('/pages/admin/pages/contact');
                                            }}
                                        >
                                            <span className="mr-3"><FontAwesomeIcon icon={faAddressCard} /></span>หน้าติดต่อเรา
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            {/* <div className="mb-10">
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md w-full">Logout</button>
                    </div> */}
                        </aside>
                        {/* Main content */}
                        <main className="h-[100%] width-[100%] pl-8 pt-8 ml-[220px] mt-4">
                            {/* <h1 className="text-2xl font-semibold mb-3 text-white">Manage Posts</h1>
                    <div className="bg-white p-6 rounded shadow-md">
                        <div className="flex-grow"> */}
                            {children}
                            {/* </div>
                    </div> */}
                        </main>
                    </div>
                </div>
            )}

        </>
    );
}
