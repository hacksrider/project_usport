"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserInterface } from '../interface/user';

interface mainLayoutProp {
  children: React.ReactNode;
}

export default function MainLayout({ children }: mainLayoutProp) {
  const { data, status } = useSession();
  const userData = data as UserInterface;
  const router = useRouter();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const toggleServicesMenu = () => {
    setServicesMenuOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
      servicesRef.current && !servicesRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
      setServicesMenuOpen(false);
    }
  };

  useEffect(() => {
    // if(status === 'unauthenticated') {
    //   router.push('/pages/user/AAA/login');
    // }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-red-600 p-3 sticky top-0 z-50 px-5 sm:px-20">
        <nav className="container mx-auto flex justify-between items-center">
          <Image src="/user/img/logo.png" alt="Login" width={96} height={96} className="ml-2 sm:ml-10 sm:w-[96px] w-[50px]" unoptimized />
          <div className="flex items-center space-x-4">


            {/* Desktop Menu */}
            <ul className="hidden sm:flex pr-7 space-x-6 items-center">
              <li>
                <a
                  onClick={() => router.push('/pages/user/pages')}
                  role="button"
                  className="text-white hover:underline hover:underline-offset-8 text-xl"
                >
                  หน้าแรก
                </a>
              </li>
              <li>
                <a
                  onClick={() => router.push('/pages/user/pages/about_us')}
                  role="button"
                  className="text-white hover:underline hover:underline-offset-8 text-xl"
                >
                  เกี่ยวกับเรา
                </a>
              </li>
              <div className="relative" ref={servicesRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleServicesMenu();
                  }}
                  className="text-white hover:underline hover:underline-offset-8 text-xl flex items-center hover:text-gray-300 focus:outline-none"
                >
                  บริการ
                  <FaChevronDown className="w-[12px] ml-2" />
                </button>
                {servicesMenuOpen && (
                  <ul className="absolute bg-white text-black mt-2 shadow-lg rounded-md w-48">
                    <li>
                      <a
                        onClick={() => router.push('/pages/user/exercise')}
                        role="button"
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        บริการออกกำลังกาย
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={() => router.push('/pages/user/football/')}
                        role="button"
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        สนามฟุตบอล
                      </a>
                    </li>
                  </ul>
                )}
              </div>
              <li>
                <a
                  onClick={() => router.push('/pages/user/pages/contact_us')}
                  role="button"
                  className="text-white hover:underline hover:underline-offset-8 text-xl"
                >
                  ติดต่อเรา
                </a>
              </li>
            </ul>

            {/* User Authentication Buttons */}
            <ul className="flex space-x-2 items-center text-xs sm:text-lg">
              {status === 'unauthenticated' && (
                <>
                  <button
                    className="border-solid border-slate-950 bg-red-100 hover:bg-red-700 text-black font-bold sm:py-2 sm:px-4 py-1 px-2"
                    role="button"
                    onClick={() => router.push('/pages/user/AAA/login')}
                  >
                    เข้าสู่ระบบ
                  </button>
                  <button
                    className="border-solid border-slate-950 bg-red-100 hover:bg-red-700 text-black font-bold sm:py-2 sm:px-4 py-1 px-2"
                    role="button"
                    onClick={() => router.push('/pages/user/AAA/register')}
                  >
                    สมัครสมาชิก
                  </button>
                </>
              )}
              {status === 'authenticated' && (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center text-white font-bold hover:text-gray-300 focus:outline-none"
                    onClick={toggleDropdown}
                  >
                    <div className="mr-2 w-6 h-6 rounded-full overflow-hidden">
                      <img src={userData.user.user_profile_picture ? `/${userData.user.user_profile_picture}` : "/user/img/user.jpeg"} alt="user" />
                    </div>
                    {userData.user.user_username}
                    <FaChevronDown className="ml-2" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-lg">
                      <ul className="py-1">
                        <li>
                          <button
                            onClick={() => router.push('/pages/user/profile')}
                            role="button"
                            className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <span>ดูโปรไฟล์</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => router.push('/pages/user/purchase_order')}
                            role="button"
                            className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <span>รายการ</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>


                          </button>
                        </li>
                        <li>
                          <button
                            onClick={() => router.push('/pages/user/profile')}
                            role="button"
                            className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100"
                          >
                            <span>ประวัติ</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                            </svg>


                          </button>
                        </li>
                        <li>
                          <button
                            className="w-full flex items-center justify-between px-4 py-2 text-gray-700 hover:bg-gray-100"
                            role="button"
                            onClick={() => signOut({ callbackUrl: '/pages/user/AAA/login' })}
                          >
                            <span>ล็อกเอาท์</span>
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
                                d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                              />
                            </svg>
                          </button>

                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {/* Hamburger Menu for Mobile */}
              <button
                className="text-white text-2xl sm:hidden focus:outline-none"
                onClick={toggleMobileMenu}
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </ul>
          </div>
        </nav>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
            <div className="bg-white w-[75%] h-full p-5">
              <button className="text-red-600 text-2xl mb-5 focus:outline-none" onClick={toggleMobileMenu}>
                <FaTimes />
              </button>
              <ul className="space-y-4">
                <li>
                  <a
                    onClick={() => {
                      router.push('/pages/user/pages');
                      toggleMobileMenu();
                    }}
                    role="button"
                    className="block text-black text-lg hover:underline"
                  >
                    หน้าแรก
                  </a>
                </li>
                <li>
                  <a
                    onClick={() => {
                      router.push('/pages/user/pages/about_us');
                      toggleMobileMenu();
                    }}
                    role="button"
                    className="block text-black text-lg hover:underline"
                  >
                    เกี่ยวกับเรา
                  </a>
                </li>
                <div className="relative">
                  <button
                    onClick={toggleServicesMenu}
                    className="text-black text-lg flex items-center"
                  >
                    บริการ
                    <FaChevronDown className="ml-2" />
                  </button>
                  {servicesMenuOpen && (
                    <ul className="mt-2 space-y-2">
                      <li
                          onClick={() => {
                            router.push('/pages/user/exercise');
                            toggleMobileMenu();
                          }}
                          role="button"
                          className="block text-black text-[16px] ml-5"
                        > 
                        บริการออกกำลังกาย
                      </li>
                      <li>
                        <a
                          onClick={() => {
                            router.push('/pages/user/football/');
                            toggleMobileMenu();
                          }}
                          role="button"
                          className="block text-black text-lg text-[16px] ml-5"
                        >
                        สนามฟุตบอล
                        </a>
                      </li>
                    </ul>
                  )}
                </div>
                <li>
                  <a
                    onClick={() => {
                      router.push('/pages/user/pages/contact_us');
                      toggleMobileMenu();
                    }}
                    role="button"
                    className="block text-black text-lg hover:underline"
                  >
                    ติดต่อเรา
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex-grow" onClick={toggleMobileMenu}></div>
          </div>
        )}
      </div>

      <div className="flex-grow bg-gray-900 w-[100%]">{children}</div>

      <div className="bg-black p-4">
        {/* Footer */}
        <footer className="container mx-auto text-center text-white">
          <p>&copy; 2024 U-Sport. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <a href="#" className="text-white hover:text-gray-400">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="text-white hover:text-gray-400">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="text-white hover:text-gray-400">
              <FaInstagram size={24} />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}