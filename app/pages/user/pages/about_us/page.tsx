'use client'

import MainLayout from '@/app/components/mainLayout';
import Image from 'next/image';
import React from 'react';

export default function About() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center text-center px-4 md:px-16 lg:px-32 py-12">
        {/* Hero Section */}
        <div className="relative w-full h-[400px] md:h-[500px]">
          <Image src="/user/img/banner2.jpg" alt="About Us" layout="fill" objectFit="cover" className="rounded-lg" />
          <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center text-white p-6">
            <h1 className="text-4xl md:text-5xl font-bold">เกี่ยวกับเรา</h1>
            <p className="text-lg md:text-xl mt-4 max-w-4xl">เราคือผู้นำในการให้บริการออกกำลังกายครบวงจร ที่ช่วยให้คุณดูแลสุขภาพได้อย่างเต็มที่</p>
          </div>
        </div>

        {/* Our Story */}
        <section className="mt-12 max-w-4xl">
          <h2 className="text-3xl font-bold text-white">เรื่องราวของเรา</h2>
          <p className="text-white mt-4">เราเริ่มต้นจากความตั้งใจที่จะสร้างสถานที่ที่ทุกคนสามารถเข้าถึงการออกกำลังกายและดูแลสุขภาพของตนเองได้อย่างเต็มที่ ด้วยทีมงานมืออาชีพที่มีประสบการณ์ และอุปกรณ์ที่ทันสมัย เรามุ่งมั่นให้บริการที่มีคุณภาพเพื่อตอบโจทย์ทุกไลฟ์สไตล์ของคุณ ฟิตเนสของเราได้รับการออกแบบมาเพื่อรองรับทุกระดับของการออกกำลังกาย ตั้งแต่มือใหม่ไปจนถึงนักกีฬามืออาชีพ ด้วยเครื่องออกกำลังกายที่ได้มาตรฐานระดับโลก รวมถึงโค้ชส่วนตัวที่พร้อมให้คำแนะนำเพื่อช่วยให้คุณบรรลุเป้าหมายด้านสุขภาพและความแข็งแรง</p>
        </section>

        {/* Video Section */}
        <section className="mt-12 w-full max-w-4xl">
          <h2 className="text-3xl font-bold text-white">วิดีโอแนะนำบริษัท</h2>
          <div className="mt-6 relative w-full aspect-video">
            <iframe 
              className="w-full h-full rounded-lg shadow-lg" 
              src="/user/video/about_usport.mp4" 
              title="วิดีโอแนะนำบริษัท" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
            </iframe>
          </div>
        </section>

        {/* Our Services */}
        <section className="mt-12 w-full">
          <h2 className="text-3xl font-bold text-white">บริการของเรา</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-semibold">🏋️‍♂️ ฟิตเนส</h3>
              <p className="text-gray-500 mt-2">ห้องออกกำลังกายที่มีเครื่องเล่นครบครัน พร้อมโค้ชที่คอยให้คำแนะนำ</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-semibold">🏊‍♀️ สระว่ายน้ำ</h3>
              <p className="text-gray-500 mt-2">สระว่ายน้ำมาตรฐานสำหรับออกกำลังกายและการฝึกซ้อม พร้อมบรรยากาศผ่อนคลาย</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-semibold">🧘‍♂️ โยคะ</h3>
              <p className="text-gray-500 mt-2">คลาสโยคะที่ช่วยเสริมสร้างความยืดหยุ่นและสมาธิ นำโดยครูผู้เชี่ยวชาญ</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg">
              <h3 className="text-xl font-semibold">⚽ สนามฟุตบอล</h3>
              <p className="text-gray-500 mt-2">สนามฟุตบอลหญ้าเทียมมาตรฐาน รองรับการเล่นทุกระดับ ตั้งแต่สมัครเล่นถึงมืออาชีพ</p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
