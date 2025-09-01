import { useState, useEffect } from 'react';
import { Calendar, Users, CreditCard, AlertCircle } from 'lucide-react';
import { calculatePrice, formatCurrency, validateBookingDates } from '../utils/bookingCalc.js';
import { bookingsAPI } from '../api/bookings.js';
import { isAuthenticated } from '../utils/auth.js';

export default function BookingForm({ room, onBookingSuccess }) {
  const [bookingData, setBookingData] = useState({
    check_in: '',
    check_out: '',
    room_count: 1,
    adult_count: 1,
    special_note: ''
  });

  const [priceBreakdown, setPriceBreakdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calculate price whenever booking data changes
  useEffect(() => {
    if (bookingData.check_in && bookingData.check_out && room) {
      const calculation = calculatePrice(
        { pricePerNight: room.price_per_night, adultPrice: room.adult_price },
        bookingData.check_in,
        bookingData.check_out,
        bookingData.room_count,
        bookingData.adult_count
      );
      setPriceBreakdown(calculation);
    } else {
      setPriceBreakdown(null);
    }
  }, [bookingData, room]);

  const handleChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setError('Please login to make a booking');
      return;
    }

    // Validate dates
    const dateValidation = validateBookingDates(bookingData.check_in, bookingData.check_out);
    if (!dateValidation.valid) {
      setError(dateValidation.message);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await bookingsAPI.create({
        room_id: room.id,
        ...bookingData
      });

      onBookingSuccess?.(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Book Your Stay</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-in
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                min={today}
                value={bookingData.check_in}
                onChange={(e) => handleChange('check_in', e.target.value)}
                className="input pl-10"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Check-out
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                min={bookingData.check_in || today}
                value={bookingData.check_out}
                onChange={(e) => handleChange('check_out', e.target.value)}
                className="input pl-10"
                required
              />
            </div>
          </div>
        </div>

        {/* Guests and Rooms */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adults
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={bookingData.adult_count}
                onChange={(e) => handleChange('adult_count', parseInt(e.target.value))}
                className="input pl-10"
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} Adult{i > 0 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rooms
            </label>
            <select
              value={bookingData.room_count}
              onChange={(e) => handleChange('room_count', parseInt(e.target.value))}
              className="input"
            >
              {[...Array(Math.min(5, room?.total_room || 1))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1} Room{i > 0 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Special Note */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Special Requests (Optional)
          </label>
          <textarea
            value={bookingData.special_note}
            onChange={(e) => handleChange('special_note', e.target.value)}
            placeholder="Any special requests or notes..."
            rows={3}
            className="input resize-none"
          />
        </div>

        {/* Price Breakdown */}
        {priceBreakdown && (
          <div className="bg-pearlstay-bg rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-gray-900">Price Breakdown</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>{priceBreakdown.nights} nights × {bookingData.room_count} room(s)</span>
                <span>{formatCurrency(priceBreakdown.base)}</span>
              </div>
              {priceBreakdown.adultSurcharge > 0 && (
                <div className="flex justify-between">
                  <span>Extra adults surcharge</span>
                  <span>{formatCurrency(priceBreakdown.adultSurcharge)}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-pearlstay-primary">{formatCurrency(priceBreakdown.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !priceBreakdown}
          className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="h-4 w-4" />
          <span>
            {loading ? 'Processing...' : `Book for ${priceBreakdown ? formatCurrency(priceBreakdown.total) : 'Book Now'}`}
          </span>
        </button>
      </form>
    </div>
  );
}