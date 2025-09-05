import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import SearchBar from '../components/Common/SearchBar';
import HotelCard from '../components/Hotel/HotelCard';
import axios from 'axios';
import Hero from './Hero';
import Banner1 from './ShowcaseSection';


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

      {/* Features Section */}
      <section className="mb-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Header with Logo */}
          <div className="relative mb-12 text-center">
            {/* Logo positioned on the right */}
            <div className="absolute top-0 right-0 hidden lg:block">
              <img 
                src="/plogo-Picsart-AiImageEnhancer.png" 
                alt="PearlStay Logo" 
                className="object-contain w-24 h-24 opacity-80"
              />
            </div>
            
            <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              Why Choose PearlStay?
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              We provide exceptional service and unforgettable experiences
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="p-6 text-center transition-shadow rounded-lg hover:shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">Premium Quality</h3>
              <p className="text-gray-600">
                Carefully curated hotels that meet our high standards for comfort and service
              </p>
            </div>
            
            <div className="p-6 text-center transition-shadow rounded-lg hover:shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100">
                <MapPin className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">Global Locations</h3>
              <p className="text-gray-600">
                Access to beautiful properties in the most sought-after destinations worldwide
              </p>
            </div>
            
            <div className="p-6 text-center transition-shadow rounded-lg hover:shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-accent-100">
                <Calendar className="w-8 h-8 text-accent-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">Easy Booking</h3>
              <p className="text-gray-600">
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
              <h2 className="mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
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

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl px-4 mx-auto text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Ready to Start Your Journey?
          </h2>
          <p className="mb-8 text-xl text-primary-100">
            Join thousands of satisfied travelers who trust PearlStay for their perfect getaway
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/hotels"
              className="px-8 py-3 font-medium transition-colors bg-white rounded-md text-primary-600 hover:bg-gray-100"
            >
              Browse Hotels
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 font-medium text-white transition-colors rounded-md bg-accent-500 hover:bg-accent-600"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
};

export default Home;