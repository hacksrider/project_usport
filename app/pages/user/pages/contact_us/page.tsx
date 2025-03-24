/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @next/next/no-img-element */
'use client'

import MainLayout from '@/app/components/mainLayout';
import { GetAllContact, GetDataContact } from '@/app/interface/pages/contact/contact';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaLine,
  FaFacebook,
  FaWhatsappSquare,
  FaInstagramSquare,
  FaTelegram,
  FaTiktok,
  FaYoutube
} from 'react-icons/fa';

export default function Contact() {
  const [dataContact, setDataContact] = useState<GetDataContact[]>([]);

  // Contact channel icon mapping
  const getContactIcon = (channelName: string) => {
    const channelMap = {
      "โทรศัพท์": { icon: <FaPhoneAlt className="text-4xl text-blue-600" /> },
      "LINE": { icon: <FaLine className="text-4xl text-green-600" /> },
      "Facebook": { icon: <FaFacebook className="text-4xl text-blue-600" /> },
      "WhatsApp": { icon: <FaWhatsappSquare className="text-4xl text-green-600" /> },
      "Instagram": { icon: <FaInstagramSquare className="text-4xl text-pink-600" /> },
      "Telegram": { icon: <FaTelegram className="text-4xl text-blue-600" /> },
      "email": { icon: <FaEnvelope className="text-4xl text-red-600" /> },
      "tiktok": { icon: <FaTiktok className="text-4xl text-pink-600" /> },
      "ที่อยู่": { icon: <FaMapMarkerAlt className="text-4xl text-yellow-600" /> },
      "youtube": { icon: <FaYoutube className="text-4xl text-red-600" /> },
      // Default icon for any other channel
      "อื่นๆ": { icon: <FaPhoneAlt className="text-4xl text-gray-600" /> }
    };

    // Return the icon for the matching channel name or default to "อื่นๆ" icon
    // @ts-expect-error
    return channelMap[channelName] || channelMap["อื่นๆ"];
  };

  const ContactPageAPI = async () => {
    try {
      const response = await axios.get<GetAllContact>("/api/pages/contactpage");
      setDataContact(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    ContactPageAPI();
  }, []);

  return (
    <MainLayout>
      {dataContact.map((item) => (
        <div key={item.page_contact_ID} className="flex flex-col items-center text-center px-4 md:px-16 lg:px-32 py-12">
          {/* Hero Section */}
          <h1 className="text-4xl md:text-4xl font-bold text-white">{item.title}</h1>
          <p className="text-lg md:text-xl mt-4 max-w-2xl mb-6 text-white">{item.subtitle}</p>
          <div className="relative w-full h-[400px] md:h-[500px] bg-cover bg-center rounded-lg overflow-hidden">
            <img
              src={item.banner ? `http://localhost:4000/${item.banner}` : ""}
              alt={item.banner}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contact Info Section */}
          <section className="mt-12 max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-white">{item.title_contact}</h2>
            <p className="text-gray-300 mt-4">{item.subtitle_contact}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              {item.contact_channels.map((channel, index) => (
                <div key={index} className="p-6 bg-white shadow-md rounded-lg flex flex-col items-center">
                  {getContactIcon(channel.name).icon}
                  <h3 className="text-xl font-semibold mt-2">{channel.name}</h3>
                  <p className="text-gray-500 mt-2">{channel.data}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Google Map Section */}
          {/* Google Map Section */}
          {/* Google Map Section */}
          <section className="mt-12 w-full">
            <h2 className="text-3xl font-bold text-center text-white mb-6">{item.title_map}</h2>
            <div className="w-full flex justify-center mb-0 pb-0">
              <iframe
                src={item.link_map}
                width={1800}
                height="400"
                style={{ border: "0" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>

        </div>
      ))}
    </MainLayout>
  );
}
{/* <iframe src="https://www.google.com/maps/embed?pb=!1m22!1m8!1m3!1d14010.51071715536!2d100.7331285!3d14.0458761!3m2!1i1024!2i768!4f13.1!4m11!3e6!4m3!3m2!1d14.057141399999999!2d100.7436092!4m5!1s0x311d789e21b13113%3A0xda96de68d5a73f5b!2zVSBTcG9ydCBBcmVuYSDguKPguLHguIfguKrguLTguJUgLSDguITguKXguK3guIcgNiBVIFNwb3J0IEFyZW5hIOC4leC4s-C4muC4pSDguITguKXguK3guIfguKvguIEg4Lit4Liz4LmA4Lig4Lit4LiE4Lil4Lit4LiH4Lir4Lil4Lin4LiHIOC4m-C4l-C4uOC4oeC4mOC4suC4meC4tQ!3m2!1d14.0458982!2d100.7364611!5e1!3m2!1sen!2sth!4v1740820439565!5m2!1sen!2sth" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}