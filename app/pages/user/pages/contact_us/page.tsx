'use client'

import MainLayout from '@/app/components/mainLayout';
import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Contact() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center text-center px-4 md:px-16 lg:px-32 py-12">
        {/* Hero Section */}
        <h1 className="text-4xl md:text-4xl font-bold text-white">ติดต่อเรา</h1>
        <p className="text-lg md:text-xl mt-4 max-w-2xl mb-6 text-white">เชื่อมต่อกับเราได้ทุกช่องทาง สอบถามข้อมูลเพิ่มเติม หรือเยี่ยมชมสถานที่ของเรา</p>
        <div className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center bg-[url('/user/img/banner1.jpg')] rounded-lg">
          <div className="absolute flex flex-col justify-center items-center text-white p-6">
            {/* <h1 className="text-4xl md:text-5xl font-bold">ติดต่อเรา</h1> */}
            {/* <p className="text-lg md:text-xl mt-4 max-w-2xl">เชื่อมต่อกับเราได้ทุกช่องทาง สอบถามข้อมูลเพิ่มเติม หรือเยี่ยมชมสถานที่ของเรา</p> */}
          </div>
        </div>

        {/* Contact Info Section */}
        <section className="mt-12 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white">ข้อมูลการติดต่อ</h2>
          <p className="text-gray-300 mt-4">เรายินดีให้บริการและตอบทุกคำถามของคุณ ติดต่อเราผ่านช่องทางด้านล่าง</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center">
              <FaPhoneAlt className="text-4xl text-blue-600" />
              <h3 className="text-xl font-semibold mt-2">โทรศัพท์</h3>
              <p className="text-gray-500 mt-2">+66 1234 5678</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center">
              <FaEnvelope className="text-4xl text-red-500" />
              <h3 className="text-xl font-semibold mt-2">อีเมล</h3>
              <p className="text-gray-500 mt-2">info@yourfitness.com</p>
            </div>
            <div className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center">
              <FaMapMarkerAlt className="text-4xl text-green-600" />
              <h3 className="text-xl font-semibold mt-2">ที่อยู่</h3>
              <p className="text-gray-500 mt-2">123 ถนนสุขภาพดี กรุงเทพฯ 10100</p>
            </div>
          </div>
        </section>

        {/* Google Map Section */}
        <section className="mt-12 w-full">
          <h2 className="text-3xl font-bold text-center text-white">แผนที่ของเรา</h2>
          <div className="mt-8 w-full h-[400px]">
            <iframe
              className="w-full h-full rounded-lg"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.627261908338!2d100.7338861745636!3d14.045903390417529!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d789e21b13113%3A0xda96de68d5a73f5b!2zVSBTcG9ydCBBcmVuYSDguKPguLHguIfguKrguLTguJUgLSDguITguKXguK3guIcgNg!5e1!3m2!1sen!2sth!4v1739806640851!5m2!1sen!2sth"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
