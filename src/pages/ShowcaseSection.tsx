import React, { useState, useEffect } from "react";

const Banner = () => {


    const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This code runs only on the client side
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  
  return (
    <div
      className="relative flex items-center justify-center w-full text-center text-white bg-center bg-cover h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px]"
      style={{
        backgroundImage: "url('/image/matthew-hume-I9zW-9Qz7tU-unsplash.jpg')",
        // Responsive background sizing
        backgroundSize: "cover",
        // Responsive positioning - focus on center for mobile, allow more flexibility for desktop
        backgroundPosition: isMobile ? "center 30%" : "center center",
        // Fix background image for desktop only
        backgroundAttachment: isMobile ? "scroll" : "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="relative z-10 max-w-4xl px-4 mx-auto">
      <p className="mb-2 text-xs tracking-wide uppercase sm:text-sm md:text-base md:mb-3">
        {`Experience unparalleled comfort with our premium accommodations and world-class amenities`}
        </p>

        <div className="w-20 sm:w-24 md:w-32 h-[1px] bg-gray-300 mx-auto mb-3 md:mb-4"></div>
        <h1 className="text-2xl font-light sm:text-3xl md:text-4xl lg:text-5xl">
          LUXURY STAY
        </h1>
      </div>
    </div>
  );
};

export default Banner;