'use client'
import React, { useState, useEffect } from 'react'
import MainLayout from '@/app/components/mainLayout'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Dialog } from '@headlessui/react'

export default function Home() {
  const router = useRouter();
  const reviews = [
    { name: 'สมชาย', review: 'บรรยากาศดีมาก บริการยอดเยี่ยม!' },
    { name: 'กิตติ', review: 'สนามฟุตบอลสะอาดและคุณภาพดีมาก' },
    { name: 'นิดา', review: 'คลาสโยคะดีมาก ครูสอนละเอียด' },
    { name: 'สุชาติ', review: 'อุปกรณ์ออกกำลังกายครบครัน!' },
    { name: 'มานี', review: 'โยคะทำให้ร่างกายยืดหยุ่นมากขึ้น แนะนำเลย!' }
  ];
  
  const services = [
    { name: 'ฟิตเนส', image: '/user/img/fitness-1.jpg' },
    { name: 'สระว่ายน้ำ', image: '/user/img/swimpool1.jpg' },
    { name: 'โยคะ', image: '/user/img/yoga.jpg' },
    { name: 'สนามฟุตบอล', image: '/user/img/football-5.jpg' }
  ];
  
  const promotions = [
    { image: '/user/image/promo1.jpg', alt: 'โปรโมชั่น 1' },
    { image: '/user/image/promo2.jpg', alt: 'โปรโมชั่น 2' },
    { image: '/user/image/promo3.jpg', alt: 'โปรโมชั่น 3' }
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);
/////////////////////////
const galleryImages = [
    ['/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg'],
    ['/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg'],
    ['/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg', '/user/img/football-1.jpg']
  ];
  
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gray-900 flex items-center justify-center text-white text-center">
        <video autoPlay loop muted className="absolute w-full h-full object-cover opacity-20">
          <source src="/user/video/about_usport2.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">ออกกำลังกายครบวงจรที่เดียว</h1>
          <p className="text-lg md:text-xl mb-6">ฟิตเนส | สระว่ายน้ำ | โยคะ | สนามฟุตบอล</p>
          <button 
            onClick={() => {router.push('/pages/user/pages/pageExercise')}}
            className="px-6 py-3 mr-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
            ซื้อบริการออกกำลังกาย
          </button>
          <button 
            onClick={() => {router.push('/pages/user/pages/pageExercise')}}
            className="px-6 py-3 ml-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
            จองสนามฟุตบอล
          </button>
        </div>
      </section>

      {/* บริการหลัก */}
      <section className="py-16 px-4 text-center">
        <h2 className="text-3xl font-bold mb-8">บริการของเรา</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg p-4">
              <Image src={service.image} alt={service.name} width={300} height={200} className="rounded-lg ab"/>
              <h3 className="text-xl font-semibold mt-4">{service.name}</h3>
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                ดูรายละเอียด
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* แบนเนอร์โปรโมชั่น */}
      <section className="py-16 px-4 bg-gray-200 text-center">
        <h2 className="text-3xl font-bold mb-8">โปรโมชั่นพิเศษ</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {promotions.map((promo, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <Image src={promo.image} alt={promo.alt} width={400} height={250} className="w-full"/>
            </div>
          ))}
        </div>
      </section>

      {/* ส่วนแกลลอรี่ */}
      <section className="py-4 px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 text-white">แกลลอรี่</h2>
        <div className="space-y-2">
          {galleryImages.map((row, rowIndex) => (
            <div key={rowIndex} className="flex overflow-x-auto space-x-4 p-2">
              {row.map((image, index) => (
                <div key={index} className="flex-none w-60">
                  <Image 
                    src={image} 
                    alt={`Gallery ${rowIndex}-${index}`} 
                    width={240} 
                    height={160} 
                    className="rounded-lg cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Modal แสดงรูปภาพขยาย */}
        <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative">
            <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 bg-white p-2 rounded-full">✖</button>
            <Image src={selectedImage || ''} alt="Selected" width={800} height={600} className="rounded-lg" />
          </div>
        </Dialog>
      </section>

      {/* รีวิวลูกค้า */}
      <section className="py-8 px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 text-white">เสียงจากลูกค้าของเรา</h2>
        <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {reviews.map((review, index) => (
              <div key={index} className="min-w-full px-4">
                <div className="bg-white shadow-lg rounded-lg p-6 text-center">
                  <p className="text-lg font-medium">&ldquo;{review.review}&rdquo;</p>
                  <h4 className="text-xl font-semibold mt-4">- {review.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
