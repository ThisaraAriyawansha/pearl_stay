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

  return (
    <div> 
      <Hero/>
    <div className="pt-1 bg-white">
      
        <section className="relative flex items-center justify-center mb-16 overflow-hidden bg-white">
          
          {/* Add this animated circles background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-32 h-32 rounded-full opacity-20 top-10 left-10 circle-1"></div>
            <div className="absolute w-24 h-24 rounded-full opacity-25 top-20 right-20 circle-2"></div>
            <div className="absolute w-40 h-40 rounded-full opacity-15 bottom-10 left-1/4 circle-3"></div>
            <div className="absolute w-20 h-20 rounded-full opacity-30 bottom-20 right-10 circle-4"></div>
            <div className="absolute rounded-full w-36 h-36 opacity-18 top-1/2 right-1/3 circle-5"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl px-4 mx-auto mt-24 mb-2 text-center text-white sm:mb-24">
            <div className="max-w-4xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>

        </section>

        <Video/>

      {/* Features Section */}
          <section className="px-4 py-16 mb-20 bg-white">
            <div className="max-w-6xl mx-auto">
              {/* Header with subtle Apple styling */}
              <div className="relative mb-16 text-center">
                {/* Logo positioned on the right with Apple-like refinement */}
                <div className="absolute top-0 right-0 hidden lg:block">
                  <img 
                    src="/plogo-Picsart-AiImageEnhancer.png" 
                    alt="PearlStay Logo" 
                    className="object-contain w-20 h-20 transition-all duration-300 opacity-90 "
                  />
                </div>
                
                <h2 className="mb-4 text-3xl font-semibold tracking-tight text-gray-900 md:text-3xl">
                  Why Choose PearlStay?
                </h2>
                <p className="max-w-2xl mx-auto text-xl font-light text-gray-600">
                  We provide exceptional service and unforgettable experiences
                </p>
              </div>

              {/* Features Grid with Apple-inspired card design */}
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Feature 1 */}
                <div className="p-8 text-center transition-all duration-300 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-gray-200">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-50">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                    </svg>
                  </div>
                  <h3 className="mb-4 text-2xl font-medium text-gray-900">Premium Quality</h3>
                  <p className="font-light leading-relaxed text-gray-600">
                    Carefully curated hotels that meet our high standards for comfort and service
                  </p>
                </div>
                
                {/* Feature 2 */}
                <div className="p-8 text-center transition-all duration-300 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-gray-200">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-50">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                  </div>
                  <h3 className="mb-4 text-2xl font-medium text-gray-900">Global Locations</h3>
                  <p className="font-light leading-relaxed text-gray-600">
                    Access to beautiful properties in the most sought-after destinations worldwide
                  </p>
                </div>
                
                {/* Feature 3 */}
                <div className="p-8 text-center transition-all duration-300 bg-white border border-gray-100 rounded-2xl hover:shadow-lg hover:border-gray-200">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-50">
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <h3 className="mb-4 text-2xl font-medium text-gray-900">Easy Booking</h3>
                  <p className="font-light leading-relaxed text-gray-600">
                    Simple, secure booking process with instant confirmation and flexible options
                  </p>
                </div>
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
              <p className="text-xl text-gray-600">
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