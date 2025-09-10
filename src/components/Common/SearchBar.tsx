import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, Home, ChevronDown } from 'lucide-react';

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
  const [showAdultsDropdown, setShowAdultsDropdown] = useState(false);
  const [showRoomsDropdown, setShowRoomsDropdown] = useState(false);
  
  const adultsDropdownRef = useRef<HTMLDivElement>(null);
  const roomsDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adultsDropdownRef.current && !adultsDropdownRef.current.contains(event.target as Node)) {
        setShowAdultsDropdown(false);
      }
      if (roomsDropdownRef.current && !roomsDropdownRef.current.contains(event.target as Node)) {
        setShowRoomsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

                {/* Adults Dropdown with Increment/Decrement */}
        <div className="relative" ref={adultsDropdownRef}>
          <label className="block mb-1 text-sm font-medium" style={{ color: '#e3e3e9' }}>Adults</label>
          <div 
            className="relative flex items-center justify-between w-full px-3 py-2 border rounded-md cursor-pointer"
            style={{ 
              backgroundColor: '#908ea9', 
              borderColor: '#acaabe',
              color: '#e3e3e9',
              height: '42px'
            }}
            onClick={() => {
              setShowAdultsDropdown(!showAdultsDropdown);
              setShowRoomsDropdown(false);
            }}
          >
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" style={{ color: '#c7c7d4' }} />
              <span>{adults}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdultsDropdown ? 'rotate-180' : ''}`} />
          </div>
          
          {/* Adults Dropdown Options with Increment/Decrement */}
          {showAdultsDropdown && (
            <div className="absolute left-0 right-0 z-50 p-4 mt-1 rounded-md shadow-lg" style={{ backgroundColor: '#908ea9', border: '1px solid #acaabe' }}>
              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-center" style={{ color: '#e3e3e9' }}>Adults</label>
                <div className="flex items-center justify-between">
                  <button 
                    type="button"
                    className="flex items-center justify-center w-8 h-8 transition-colors rounded-full disabled:opacity-50"
                    style={{ backgroundColor: '#acaabe', color: '#747293' }}
                    onClick={() => setAdults(Math.max(1, adults - 1))}
                    disabled={adults <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 text-lg font-medium" style={{ color: '#e3e3e9' }}>{adults}</span>
                  <button 
                    type="button"
                    className="flex items-center justify-center w-8 h-8 transition-colors rounded-full disabled:opacity-50"
                    style={{ backgroundColor: '#acaabe', color: '#747293' }}
                    onClick={() => setAdults(Math.min(6, adults + 1))}
                    disabled={adults >= 6}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <button
                type="button"
                className="w-full py-2 text-center transition-colors rounded-md"
                style={{ backgroundColor: '#acaabe', color: '#747293' }}
                onClick={() => setShowAdultsDropdown(false)}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c7c7d4'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#acaabe'}
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Rooms Dropdown with Increment/Decrement */}
        <div className="relative" ref={roomsDropdownRef}>
          <label className="block mb-1 text-sm font-medium" style={{ color: '#e3e3e9' }}>Rooms</label>
          <div 
            className="relative flex items-center justify-between w-full px-3 py-2 border rounded-md cursor-pointer"
            style={{ 
              backgroundColor: '#908ea9', 
              borderColor: '#acaabe',
              color: '#e3e3e9',
              height: '42px'
            }}
            onClick={() => {
              setShowRoomsDropdown(!showRoomsDropdown);
              setShowAdultsDropdown(false);
            }}
          >
            <div className="flex items-center">
              <Home className="w-4 h-4 mr-2" style={{ color: '#c7c7d4' }} />
              <span>{rooms}</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${showRoomsDropdown ? 'rotate-180' : ''}`} />
          </div>
          
          {/* Rooms Dropdown Options with Increment/Decrement */}
          {showRoomsDropdown && (
            <div className="absolute left-0 right-0 z-50 p-4 mt-1 rounded-md shadow-lg" style={{ backgroundColor: '#908ea9', border: '1px solid #acaabe' }}>
              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-center" style={{ color: '#e3e3e9' }}>Rooms</label>
                <div className="flex items-center justify-between">
                  <button 
                    type="button"
                    className="flex items-center justify-center w-8 h-8 transition-colors rounded-full disabled:opacity-50"
                    style={{ backgroundColor: '#acaabe', color: '#747293' }}
                    onClick={() => setRooms(Math.max(1, rooms - 1))}
                    disabled={rooms <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 text-lg font-medium" style={{ color: '#e3e3e9' }}>{rooms}</span>
                  <button 
                    type="button"
                    className="flex items-center justify-center w-8 h-8 transition-colors rounded-full disabled:opacity-50"
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
                className="w-full py-2 text-center transition-colors rounded-md"
                style={{ backgroundColor: '#acaabe', color: '#747293' }}
                onClick={() => setShowRoomsDropdown(false)}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c7c7d4'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#acaabe'}
              >
                Done
              </button>
            </div>
          )}
        </div>

{/* Check-in Date */}
  <div className="relative">
    <label className="block mb-1 text-sm font-medium" style={{ color: '#e3e3e9' }}>Check-in</label>
    <div className="relative">
      <input
        type="date"
        value={checkIn}
        onChange={(e) => setCheckIn(e.target.value)}
        min={today}
        className="w-full pl-3 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent [color-scheme:dark]"
        style={{ 
          backgroundColor: '#908ea9', 
          borderColor: '#acaabe',
          color: '#e3e3e9'
        }}
      />
    </div>
  </div>

  {/* Check-out Date */}
  <div className="relative w-full">
    <label className="block w-full mb-1 text-sm font-medium" style={{ color: '#e3e3e9' }}>Check-out</label>
    <div className="relative w-full">
      <input
        type="date"
        value={checkOut}
        onChange={(e) => setCheckOut(e.target.value)}
        min={checkIn || today}
        className="w-full pl-3 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent [color-scheme:dark]"
        style={{ 
          backgroundColor: '#908ea9', 
          borderColor: '#acaabe',
          color: '#e3e3e9'
        }}
      />
    </div>
  </div>



        {/* Search Button */}
        <div className="flex items-end md:col-span-5">
          <button
            type="submit"
            className="flex items-center justify-center w-full px-4 py-2 space-x-2 transition-colors rounded-md md:px-6"
            style={{ backgroundColor: '#acaabe', color: '#747293', height: '42px' }}
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