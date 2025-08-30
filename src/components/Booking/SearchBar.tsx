import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { SearchFilters } from '../../types';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleInputChange = (field: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Where to stay?"
              value={filters.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pearlstay-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={filters.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pearlstay-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={filters.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              min={filters.checkIn || new Date().toISOString().split('T')[0]}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pearlstay-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Guests & Rooms
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <select
                value={filters.guests}
                onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pearlstay-primary focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <select
              value={filters.rooms}
              onChange={(e) => handleInputChange('rooms', parseInt(e.target.value))}
              className="w-20 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pearlstay-primary focus:border-transparent"
            >
              {[1, 2, 3, 4].map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="bg-pearlstay-primary text-white px-6 py-3 rounded-lg hover:bg-pearlstay-secondary transition-colors flex items-center justify-center space-x-2 font-medium"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default SearchBar;