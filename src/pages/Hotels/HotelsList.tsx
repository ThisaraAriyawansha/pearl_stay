import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import HotelCard from '../../components/Hotel/HotelCard';
import axios from 'axios';

const HotelsList: React.FC = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/hotels', {
        params: {
          status: 1,
          location: locationFilter
        }
      });
      setHotels(response.data.hotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchHotels();
  };

  const filteredHotels = hotels.filter((hotel: any) =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
          <div
            className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center text-center text-white bg-cover bg-center"
            style={{
              backgroundImage: "url('/image/46190-hotel-malvivy-pool-interior-ocean-sea-houses-buildings-sky-sunset-3.jpg')",
              backgroundAttachment: "fixed",
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/60"></div>
            
            <div className="relative z-10 max-w-4xl px-4 mx-auto">
              <p className="mb-2 text-xs tracking-wide uppercase sm:text-sm md:text-base md:mb-3">
                {`Find the perfect accommodation for your next adventure — from cozy boutique stays to luxurious beachfront resorts, tailored to your travel style and budget.`}
              </p>

              <div className="w-20 sm:w-24 md:w-32 h-[1px] bg-gray-300 mx-auto mb-3 md:mb-4"></div>
              <h1 className="text-2xl font-light sm:text-3xl md:text-4xl lg:text-5xl">
                Discover Amazing Hotels
              </h1>
            </div>
          </div>

      {/* Search and Filters */}
      <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-6 mb-8 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search hotels..."
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <MapPin className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <input
                type="text"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                placeholder="Filter by location..."
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleSearch}
              className="flex items-center justify-center px-6 py-2 space-x-2 text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
            >
              <Filter className="w-4 h-4" />
              <span>Apply Filters</span>
            </button>
          </div>
        </div>

        {/* Results */}
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
        ) : filteredHotels.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {filteredHotels.length} hotel{filteredHotels.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredHotels.map((hotel: any) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          </>
        ) : (
          <div className="py-12 text-center">
            <div className="p-8 bg-white rounded-lg shadow-md">
              <h3 className="mb-2 text-xl font-semibold text-gray-800">No hotels found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelsList;