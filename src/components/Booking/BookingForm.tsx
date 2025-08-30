import React, { useState, useEffect } from 'react';
import { Calendar, Users, FileText, CreditCard } from 'lucide-react';
import { Room, PriceCalculation } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface BookingFormProps {
  room: Room;
  onSubmit: (bookingData: any) => void;
  onClose: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ room, onSubmit, onClose }) => {
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    roomCount: 1,
    adultCount: 2,
    specialNote: ''
  });
  const [priceCalculation, setPriceCalculation] = useState<PriceCalculation | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (formData.checkIn && formData.checkOut && formData.checkIn < formData.checkOut) {
      calculatePrice();
    }
  }, [formData.checkIn, formData.checkOut, formData.roomCount, formData.adultCount]);

  const calculatePrice = async () => {
    try {
      const response = await fetch('/api/bookings/calculate-price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: room.id,
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          roomCount: formData.roomCount,
          adultCount: formData.adultCount
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setPriceCalculation(data);
      }
    } catch (error) {
      console.error('Price calculation error:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          roomId: room.id,
          ...formData
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onSubmit(data);
      } else {
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Book {room.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={formData.checkIn}
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
                    required
                    value={formData.checkOut}
                    onChange={(e) => handleInputChange('checkOut', e.target.value)}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pearlstay-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rooms
                </label>
                <select
                  value={formData.roomCount}
                  onChange={(e) => handleInputChange('roomCount', parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pearlstay-primary focus:border-transparent"
                >
                  {Array.from({ length: Math.min(5, room.available_rooms || room.total_room) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} room{i > 0 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adults
                </label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <select
                    value={formData.adultCount}
                    onChange={(e) => handleInputChange('adultCount', parseInt(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pearlstay-primary focus:border-transparent"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} adult{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Notes (Optional)
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  value={formData.specialNote}
                  onChange={(e) => handleInputChange('specialNote', e.target.value)}
                  placeholder="Any special requests or notes..."
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pearlstay-primary focus:border-transparent resize-none"
                />
              </div>
            </div>

            {priceCalculation && (
              <div className="bg-pearlstay-background rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Price Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Room ({priceCalculation.nights} nights × {formData.roomCount} room{formData.roomCount > 1 ? 's' : ''})</span>
                    <span>${priceCalculation.roomPrice.toFixed(2)}</span>
                  </div>
                  {priceCalculation.adultPrice > 0 && (
                    <div className="flex justify-between">
                      <span>Adult fees ({formData.adultCount} adults)</span>
                      <span>${priceCalculation.adultPrice.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="text-pearlstay-primary">${priceCalculation.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !priceCalculation}
                className="flex-1 bg-pearlstay-primary text-white px-4 py-3 rounded-lg hover:bg-pearlstay-secondary transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;