import React, { useState, useEffect } from 'react';
import { Hotel, Bed, Calendar, TrendingUp, Plus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const OwnerDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalRooms: 0,
    totalBookings: 0,
    activeBookings: 0,
    revenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const hotelsRes = await axios.get('http://localhost:5000/api/hotels/owner');
      const hotels = hotelsRes.data.hotels;
      
      let totalRooms = 0;
      let totalBookings = 0;
      let activeBookings = 0;
      let revenue = 0;
      const allBookings: any[] = [];

      // Fetch rooms and bookings for each hotel
      for (const hotel of hotels) {
        try {
          const roomsRes = await axios.get(`http://localhost:5000/api/rooms/hotel/${hotel.id}`);
          totalRooms += roomsRes.data.rooms.length;

          const bookingsRes = await axios.get(`http://localhost:5000/api/bookings/hotel/${hotel.id}`);
          const hotelBookings = bookingsRes.data.bookings;
          
          totalBookings += hotelBookings.length;
          activeBookings += hotelBookings.filter((b: any) => b.booking_status === 'confirmed').length;
          revenue += hotelBookings
            .filter((b: any) => b.booking_status === 'confirmed')
            .reduce((sum: number, b: any) => sum + parseFloat(b.price), 0);
          
          allBookings.push(...hotelBookings);
        } catch (error) {
          console.error(`Error fetching data for hotel ${hotel.id}:`, error);
        }
      }

      setStats({
        totalHotels: hotels.length,
        totalRooms,
        totalBookings,
        activeBookings,
        revenue
      });

      // Sort bookings by creation date and take the 5 most recent
      setRecentBookings(
        allBookings
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
      );
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'My Hotels',
      value: stats.totalHotels,
      icon: Hotel,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Rooms',
      value: stats.totalRooms,
      icon: Bed,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
              <div className="bg-gray-300 h-12 w-12 rounded-lg mb-4"></div>
              <div className="bg-gray-300 h-4 rounded w-1/2 mb-2"></div>
              <div className="bg-gray-300 h-6 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Owner Dashboard</h1>
          <p className="text-gray-600">Manage your hotels and track performance</p>
        </div>
        <Link
          to="/dashboard/owner/hotels"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Hotel</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Bookings</h3>
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{booking.room_name}</p>
                    <p className="text-xs text-gray-500">{booking.customer_name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-600">${booking.price}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.booking_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent bookings</p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            <Link
              to="/dashboard/owner/hotels"
              className="flex items-center space-x-3 p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Hotel className="h-5 w-5 text-primary-600" />
              <span className="font-medium text-primary-700">Manage Hotels</span>
            </Link>
            <Link
              to="/dashboard/owner/rooms"
              className="flex items-center space-x-3 p-4 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <Bed className="h-5 w-5 text-secondary-600" />
              <span className="font-medium text-secondary-700">Manage Rooms</span>
            </Link>
            <Link
              to="/dashboard/owner/bookings"
              className="flex items-center space-x-3 p-4 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors"
            >
              <Calendar className="h-5 w-5 text-accent-600" />
              <span className="font-medium text-accent-700">View Bookings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;