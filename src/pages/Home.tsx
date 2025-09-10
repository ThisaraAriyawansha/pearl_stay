import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import SearchBar from '../components/Common/SearchBar';
import HotelCard from '../components/Hotel/HotelCard';
import axios from 'axios';
import Hero from './Hero';
import Banner1 from './ShowcaseSection';
import Gallary from './Gallery';
import Detail from './InnovationSection';
import Video from './VideoSection';




const Home: React.FC = () => {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedHotels();
  }, []);

  const fetchFeaturedHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hotels?status=1');
      setFeaturedHotels(response.data.hotels.slice(0, 6));
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchParams: any) => {
    const queryString = new URLSearchParams(searchParams).toString();
    window.location.href = `/rooms?${queryString}`;
  };


    const features = [
    {
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
      ),
      title: 'Premium Quality',
      description: 'Carefully curated hotels meeting our high standards'
    },
    {
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
      ),
      title: 'Global Locations',
      description: 'Beautiful properties in sought-after destinations'
    },
    {
      icon: (
        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      ),
      title: 'Easy Booking',
      description: 'Simple, secure process with instant confirmation'
    }
  ];

  return (
    <div> 
      <Hero/>
    <div className="pt-1 bg-white">
      
        <section className="relative flex items-center justify-center mb-8 overflow-hidden bg-white">
          
          {/* Add this animated circles background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-32 h-32 rounded-full opacity-20 top-10 left-10 circle-1"></div>
            <div className="absolute w-24 h-24 rounded-full opacity-25 top-20 right-20 circle-2"></div>
            <div className="absolute w-40 h-40 rounded-full opacity-15 bottom-10 left-1/4 circle-3"></div>
            <div className="absolute w-20 h-20 rounded-full opacity-30 bottom-20 right-10 circle-4"></div>
            <div className="absolute rounded-full w-36 h-36 opacity-18 top-1/2 right-1/3 circle-5"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto mt-24 mb-2 text-center text-white sm:mb-24">
            <div className="max-w-4xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

        </section>

        <Video/>

      {/* Features Section */}
          <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
              {/* Header */}
              <div className="mb-12 text-center lg:mb-16">
                {/* Logo for larger screens */}
                <div className="justify-end hidden mb-8 lg:flex">
                  <img 
                    src="/plogo-Picsart-AiImageEnhancer.png" 
                    alt="PearlStay Logo" 
                    className="object-contain w-16 h-16 opacity-80"
                  />
                </div>
                
                <h2 className="mb-4 text-2xl font-light text-gray-900 sm:text-3xl lg:text-4xl">
                  Why Choose PearlStay?
                </h2>
                <p className="max-w-xl mx-auto text-base font-light text-gray-600 sm:text-lg">
                  Exceptional service and unforgettable experiences
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
                {features.map((feature, index) => (
                  <div 
                    key={index}
                    className={`group ${index === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
                  >
                    <div className="p-6 text-center transition-all duration-200 bg-white border border-gray-100 rounded-xl sm:p-8 hover:shadow-md">
                      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-6 transition-colors duration-200 bg-purple-100 rounded-full group-hover:bg-purple-200">
                        {feature.icon}
                      </div>
                      <h3 className="mb-3 text-xl font-medium text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-600 sm:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          
      <Banner1/>
      {/* Featured Hotels */}
      <section className="py-16 bg-background-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="mb-4 text-2xl font-light sm:text-3xl md:text-4xl lg:text-5xl">
                Featured Hotels
              </h2>
              <p className="mb-2 text-xs tracking-wide text-gray-500 uppercase sm:text-sm md:text-base md:mb-3">
                Discover our handpicked selection of exceptional properties
              </p>
            </div>
            <Link
              to="/hotels"
              className="items-center hidden px-6 py-3 space-x-2 text-white transition-colors rounded-md md:flex bg-primary-600 hover:bg-primary-700"
            >
              <span>View All Hotels</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md h-80 animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="w-2/3 h-3 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-3 bg-gray-300 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredHotels.map((hotel: any) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>
              
              <div className="mt-8 text-center md:hidden">
                <Link
                  to="/hotels"
                  className="inline-flex items-center px-6 py-3 space-x-2 text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
                >
                  <span>View All Hotels</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
      <Gallary/>

      {/* CTA Section */}
        <section 
          className="py-16 bg-gradient-to-r from-[#3f3f56] via-[#242432] to-[#5a567a]"
        >
          <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-8 text-xl text-gray-100">
              Join thousands of satisfied travelers who trust PearlStay for their perfect Sri Lankan getaway.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                to="/hotels"
                className="px-8 py-3 font-medium transition-colors bg-white rounded-md text-[#5a567a] hover:bg-gray-100"
              >
                Browse Hotels
              </Link>
              <Link
                to="/register"
                className="px-8 py-3 font-medium text-white transition-colors rounded-md bg-[#acaabe] hover:bg-[#908ea9]"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      <Detail/>
    </div>
    </div>
  );
};

export default Home;