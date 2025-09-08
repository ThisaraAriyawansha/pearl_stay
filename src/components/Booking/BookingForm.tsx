import React, { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

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
          adult_count: adultCount,
        },
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
      setToastMessage('Please login to make a booking');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
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
        special_note: specialNote,
      });

      setToastMessage('Booking created successfully!');
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        onBookingSuccess();
      }, 2000);
    } catch (error: any) {
      setToastMessage(error.response?.data?.error || 'Booking failed');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = checkIn && checkOut && roomCount > 0 && adultCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <h3 className="mb-6 text-xl font-semibold text-[#747293]">Book Your Stay</h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <label className="block mb-1 text-sm font-medium text-[#747293]">Check-in Date</label>
            <div className="relative">
              <Calendar className="absolute w-4 h-4 text-[#908ea9] left-3 top-3" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                min={today}
                required
                className="w-full py-2 pl-10 pr-3 border border-[#c7c7d4] rounded-md bg-[#e3e3e9] text-[#747293] focus:outline-none focus:ring-2 focus:ring-[#acaabe] focus:border-transparent"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <label className="block mb-1 text-sm font-medium text-[#747293]">Check-out Date</label>
            <div className="relative">
              <Calendar className="absolute w-4 h-4 text-[#908ea9] left-3 top-3" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                min={checkIn || today}
                required
                className="w-full py-2 pl-10 pr-3 border border-[#c7c7d4] rounded-md bg-[#e3e3e9] text-[#747293] focus:outline-none focus:ring-2 focus:ring-[#acaabe] focus:border-transparent"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <label className="block mb-1 text-sm font-medium text-[#747293]">Number of Rooms</label>
            <div className="relative">
              <select
                value={roomCount}
                onChange={(e) => setRoomCount(parseInt(e.target.value))}
                className="w-full py-2 pl-3 pr-10 border border-[#c7c7d4] rounded-md bg-[#e3e3e9] text-[#747293] focus:outline-none focus:ring-2 focus:ring-[#acaabe] focus:border-transparent appearance-none"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num} Room{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <label className="block mb-1 text-sm font-medium text-[#747293]">Number of Adults</label>
            <div className="relative">
              <Users className="absolute w-4 h-4 text-[#908ea9] left-3 top-3" />
              <select
                value={adultCount}
                onChange={(e) => setAdultCount(parseInt(e.target.value))}
                className="w-full py-2 pl-10 pr-3 border border-[#c7c7d4] rounded-md bg-[#e3e3e9] text-[#747293] focus:outline-none focus:ring-2 focus:ring-[#acaabe] focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                  <option key={num} value={num}>
                    {num} Adult{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <label className="block mb-1 text-sm font-medium text-[#747293]">Special Requests (Optional)</label>
          <textarea
            value={specialNote}
            onChange={(e) => setSpecialNote(e.target.value)}
            placeholder="Any special requests or notes..."
            rows={3}
            className="w-full px-3 py-2 border border-[#c7c7d4] rounded-md bg-[#e3e3e9] text-[#747293] resize-none focus:outline-none focus:ring-2 focus:ring-[#acaabe] focus:border-transparent"
          />
        </motion.div>

        {isFormValid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="p-4 rounded-lg bg-[#e3e3e9]"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#747293]">Total Price:</span>
              <div className="flex items-center space-x-1">
                <span className="text-xl font-bold text-[#747293]">
                  {calculating ? 'Calculating...' : `$${totalPrice.toFixed(2)}`}
                </span>
              </div>
            </div>
            {adultCount > 2 && (
              <p className="mt-1 text-xs text-[#908ea9]">
                *Includes ${room.adult_price}/night surcharge for additional adults
              </p>
            )}
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={loading || !isFormValid || calculating}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 font-medium text-white transition-colors rounded-md bg-[#908ea9] hover:bg-[#acaabe] disabled:bg-[#c7c7d4] disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Book Now'}
        </motion.button>

        {!user && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 }}
            className="text-sm text-center text-[#747293]"
          >
            Please <Link to="/login" className="text-[#acaabe] hover:text-[#747293]">login</Link> to make a booking
          </motion.p>
        )}
      </form>

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-40 right-4 transform -translate-x-1/2 -translate-y-1/2 bg-[#747293] text-white px-6 py-3 rounded-lg shadow-lg text-sm"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BookingForm;