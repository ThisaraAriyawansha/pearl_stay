import { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

export default function SearchBar({ onSearch, loading = false }) {
  const [filters, setFilters] = useState({
    location: '',
    check_in: '',
    check_out: '',
    adult_count: 1,
    room_count: 1
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:grid md:grid-cols-5 md:gap-4">
        {/* Location */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Where to?"
              value={filters.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Check-in */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-in
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              min={today}
              value={filters.check_in}
              onChange={(e) => handleChange('check_in', e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Check-out
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              min={filters.check_in || today}
              value={filters.check_out}
              onChange={(e) => handleChange('check_out', e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Guests */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Guests & Rooms
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <Users className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filters.adult_count}
                onChange={(e) => handleChange('adult_count', parseInt(e.target.value))}
                className="input pl-8 text-sm"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Adult{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
            <select
              value={filters.room_count}
              onChange={(e) => handleChange('room_count', parseInt(e.target.value))}
              className="input text-sm"
            >
              {[...Array(5)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} Room{i > 0 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center space-x-2 h-[42px]"
          >
            <Search className="h-4 w-4" />
            <span>{loading ? 'Searching...' : 'Search'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}