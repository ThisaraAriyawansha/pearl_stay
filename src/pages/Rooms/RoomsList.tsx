import React, { useState, useEffect } from 'react';
import { Search, Filter, DollarSign, Square, Bed } from 'lucide-react';
import RoomCard from '../../components/Room/RoomCard';
import axios from 'axios';

const RoomsList: React.FC = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    price_min: '',
    price_max: '',
    size: '',
    bed_type: ''
  });

  useEffect(() => {
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const initialFilters = {
      location: urlParams.get('location') || '',
      price_min: urlParams.get('price_min') || '',
      price_max: urlParams.get('price_max') || '',
      size: urlParams.get('size') || '',
      bed_type: urlParams.get('bed_type') || ''
    };
    
    setFilters(initialFilters);
    fetchRooms(initialFilters);
  }, []);

  const fetchRooms = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const params = Object.entries(currentFilters).reduce((acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      }, {} as any);

      const response = await axios.get('http://localhost:5000/api/rooms', { params });
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    fetchRooms();
  };

  const clearFilters = () => {
    const clearedFilters = {
      location: '',
      price_min: '',
      price_max: '',
      size: '',
      bed_type: ''
    };
    setFilters(clearedFilters);
    fetchRooms(clearedFilters);
  };

  const bedTypes = ['Single', 'Double', 'Queen', 'King', 'Twin'];
  const sizes = ['Small', 'Medium', 'Large', 'Suite'];

  return (
    <div className="pt-16 min-h-screen bg-background-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Find Your Perfect Room
          </h1>
          <p className="text-lg text-gray-600">
            Browse through our collection of comfortable and luxurious rooms
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter Rooms</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                placeholder="Location..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="number"
                value={filters.price_min}
                onChange={(e) => handleFilterChange('price_min', e.target.value)}
                placeholder="Min price..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="number"
                value={filters.price_max}
                onChange={(e) => handleFilterChange('price_max', e.target.value)}
                placeholder="Max price..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Square className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange('size', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All sizes</option>
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Bed className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={filters.bed_type}
                onChange={(e) => handleFilterChange('bed_type', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All bed types</option>
                {bedTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={applyFilters}
              className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Apply Filters</span>
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-96 animate-pulse">
                <div className="bg-gray-300 h-48 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="bg-gray-300 h-4 rounded"></div>
                  <div className="bg-gray-300 h-3 rounded w-2/3"></div>
                  <div className="bg-gray-300 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : rooms.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing {rooms.length} room{rooms.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room: any) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No rooms found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filter criteria</p>
              <button
                onClick={clearFilters}
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsList;