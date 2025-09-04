import React, { useState, useEffect } from 'react';

interface LoadingPageProps {
  onComplete?: () => void;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setStep(1), 500),   // Show logo
      setTimeout(() => setStep(2), 1200),  // Show company name
      setTimeout(() => setStep(3), 1900),  // Show "Hotel Booking System"
      setTimeout(() => setStep(4), 2600),  // Show fade line
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 3500) // Complete loading
    ];

    return () => timeouts.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md px-6 space-y-4 text-center">
        
        {/* Logo/Icon - Step 1 */}
        <div className={`transition-all duration-700 ${step >= 1 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full">
            <img 
              src="/plogo-Picsart-AiImageEnhancer.png" 
              alt="PearlStay Logo" 
              className="object-contain w-12 h-12"
            />
          </div>
        </div>

        {/* Company Name - Step 2 */}
                <div
                  className={`transition-all duration-700 ${
                    step >= 2
                      ? 'opacity-100 transform translate-y-0'
                      : 'opacity-0 transform translate-y-4'
                  }`}
                >
                  <h1
                    className="text-5xl font-semibold tracking-wide text-primary-500"
                    style={{
                      fontFamily:
                        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                      letterSpacing: '0.2em', // adjust for more or less spacing
                    }}
                  >
                    PearlStay
                  </h1>
                </div>

        
        {/* Tagline - Step 3 */}
        <div className={`transition-all duration-700 ${step >= 3 ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'}`}>
          <p className="text-lg font-light text-gray-500 tracking-wide font-[system-ui]">
            Hotel Booking System
          </p>
        </div>

        {/* Fade Line - Step 4 (preserved as requested) */}
        <div className={`transition-all duration-1000 ${step >= 4 ? 'opacity-100 transform scale-x-100' : 'opacity-0 transform scale-x-0'}`}>
          <div className="flex justify-center mt-4">
            <div 
              className="h-0.5 w-32" 
              style={{ 
                background: `linear-gradient(90deg, transparent, #acaabe 50%, transparent)`, 
                opacity: 0.6,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;