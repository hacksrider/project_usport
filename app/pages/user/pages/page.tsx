/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState, useEffect } from 'react'
import MainLayout from '@/app/components/mainLayout'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { DataHomepages, GetAllHomepages } from '@/app/interface/pages/homepage/home'
import axios from 'axios'
// import { it } from 'node:test'


export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [dataHomepage, setDataHomepage] = useState<DataHomepages[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axios.get<GetAllHomepages>('/api/pages/homepage');
      setDataHomepage(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Animation control
  useEffect(() => {
    fetchData();
    setIsVisible(true);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Handle image click to show popup
  const openImagePopup = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    // Prevent body scrolling when popup is open
    document.body.style.overflow = 'hidden';
  };

  // Close popup
  const closeImagePopup = () => {
    setSelectedImage(null);
    // Re-enable body scrolling
    document.body.style.overflow = 'auto';
  };

  return (
    <MainLayout>
      {dataHomepage.map((item) => (
        <div key={item.page_home_id}>
          {/* Hero Section with Animated Text */}
          <section className="relative min-h-screen flex items-center justify-center text-white text-center">
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${item.banner ? `http://localhost:4000/${item.banner}` : ""})` }}></div>

            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />

            <motion.div
              className="relative z-10 px-4 max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-500">
                {item.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90 font-light">
                {item.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { router.push('/pages/user/exercise') }}
                  className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  ซื้อบริการออกกำลังกาย
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { router.push('/pages/user/pages/pageExercise') }}
                  className="px-8 py-4 bg-white text-red-600 font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  จองสนามกีฬา
                </motion.button>
              </div>
            </motion.div>
          </section>


          {/* Services Section with Enhanced Cards */}
          <section className="py-20 px-4 bg-gray-900 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent opacity-50" />
            <div className="container mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-4xl font-bold mb-2 text-center text-white">บริการของเรา</h2>
                <p className="text-lg text-gray-300 text-center mb-12 max-w-2xl mx-auto">
                  เราพร้อมให้บริการด้านการออกกำลังกายและสุขภาพอย่างครบวงจร
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {item.page_home_exercise.map((service, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-800 rounded-xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    whileHover={{ y: -5 }}
                  >
                    <div 
                      className="relative h-56 overflow-hidden"
                      onClick={() => openImagePopup(`http://localhost:4000/${service.banner_exercise}`)}
                    >
                      <img
                        src={`http://localhost:4000/${service.banner_exercise}`}
                        alt={service.name_exercise}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70" />
                    </div>
                    <div className="p-6 relative">
                      <h3 className="text-2xl font-bold mb-2 text-white">{service.name_exercise}</h3>
                      <p className="text-gray-300 mb-4">{service.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Announcements/Promotions Section with Cards */}
          <section className="py-20 px-4 bg-gray-100">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-4xl font-bold mb-2 text-center text-gray-900">ประกาศจาก Usport</h2>
                <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                  ข่าวสารและโปรโมชั่นพิเศษสำหรับสมาชิก
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8">
                {item.page_home_promotion.map((promo, index) => (
                  <motion.div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    whileHover={{ y: -5 }}
                    onClick={() => { }}
                  >
                    <div 
                      className="relative h-48 overflow-hidden"
                      onClick={() => openImagePopup(`http://localhost:4000/${promo.banner_promotion}`)}
                    >
                      <img
                        src={`http://localhost:4000/${promo.banner_promotion}`}
                        alt={promo.title_promotion}
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2 text-gray-900">{promo.title_promotion}</h3>
                      <p className="text-gray-600 mb-4">{promo.detail_promotion}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Gallery Section with Clickable Images */}
          <section className="py-20 px-4 bg-gray-900">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <h2 className="text-4xl font-bold mb-2 text-center text-white">แกลเลอรี</h2>
                <p className="text-lg text-gray-300 text-center mb-12 max-w-2xl mx-auto">
                  ภาพบรรยากาศจาก USport ศูนย์กีฬาและฟิตเนสครบวงจร
                </p>
              </motion.div>

              <div className="grid md:grid-cols-5 gap-2">
                {item.page_home_gallery.map((image, index) => (
                  <motion.div
                    key={index}
                    className="relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    onClick={() => openImagePopup(`http://localhost:4000/${image.picture_gallery}`)}
                  >
                    <img
                      src={`http://localhost:4000/${image.picture_gallery}`}
                      alt={`Gallery Image ${index + 1}`}
                      width={500}
                      height={300}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        </div>
      ))}

      {/* Image Popup/Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
            onClick={closeImagePopup}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-h-[80vh] w-[500px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full">
                <Image
                  src={selectedImage}
                  alt="Enlarged view"
                  layout="responsive"
                  width={800}
                  height={600}
                  className="object-contain rounded-lg shadow-2xl"
                />
                <button
                  onClick={closeImagePopup}
                  className="absolute top-4 right-4 bg-black/70 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}