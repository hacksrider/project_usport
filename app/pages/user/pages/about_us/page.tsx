'use client'

import MainLayout from '@/app/components/mainLayout';
import { DataAbout, GetAllData } from '@/app/interface/pages/aboutus/about';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function About() {
  const [dataAbout, setDataAbout] = useState<DataAbout[]>([]);

  const AboutPageAPI = async () => {
    try {
      const response = await axios.get<GetAllData>("/api/pages/aboutuspage");
      setDataAbout(response.data);
      // console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    AboutPageAPI();
  }, []);
  return (
    <MainLayout>
      <>
        {dataAbout.map((item) => (
          <div key={item.page_about_id} className="flex flex-col items-center text-center px-4 md:px-16 lg:px-32 py-12">
            {/* Hero Section */}
            <div className="relative w-full h-[400px] md:h-[500px]">
              <Image src={item.banner ? `/${item.banner}` : ""} alt="About Us" layout="fill" objectFit="cover" className="rounded-lg" />
              <div className="absolute inset-0 bg-black bg-opacity-75 flex flex-col justify-center items-center text-white p-6">
                <h1 className="text-4xl md:text-5xl font-bold">{item.title}</h1>
                <p className="text-lg md:text-xl mt-4 max-w-4xl">{item.detail}</p>
              </div>
            </div>

            {/* Our Story */}
            <section className="mt-12 max-w-4xl">
              <h2 className="text-3xl font-bold text-white">เรื่องราวของเรา</h2>
              <p className="text-white mt-4">{item.detail_usport1}</p>
              <p className="text-white mt-4">{item.detail_usport2}</p>
            </section>

            {/* Video Section */}
            <section className="mt-12 w-full max-w-4xl">
              <h2 className="text-3xl font-bold text-white">วิดีโอแนะนำบริษัท</h2>
              <div className="mt-6 relative w-full aspect-video">
                <iframe
                  className="w-full h-full rounded-lg shadow-lg"
                  src={item.video ? `/${item.video}` : "/user/video/about_usport.jpg"}
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
                {item.exercise_about.map((v,index) => (
                  <div key={index} className="p-6 bg-white shadow-md rounded-lg">
                  <h3 className="text-xl font-semibold">{v.title}</h3>
                  <p className="text-gray-500 mt-2">{v.detail}</p>
                </div>
                ))}
                
              </div>
            </section>
          </div>
        ))}
      </>
    </MainLayout>
  );
}
