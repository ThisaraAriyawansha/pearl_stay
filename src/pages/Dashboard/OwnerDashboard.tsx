import React, { useState, useEffect } from 'react';
import { Plus, Hotel as HotelIcon, Calendar, Users, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Hotel, Booking } from '../../types';

const OwnerDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [hotelsResponse, bookingsResponse] = await Promise.all([
        fetch('/api/hotels/my', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/bookings/hotel', {
          headers: { 'Authorization': `Bearer ${token}` },
        })
      ]);

      if (hotelsResponse.ok) {
        const hotelsData = await hotelsResponse.json();
        setHotels(hotelsData);
      }

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        setBookings(bookingsData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = bookings
    .filter(b => b.booking_status === 'confirmed')
    .reduce((total, booking) => total + Number(booking.price), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateBookingStatus = async (bookingId: number, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ booking_status: status }),
      });

      if (response.ok) {
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, booking_status: status as any }
              : booking
          )
        );
      }
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hotel Owner Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your hotels and bookings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-pearlstay-primary/10 p-3 rounded-lg">
                <HotelIcon className="h-6 w-6 text-pearlstay-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">My Hotels</h3>
                <p className="text-2xl font-bold text-pearlstay-primary">{hotels.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Bookings</h3>
                <p className="text-2xl font-bold text-blue-600">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
                <p className="text-2xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Pending</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter(b => b.booking_status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Hotels Section */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">My Hotels</h2>
              <button className="bg-pearlstay-primary text-white px-4 py-2 rounded-lg hover:bg-pearlstay-secondary transition-colors flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Add Hotel
              </button>
            </div>
          </div>

          <div className="p-6">
            {hotels.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-gray-900 mb-2">{hotel.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{hotel.location}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{hotel.total_rooms || 0} rooms</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        hotel.status_id === 1 ? 'bg-green-100 text-green-800' : 
                        hotel.status_id === 0 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {hotel.status_id === 1 ? 'Approved' : hotel.status_id === 0 ? 'Pending' : 'Rejected'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <HotelIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hotels yet</h3>
                <p className="text-gray-500 mb-6">Start by adding your first hotel property</p>
                <button className="bg-pearlstay-primary text-white px-6 py-3 rounded-lg hover:bg-pearlstay-secondary transition-colors">
                  Add Your First Hotel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
          </div>

          <div className="p-6">
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.slice(0, 10).map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{booking.hotel_name}</h3>
                        <p className="text-gray-600 text-sm">{booking.room_name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.booking_status)}`}>
                          {booking.booking_status.charAt(0).toUpperCase() + booking.booking_status.slice(1)}
                        </span>
                        {booking.booking_status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>Check-in: {new Date(booking.check_in).toLocaleDateString()}</div>
                      <div>Check-out: {new Date(booking.check_out).toLocaleDateString()}</div>
                      <div>Guests: {booking.adult_count}</div>
                      <div className="font-semibold">${Number(booking.price).toFixed(2)}</div>
                    </div>

                    <div className="mt-3 text-sm text-gray-500">
                      Customer: {booking.customer_email}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookings yet</h3>
                <p className="text-gray-500">Bookings will appear here once customers start booking your rooms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;