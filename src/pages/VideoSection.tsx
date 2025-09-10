import React, { useRef, useState, useEffect } from 'react';

const PearlStaySection = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [isVideoInView, setIsVideoInView] = useState(false);

  // Handle video loading
  useEffect(() => {
    const video = videoRef.current;
    
    const handleLoadedData = () => {
      setIsVideoLoading(false);
    };

    if (video) {
      video.addEventListener('loadeddata', handleLoadedData);
      video.addEventListener('canplay', handleLoadedData);
      
      return () => {
        video.removeEventListener('loadeddata', handleLoadedData);
        video.removeEventListener('canplay', handleLoadedData);
      };
    }
  }, []);

  // Handle scroll and video play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVideoInView(entry.isIntersecting);
        
        if (entry.isIntersecting) {
          video.play().catch(error => {
            console.log('Autoplay prevented:', error);
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="px-4 py-4 bg-white">
      {/* Video Background Section */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center text-center text-white overflow-hidden  rounded-2xl shadow-lg">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          {isVideoLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-white rounded-full border-t-transparent animate-spin"></div>
                <p className="mt-4 font-light text-white">Loading video...</p>
              </div>
            </div>
          )}
          
          <video
            ref={videoRef}
            className="object-cover w-full h-full"
            muted
            loop
            playsInline
            preload="auto"
            poster="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
            onError={() => {
              setIsVideoLoading(false);
              console.error('Video failed to load');
            }}
          >
            <source src="./video/videoplayback1080.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/0"></div>
        </div>
        
        {/* Content */}
          <div className="relative z-10 max-w-4xl px-4 mx-auto text-center">
            <p className="mb-2 text-xs font-light tracking-wide uppercase sm:text-sm md:text-base md:mb-3">
              Welcome to PearlStay — a Sri Lankan company redefining hospitality with elegance and warmth.
            </p>


          </div>

      </div>

      {/* Features Section */}
      
    </div>
  );
};

export default PearlStaySection;