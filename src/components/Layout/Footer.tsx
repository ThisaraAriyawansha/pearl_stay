import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer 
      className="text-white bg-fixed bg-center bg-cover bg-primary-800 min-h-[400px] sm:min-h-[450px] lg:min-h-[500px]"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(34, 34, 34, 0.7)), url('/image/beach-wallpaper-3840x2160-sandy-shore-sunset-12590.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6 space-x-3">
              <img 
                src="/plogo-Picsart-AiImageEnhancer.png" 
                alt="PearlStay Logo" 
                className="object-contain w-12 h-12 sm:w-14 sm:h-14" 
              />
              <span className="text-2xl font-bold text-white sm:text-3xl">PearlStay</span>
            </div>
            <p className="max-w-md mb-6 text-base text-gray-200 sm:text-lg">
              Experience luxury and comfort at PearlStay. Book premium accommodations across Sri Lanka’s most stunning destinations, from serene beaches to cultural landmarks.
            </p>
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <Mail className="w-5 h-5 text-[#acaabe]" />
                <span className="text-sm sm:text-base">info@pearlstay.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-[#acaabe]" />
                <span className="text-sm sm:text-base">+94 76 9417154</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white sm:text-xl">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/hotels" className="text-gray-200 transition-colors hover:text-[#acaabe] text-base sm:text-lg">
                  Browse Hotels
                </Link>
              </li>
              <li>
                <Link to="/rooms" className="text-gray-200 transition-colors hover:text-[#acaabe] text-base sm:text-lg">
                  Find Rooms
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-200 transition-colors hover:text-[#acaabe] text-base sm:text-lg">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-200 transition-colors hover:text-[#acaabe] text-base sm:text-lg">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white sm:text-xl">Support</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-200 transition-colors hover:text-[#acaabe] text-base sm:text-lg">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 transition-colors hover:text-[#acaabe] text-base sm:text-lg">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 transition-colors hover:text-[#acaabe] text-base sm:text-lg">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-200 transition-colors hover:text-[#acaabe] text-base sm:text-lg">
                  Cancellation Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 mt-8 text-center border-t border-[#908ea9]">
          <p className="text-sm text-gray-200 sm:text-base">
            © 2025 PearlStay. All rights reserved. Crafted with care for exceptional hospitality.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;