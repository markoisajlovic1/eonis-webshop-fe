import React, { useState, useEffect, useCallback } from 'react';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Import images from assets/banners
import banner1 from '../../assets/banners/image (1).webp';
import banner2 from '../../assets/banners/image (2).webp';
import banner3 from '../../assets/banners/image (3).webp';
import banner4 from '../../assets/banners/image (4).webp';
import banner5 from '../../assets/banners/image (5).webp';
import banner6 from '../../assets/banners/image (6).webp';
import banner7 from '../../assets/banners/image (7).webp';
import bannerDefault from '../../assets/banners/image.webp';

const banners = [
  bannerDefault,
  banner1,
  banner2,
  banner3,
  banner4,
  banner5,
  banner6,
  banner7
];

const BannerSlider: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  }, []);

  useEffect(() => {
    const interval = setInterval(handleNext, 5000);
    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <div className="relative w-full h-[200px] md:h-[400px] overflow-hidden group rounded-2xl">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={index} className="min-w-full h-full relative">
            <img 
              src={banner} 
              alt={`Banner ${index + 1}`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 cursor-pointer z-10"
      >
        <FiChevronLeft size={24} />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 cursor-pointer z-10"
      >
        <FiChevronRight size={24} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
              currentIndex === index ? 'w-8 bg-yellow-400' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
