import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Define gallery image type
type GalleryImage = {
    id: number;
    src: string;
    alt: string;
    category: 'facility' | 'activity' | 'event';
};

// Sample gallery images data
const galleryImages: GalleryImage[] = [
    // Facilities
    { id: 1, src: '/user/img/fitness-1.jpg', alt: 'Modern fitness center', category: 'facility' },
    { id: 2, src: '/user/img/fitness-2.jpg', alt: 'Olympic swimming pool', category: 'facility' },
    { id: 3, src: '/user/img/fitness-1.jpg', alt: 'Spacious yoga studio', category: 'facility' },
    { id: 4, src: '/user/img/fitness-1.jpg', alt: 'Indoor football field', category: 'facility' },
    { id: 5, src: '/user/img/fitness-1.jpg', alt: 'Modern locker room', category: 'facility' },
    { id: 6, src: '/user/img/fitness-1.jpg', alt: 'Sports café', category: 'facility' },

    // Activities
    { id: 7, src: '/user/img/fitness-1.jpg', alt: 'Group fitness class', category: 'activity' },
    { id: 8, src: '/user/img/fitness-1.jpg', alt: 'Personal training session', category: 'activity' },
    { id: 9, src: '/user/img/fitness-1.jpg', alt: 'Swimming lesson', category: 'activity' },
    { id: 10, src: '/user/img/fitness-1.jpg', alt: 'Yoga class in session', category: 'activity' },
    { id: 11, src: '/user/img/fitness-1.jpg', alt: 'Football match', category: 'activity' },
    { id: 12, src: '/user/img/fitness-1.jpg', alt: 'Basketball game', category: 'activity' },

    // Events
    { id: 13, src: '/user/img/fitness-1.jpg', alt: 'Annual fitness event', category: 'event' },
    { id: 14, src: '/user/img/fitness-1.jpg', alt: 'Swimming competition', category: 'event' },
    { id: 15, src: '/user/img/fitness-1.jpg', alt: 'Yoga workshop', category: 'event' },
    { id: 16, src: '/user/img/fitness-2.jpg', alt: 'Community sports day', category: 'event' },

    // Add more images as needed
];

const GallerySection: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [showLeftArrow, setShowLeftArrow] = useState<boolean>(false);
    const [showRightArrow, setShowRightArrow] = useState<boolean>(true);
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    // Filter images based on selected category
    const filteredImages = activeCategory === 'all'
        ? galleryImages
        : galleryImages.filter(img => img.category === activeCategory);

    // Scroll functions
    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current: container } = scrollContainerRef;
            const scrollAmount = container.clientWidth * 0.8;

            if (direction === 'left') {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }

            // Check scroll position after animation completes
            setTimeout(() => {
                if (container) {
                    setShowLeftArrow(container.scrollLeft > 0);
                    setShowRightArrow(container.scrollLeft < (container.scrollWidth - container.clientWidth - 10));
                }
            }, 400);
        }
    };

    // Handle scroll events to update arrow visibility
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { current: container } = scrollContainerRef;
            setShowLeftArrow(container.scrollLeft > 0);
            setShowRightArrow(container.scrollLeft < (container.scrollWidth - container.clientWidth - 10));
        }
    };

    // Image modal handlers
    const openImageModal = (image: GalleryImage) => {
        setSelectedImage(image);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
    };

    return (
        <>
            {/* Category filters */}
            <div className="flex justify-center space-x-4 mb-8">
                {['all', 'facility', 'activity', 'event'].map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-6 py-2 rounded-full transition-all duration-300 ${activeCategory === category
                                ? 'bg-red-600 text-white shadow-lg'
                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                    >
                        {category === 'all' ? 'ทั้งหมด' :
                            category === 'facility' ? 'สถานที่' :
                                category === 'activity' ? 'กิจกรรม' : 'อีเวนท์'}
                    </button>
                ))}
            </div>

            {/* Gallery container with navigation arrows */}
            <div className="relative">
                {/* Left arrow */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: showLeftArrow ? 1 : 0 }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-full shadow-lg"
                    onClick={() => scroll('left')}
                    disabled={!showLeftArrow}
                >
                    <ChevronLeft size={30} />
                </motion.button>

                {/* Right arrow */}
                <motion.button
                    initial={{ opacity: 1 }}
                    animate={{ opacity: showRightArrow ? 1 : 0 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 text-white p-2 rounded-full shadow-lg"
                    onClick={() => scroll('right')}
                    disabled={!showRightArrow}
                >
                    <ChevronRight size={30} />
                </motion.button>

                {/* Scrollable gallery */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory py-4 px-2 -mx-2"
                    onScroll={handleScroll}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {filteredImages.map((image) => (
                        <motion.div
                            key={image.id}
                            className="flex-none w-80 h-60 mx-2 snap-center overflow-hidden rounded-xl shadow-lg cursor-pointer relative group"
                            whileHover={{ y: -5 }}
                            onClick={() => openImageModal(image)}
                        >
                            <div className="relative w-full h-full">
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 320px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                    <p className="text-white font-medium text-sm">{image.alt}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Full-size image modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={closeImageModal}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="relative max-w-4xl max-h-[80vh] w-full h-full"
                    >
                        <div className="relative w-full h-full">
                            <Image
                                src={selectedImage.src}
                                alt={selectedImage.alt}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                                className="object-contain"
                            />
                        </div>
                        <button
                            className="absolute top-4 right-4 bg-black/70 text-white p-2 rounded-full"
                            onClick={closeImageModal}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                            <p className="text-lg font-medium">{selectedImage.alt}</p>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* View more button */}
            <div className="flex justify-center mt-8">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                >
                    ดูทั้งหมด
                </motion.button>
            </div>
        </>
    );
};

export default GallerySection;