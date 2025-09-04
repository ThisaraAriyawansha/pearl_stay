import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';

interface SearchBarProps {
  onSearch: (searchParams: any) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className = '' }) => {
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(1);
  const [rooms, setRooms] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      location,
      check_in: checkIn,
      check_out: checkOut,
      adults,
      rooms
    });
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={`rounded-lg shadow-lg p-6 ${className}`} style={{ backgroundColor: '#9a99b0' }}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="relative">
          <label className="block mb-1 text-sm font-medium" style={{ color: '#e3e3e9' }}>Location</label>
          <div className="relative">
            <MapPin className="absolute w-4 h-4 left-3 top-3" style={{ color: '#c7c7d4' }} />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where to?"
              className="w-full py-2 pl-10 pr-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ 
                backgroundColor: '#908ea9', 
                borderColor: '#acaabe',
                color: '#e3e3e9'
              }}
            />
          </div>
        </div>

        <div className="relative">
          <label className="block mb-1 text-sm font-medium" style={{ color: '#e3e3e9' }}>Check-in</label>
          <div className="relative">
            <Calendar className="absolute w-4 h-4 left-3 top-3" style={{ color: '#c7c7d4' }} />
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent [color-scheme:dark]"
              style={{ 
                backgroundColor: '#908ea9', 
                borderColor: '#acaabe',
                color: '#e3e3e9'
              }}
            />
          </div>
        </div>

        <div className="relative">
          <label className="block mb-1 text-sm font-medium" style={{ color: '#e3e3e9' }}>Check-out</label>
          <div className="relative">
            <Calendar className="absolute w-4 h-4 left-3 top-3" style={{ color: '#c7c7d4' }} />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
              className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent [color-scheme:dark]"
              style={{ 
                backgroundColor: '#908ea9', 
                borderColor: '#acaabe',
                color: '#e3e3e9'
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-1 text-sm font-medium" style={{ color: '#e3e3e9' }}>Adults</label>
            <div className="relative">
              <Users className="absolute w-4 h-4 left-3 top-3" style={{ color: '#c7c7d4' }} />
              <select
                value={adults}
                onChange={(e) => setAdults(parseInt(e.target.value))}
                className="w-full py-2 pl-10 pr-3 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ 
                  backgroundColor: '#908ea9', 
                  borderColor: '#acaabe',
                  color: '#e3e3e9'
                }}
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num} style={{ backgroundColor: '#908ea9', color: '#e3e3e9' }}>{num}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium" style={{ color: '#e3e3e9' }}>Rooms</label>
            <select
              value={rooms}
              onChange={(e) => setRooms(parseInt(e.target.value))}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent"
              style={{ 
                backgroundColor: '#908ea9', 
                borderColor: '#acaabe',
                color: '#e3e3e9'
              }}
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num} style={{ backgroundColor: '#908ea9', color: '#e3e3e9' }}>{num}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            className="flex items-center justify-center w-full px-6 py-2 space-x-2 transition-colors rounded-md"
            style={{ backgroundColor: '#acaabe', color: '#747293' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c7c7d4'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#acaabe'}
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;