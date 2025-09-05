"use client";
import React, { useEffect, useState } from 'react';
import './ShowcaseSection.css';

interface HotelElement {
  id: number;
  text: string;
  x: number;
  y: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
}

const HotelShowcaseSection = () => {
  const [hotelElements, setHotelElements] = useState<HotelElement[]>([]);

  const hotelFeatures = [
    "Luxury Suites",
    "Spa & Wellness",
    "Fine Dining",
    "24/7 Concierge",
    "Pool Access",
    "Free WiFi",
    "Room Service",
    "Ocean View",
    "King Size Beds",
    "Private Balcony",
    "Minibar",
    "Daily Housekeeping",
    "Fitness Center",
    "Business Facilities",
    "Air Conditioning",
    "Pet Friendly",
    "Valet Parking",
    "Event Spaces",
    "Family Rooms",
    "Airport Shuttle"
  ];

  useEffect(() => {
    const generateElements = () => {
      const newElements = [];
      for (let i = 0; i < 20; i++) {
        newElements.push({
          id: i,
          text: hotelFeatures[Math.floor(Math.random() * hotelFeatures.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          delay: Math.random() * 5,
          duration: 15 + Math.random() * 10,
          size: Math.random() * 0.5 + 0.5,
          opacity: Math.random() * 0.3 + 0.1,
        });
      }
      setHotelElements(newElements);
    };

    generateElements();
    const interval = setInterval(generateElements, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hotel" className="relative flex flex-col items-center justify-center h-[400px] px-4 py-8 overflow-hidden" style={{ backgroundColor: '#e3e3e9' }}>
      
      {/* Animated Hotel Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Elegant vertical lines */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <div
              key={`line-${i}`}
              className="absolute w-px bg-gradient-to-b from-transparent via-#908ea9/20 to-transparent"
              style={{
                left: `${(i + 1) * 12.5}%`,
                height: '100%',
                animation: `showcase-pulse ${2 + i * 0.5}s ease-in-out infinite alternate`,
                backgroundColor: 'rgba(144, 142, 169, 0.2)'
              }}
            />
          ))}
        </div>

        {/* Floating Hotel Features - Hidden on mobile */}
        <div className="hidden md:block">

        </div>

        {/* Decorative Pattern */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={`decor-${i}`}
              className="absolute text-xs select-none"
              style={{
                left: `${Math.random() * 100}%`,
                animation: `binaryRain ${8 + Math.random() * 4}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
                color: '#908ea9'
              }}
            >
            {i % 6 === 0 
              ? '★' 
              : i % 6 === 1 
              ? '✨' 
              : i % 6 === 2 
              ? '💜' 
              : i % 6 === 3 
              ? '🔮' 
              : i % 6 === 4 
              ? '🍇' 
              : '🟣'}
            </div>
          ))}
        </div>

        {/* Hotel Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="hotel-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M0 10 L20 10 M5 5 L5 15 M15 5 L15 15"
                  stroke="#747293"
                  strokeWidth="0.5"
                  fill="none"
                />
                <rect x="8" y="8" width="4" height="4" fill="#908ea9" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hotel-pattern)" />
          </svg>
        </div>

        {/* Glowing Particles */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute w-1 h-1 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `showcase-glow ${3 + Math.random() * 2}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 3}s`,
                boxShadow: '0 0 10px currentColor',
                backgroundColor: '#acaabe'
              }}
            />
          ))}
        </div>
      </div>

      {/* Content - Centered on screen */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center">
        {/* Title */}
        <h1 
          className="mb-2 text-4xl font-bold tracking-widest text-center text-transparent sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl drop-shadow-2xl"
          style={{
            backgroundImage: 'linear-gradient(to right, #747293, #908ea9, #acaabe)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
          }}
        >
          LUXURY STAY
        </h1>

        {/* Subtitle */}
        <p className="max-w-xl px-4 mt-2 text-sm font-medium text-center sm:text-base md:text-base lg:text-lg" style={{ color: '#747293' }}>
          Experience unparalleled comfort with our premium accommodations and world-class amenities
        </p>

      </div>

    </section>
  );
};

export default HotelShowcaseSection;