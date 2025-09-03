import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

interface Room {
  id: number;
  name: string;
  price_per_night: number;
  adult_price: number;
  hotel_name: string;
  hotel_location: string;
}

interface BookingFormProps {
  room: Room;
  onBookingSuccess: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ room, onBookingSuccess }) => {
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomCount, setRoomCount] = useState(1);
  const [adultCount, setAdultCount] = useState(1);
  const [specialNote, setSpecialNote] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (checkIn && checkOut && roomCount && adultCount) {
      calculatePrice();
    }
  }, [checkIn, checkOut, roomCount, adultCount]);

  const calculatePrice = async () => {
    if (!checkIn || !checkOut) return;
    
    setCalculating(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/bookings/calculate-price`, {
        params: {
          room_id: room.id,
          check_in: checkIn,
          check_out: checkOut,
          room_count: roomCount,
          adult_count: adultCount
        }
      });
      setTotalPrice(parseFloat(response.data.totalPrice));
    } catch (error) {
      console.error('Price calculation error:', error);
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to make a booking');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        room_id: room.id,
        check_in: checkIn,
        check_out: checkOut,
        room_count: roomCount,
        adult_count: adultCount,
        special_note: specialNote
      });

      alert('Booking created successfully!');
      onBookingSuccess();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = checkIn && checkOut && roomCount > 0 && adultCount > 0;

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="mb-6 text-xl font-semibold text-gray-800">Book Your Stay</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Check-in Date</label>
            <div className="relative">
              <Calendar className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={today}
                required
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Check-out Date</label>
            <div className="relative">
              <Calendar className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || today}
                required
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Number of Rooms</label>
            <select
              value={roomCount}
              onChange={(e) => setRoomCount(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Number of Adults</label>
            <div className="relative">
              <Users className="absolute w-4 h-4 text-gray-400 left-3 top-3" />
              <select
                value={adultCount}
                onChange={(e) => setAdultCount(parseInt(e.target.value))}
                className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Special Requests (Optional)</label>
          <textarea
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
            placeholder="Any special requests or notes..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {isFormValid && (
          <div className="p-4 rounded-lg bg-background-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Price:</span>
              <div className="flex items-center space-x-1">
                <span className="text-xl font-bold text-primary-600">
                  {calculating ? 'Calculating...' : `$${totalPrice.toFixed(2)}`}
                </span>
              </div>
            </div>
            {adultCount > 2 && (
              <p className="mt-1 text-xs text-gray-500">
                *Includes ${room.adult_price}/night surcharge for additional adults
              </p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isFormValid || calculating}
          className="w-full py-3 font-medium text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </button>

        {!user && (
          <p className="text-sm text-center text-gray-500">
            Please <Link to="/login" className="text-primary-600 hover:text-primary-700">login</Link> to make a booking
          </p>
        )}
      </form>
    </div>
  );
};

export default BookingForm;