import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
    });
  };

const handleScroll = () => {
  const targetScroll = window.scrollY + window.innerHeight; // move down 1 viewport height
  const startScroll = window.scrollY;
  const distance = targetScroll - startScroll;
  const duration = 2000; // ms (longer = smoother)
  let startTime: number | null = null;

  const easeInOutCubic = (t: number): number =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const step = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const easedProgress = easeInOutCubic(progress);

    window.scrollTo(0, startScroll + distance * easedProgress);

    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};


  return (
    <section 
      className="relative flex items-center justify-center h-screen overflow-hidden bg-fixed bg-center bg-cover"
      style={{
        backgroundImage: `url('/image/beach-wallpaper-3840x2160-waves-tropical-6475.jpg')`,
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50"></div>
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Animated floating elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute transition-transform duration-700 ease-out rounded-full w-96 h-96 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 blur-3xl"
          style={{
            top: '10%',
            left: '10%',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        ></div>
        <div 
          className="absolute transition-transform duration-1000 ease-out rounded-full w-80 h-80 bg-gradient-to-br from-blue-400/15 to-purple-400/15 blur-3xl"
          style={{
            bottom: '15%',
            right: '15%',
            transform: `translate(${-mousePosition.x * 0.5}px, ${-mousePosition.y * 0.5}px)`,
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl px-4 mx-auto text-center sm:px-6 lg:px-8">
        {/* Animated heading */}
        <div className="mb-6 overflow-hidden">
          <h1 
            className={`text-3xl sm:text-5xl lg:text-7xl font-light text-white leading-tight transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
            style={{ 
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              letterSpacing: '-0.02em',
              textShadow: '0 2px 20px rgba(0,0,0,0.3), 0 1px 4px rgba(0,0,0,0.4)'
            }}
          >
            Discover Your Perfect Stay with 
            <br />
            <span className="font-semibold text-transparent bg-gradient-to-r from-[#ffffff] via-[#ffffff] to-[#ffffff] bg-clip-text drop-shadow-lg" style={{ letterSpacing: '0.3em' }}>
              PearlStay
            </span>
          </h1>
        </div>


        {/* Animated subtitle */}
        <div className="mb-12 overflow-hidden">
          <p 
            className={`text-base sm:text-xl md:text-2xl text-gray-100 font-light max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
            style={{ 
              textShadow: '0 1px 8px rgba(0,0,0,0.4)' 
            }}
          >
            Book luxurious accommodations effortlessly with our seamless platform, 
            designed for the modern traveler.
          </p>
        </div>


        {/* Enhanced trust indicators */}
        <div 
          className={`flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-gray-200 transition-all duration-1000 delay-700 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="flex items-center px-3 py-1 space-x-1 rounded-full sm:px-4 sm:py-2 sm:space-x-2 bg-white/10 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full shadow-lg bg-emerald-400 animate-pulse shadow-emerald-400/50"></div>
            <span className="text-xs font-medium sm:text-sm">50k+ Happy Travelers</span>
          </div>
          <div className="flex items-center px-3 py-1 space-x-1 rounded-full sm:px-4 sm:py-2 sm:space-x-2 bg-white/10 backdrop-blur-sm">
            <div className="w-2 h-2 bg-yellow-400 rounded-full shadow-lg animate-pulse shadow-yellow-400/50"></div>
            <span className="text-xs font-medium sm:text-sm">5-Star Service</span>
          </div>
          <div className="flex items-center px-3 py-1 space-x-1 rounded-full sm:px-4 sm:py-2 sm:space-x-2 bg-white/10 backdrop-blur-sm">
            <div className="w-2 h-2 bg-purple-400 rounded-full shadow-lg animate-pulse shadow-purple-400/50"></div>
            <span className="text-xs font-medium sm:text-sm">Instant Booking</span>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator with click handler */}
      <div 
        className={`absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1000 ease-out cursor-pointer ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
        onClick={handleScroll} // click handler
      >
        <div className="flex flex-col items-center space-y-1 text-gray-200 sm:space-y-2">
          <span className="text-xs font-light sm:text-sm" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
            Scroll to explore
          </span>
          <div className="flex justify-center w-5 h-8 border-2 rounded-full sm:w-6 sm:h-10 border-white/50 backdrop-blur-sm">
            <div className="w-1 h-2 mt-1 rounded-full shadow-lg sm:h-3 sm:mt-2 bg-white/80 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;