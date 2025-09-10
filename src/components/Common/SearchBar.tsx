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
  const [showGuestOptions, setShowGuestOptions] = useState(false);

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
    <div className={`rounded-lg shadow-lg p-4 md:p-6 ${className}`} style={{ backgroundColor: '#9a99b0' }}>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-5">
        {/* Location Input */}
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

        {/* Check-in Date */}
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

        {/* Check-out Date */}
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

        {/* Guests and Rooms - Mobile friendly version */}
        <div className="relative">
          <label className="block mb-1 text-sm font-medium" style={{ color: '#e3e3e9' }}>Guests & Rooms</label>
          <div 
            className="relative flex items-center w-full px-3 py-2 border rounded-md cursor-pointer"
            style={{ 
              backgroundColor: '#908ea9', 
              borderColor: '#acaabe',
              color: '#e3e3e9',
              height: '42px'
            }}
            onClick={() => setShowGuestOptions(!showGuestOptions)}
          >
            <Users className="w-4 h-4 mr-2" style={{ color: '#c7c7d4' }} />
            <span>{adults} {adults === 1 ? 'Adult' : 'Adults'}, {rooms} {rooms === 1 ? 'Room' : 'Rooms'}</span>
          </div>
          
          {/* Dropdown for guest selection */}
          {showGuestOptions && (
            <div className="absolute left-0 right-0 z-50 p-4 mt-1 rounded-md shadow-lg" style={{ backgroundColor: '#908ea9' }}>
              <div className="mb-3">
                <label className="block mb-1 text-sm font-medium" style={{ color: '#e3e3e9' }}>Adults</label>
                <div className="flex items-center justify-between">
                  <button 
                    type="button"
                    className="flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ backgroundColor: '#acaabe', color: '#747293' }}
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                  >
                    -
                  </button>
                  <span style={{ color: '#e3e3e9' }}>{adults}</span>
                  <button 
                    type="button"
                    className="flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ backgroundColor: '#acaabe', color: '#747293' }}
                    onClick={() => setAdults(Math.min(6, adults + 1))}
                    disabled={adults >= 6}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block mb-1 text-sm font-medium" style={{ color: '#e3e3e9' }}>Rooms</label>
                <div className="flex items-center justify-between">
                  <button 
                    type="button"
                    className="flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ backgroundColor: '#acaabe', color: '#747293' }}
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    disabled={rooms <= 1}
                  >
                    -
                  </button>
                  <span style={{ color: '#e3e3e9' }}>{rooms}</span>
                  <button 
                    type="button"
                    className="flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ backgroundColor: '#acaabe', color: '#747293' }}
                    onClick={() => setRooms(Math.min(5, rooms + 1))}
                    disabled={rooms >= 5}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button
                type="button"
                className="w-full py-2 mt-3 text-center rounded-md"
                style={{ backgroundColor: '#acaabe', color: '#747293' }}
                onClick={() => setShowGuestOptions(false)}
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <button
            type="submit"
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 transition-colors rounded-md md:px-6"
            style={{ backgroundColor: '#acaabe', color: '#747293', height: '42px' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c7c7d4'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#acaabe'}
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;