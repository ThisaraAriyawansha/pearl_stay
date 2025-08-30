import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hotel as HotelIcon, Star, MapPin, Users } from 'lucide-react';
import SearchBar from '../components/Booking/SearchBar';
import HotelCard from '../components/Hotel/HotelCard';
import { Hotel, SearchFilters } from '../types';

const Home: React.FC = () => {
  const [featuredHotels, setFeaturedHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFeaturedHotels();
  }, []);

  const fetchFeaturedHotels = async () => {
    try {
      const response = await fetch('/api/hotels?limit=6');
      if (response.ok) {
        const data = await response.json();
        setFeaturedHotels(data.slice(0, 6));
      }
    } catch (error) {
      console.error('Failed to fetch featured hotels:', error);
    }
  };

  const handleSearch = (filters: SearchFilters) => {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        searchParams.append(key, value.toString());
      }
    });
    
    window.location.href = `/hotels?${searchParams.toString()}`;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pearlstay-primary via-pearlstay-secondary to-pearlstay-accent text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Your Perfect Stay at <span className="text-pearlstay-background">PearlStay</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover luxury hotels and book your dream vacation
            </p>
          </div>

          <SearchBar onSearch={handleSearch} className="max-w-4xl mx-auto" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PearlStay?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the finest hospitality with our curated selection of luxury hotels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-pearlstay-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <HotelIcon className="h-8 w-8 text-pearlstay-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Luxury Properties</h3>
              <p className="text-gray-600">Handpicked hotels offering exceptional comfort and service</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-pearlstay-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-pearlstay-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Best Prices</h3>
              <p className="text-gray-600">Competitive rates with no hidden fees and instant confirmation</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-pearlstay-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-pearlstay-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer service for a seamless experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Hotels</h2>
            <p className="text-gray-600">Discover our most popular destinations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/hotels"
              className="inline-flex items-center bg-pearlstay-primary text-white px-8 py-3 rounded-lg hover:bg-pearlstay-secondary transition-colors font-medium"
            >
              <HotelIcon className="h-5 w-5 mr-2" />
              View All Hotels
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;