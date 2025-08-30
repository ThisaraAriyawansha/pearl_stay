import React, { useState, useEffect } from 'react';
import { Users, Hotel as HotelIcon, Calendar, TrendingUp, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Hotel } from '../../types';

const AdminDashboard: React.FC = () => {
  const { token } = useAuth();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalBookings: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/hotels', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (response.ok) {
        const hotelsData = await response.json();
        setHotels(hotelsData);
        
        // Calculate basic stats (in a real app, you'd have dedicated endpoints)
        setStats({
          totalUsers: 0, // Would fetch from /api/admin/stats
          totalHotels: hotelsData.length,
          totalBookings: 0,
          revenue: 0
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateHotelStatus = async (hotelId: number, statusId: number) => {
    try {
      const response = await fetch(`/api/hotels/${hotelId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status_id: statusId }),
      });

      if (response.ok) {
        setHotels(prev => 
          prev.map(hotel => 
            hotel.id === hotelId 
              ? { ...hotel, status_id: statusId }
              : hotel
          )
        );
      }
    } catch (error) {
      console.error('Failed to update hotel status:', error);
    }
  };

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1:
        return 'bg-green-100 text-green-800';
      case 0:
        return 'bg-yellow-100 text-yellow-800';
      case 2:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (statusId: number) => {
    switch (statusId) {
      case 1:
        return 'Approved';
      case 0:
        return 'Pending';
      case 2:
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor and manage the PearlStay platform</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Users</h3>
                <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-pearlstay-primary/10 p-3 rounded-lg">
                <HotelIcon className="h-6 w-6 text-pearlstay-primary" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Hotels</h3>
                <p className="text-2xl font-bold text-pearlstay-primary">{stats.totalHotels}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Total Bookings</h3>
                <p className="text-2xl font-bold text-green-600">{stats.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
                <p className="text-2xl font-bold text-purple-600">${stats.revenue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Management */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Hotel Management</h2>
          </div>

          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : hotels.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(hotel.status_id)}`}>
                          {getStatusText(hotel.status_id)}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <HotelIcon className="h-4 w-4 mr-2" />
                          <span>{hotel.location}</span>
                        </div>
                        <div>
                          Owner: {hotel.owner_email}
                        </div>
                        <div>
                          Created: {new Date(hotel.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {hotel.description && (
                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">{hotel.description}</p>
                      )}
                    </div>

                    {hotel.status_id === 0 && (
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => updateHotelStatus(hotel.id, 1)}
                          className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateHotelStatus(hotel.id, 2)}
                          className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <HotelIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No hotels to manage</h3>
              <p className="text-gray-500">Hotels will appear here once owners start adding properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;