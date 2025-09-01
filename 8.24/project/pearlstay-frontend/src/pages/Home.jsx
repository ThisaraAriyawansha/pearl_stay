import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Hotel, Star, ArrowRight, MapPin, Calendar, Users } from 'lucide-react';
import SearchBar from '../components/SearchBar.jsx';
import HotelCard from '../components/HotelCard.jsx';
import { hotelsAPI } from '../api/hotels.js';

export default function Home() {
  const [featuredHotels, setFeaturedHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedHotels();
  }, []);

  const loadFeaturedHotels = async () => {
    try {
      const response = await hotelsAPI.list();
      // Show first 6 hotels as featured
      setFeaturedHotels(response.data.hotels.slice(0, 6));
    } catch (error) {
      console.error('Failed to load hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (filters) => {
    // Navigate to hotels list with search params
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    window.location.href = `/hotels?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[70vh] bg-gradient-to-r from-pearlstay-primary to-pearlstay-secondary">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Your Perfect Stay Awaits
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fade-in">
              Discover luxury hotels and create unforgettable memories with PearlStay
            </p>
            <Link 
              to="/hotels" 
              className="inline-flex items-center bg-white text-pearlstay-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 animate-slide-up"
            >
              Explore Hotels
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative -mt-16 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SearchBar onSearch={handleSearch} />
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose PearlStay?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the best in hospitality with our curated selection of premium hotels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-pearlstay-bg rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-pearlstay-accent transition-colors">
                <Hotel className="h-8 w-8 text-pearlstay-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Hotels</h3>
              <p className="text-gray-600">Handpicked luxury accommodations for the ultimate experience</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-pearlstay-bg rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-pearlstay-accent transition-colors">
                <Star className="h-8 w-8 text-pearlstay-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Best Prices</h3>
              <p className="text-gray-600">Competitive rates with no hidden fees or booking charges</p>
            </div>
            
            <div className="text-center group">
              <div className="bg-pearlstay-bg rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-pearlstay-accent transition-colors">
                <Users className="h-8 w-8 text-pearlstay-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
              <p className="text-gray-600">Round-the-clock customer service for a seamless experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Hotels</h2>
              <p className="text-gray-600">Discover our most popular destinations</p>
            </div>
            <Link 
              to="/hotels" 
              className="text-pearlstay-primary hover:text-pearlstay-dark font-medium flex items-center"
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-pearlstay-primary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-gray-100 mb-8">
            Join thousands of satisfied travelers who trust PearlStay for their perfect getaway
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/hotels" className="bg-white text-pearlstay-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Hotels
            </Link>
            <Link to="/register" className="bg-pearlstay-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-pearlstay-dark transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}