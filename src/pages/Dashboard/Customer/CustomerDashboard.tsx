import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, CreditCard, Search, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CustomerDashboard: React.FC = () => {
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    totalSpent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings/me');
      const bookings = response.data.bookings;
      
      const now = new Date();
      const upcomingBookings = bookings.filter((b: any) => new Date(b.check_in) > now);
      const totalSpent = bookings
        .filter((b: any) => b.booking_status === 'confirmed')
        .reduce((sum: number, b: any) => sum + parseFloat(b.price), 0);

      setStats({
        totalBookings: bookings.length,
        upcomingBookings: upcomingBookings.length,
        totalSpent
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Upcoming Trips',
      value: stats.upcomingBookings,
      icon: Clock,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Spent',
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-white rounded-lg shadow-md animate-pulse">
              <div className="w-12 h-12 mb-4 bg-gray-300 rounded-lg"></div>
              <div className="w-1/2 h-4 mb-2 bg-gray-300 rounded"></div>
              <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
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
          <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">Welcome Back!</h1>
          <p className="text-gray-600">Plan your next amazing getaway</p>
        </div>
        <Link
          to="/hotels"
          className="flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
        >
          <Search className="w-4 h-4" />
          <span>Find Hotels</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {statCards.map((stat, index) => (
          <div key={index} className="p-6 transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="p-6 bg-white rounded-lg shadow-md lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
            <Link
              to="/dashboard/customer/bookings"
              className="text-sm font-medium transition-colors text-primary-600 hover:text-primary-700"
            >
              View All
            </Link>
          </div>
          
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{booking.room_name}</h4>
                    <p className="text-sm text-gray-600">{booking.hotel_name}</p>
                    <div className="flex items-center mt-1 space-x-1 text-xs text-gray-500">
                      <MapPin className="w-3 h-3" />
                      <span>{booking.hotel_location}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(booking.check_in).toLocaleDateString()} - {new Date(booking.check_out).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${booking.price}</p>
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
            <div className="py-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-4 text-gray-500">No bookings yet</p>
              <Link
                to="/hotels"
                className="px-6 py-2 text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
              >
                Book Your First Stay
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/hotels"
              className="flex items-center p-3 space-x-3 transition-colors rounded-lg bg-primary-50 hover:bg-primary-100"
            >
              <Search className="w-5 h-5 text-primary-600" />
              <span className="font-medium text-primary-700">Find Hotels</span>
            </Link>
            <Link
              to="/rooms"
              className="flex items-center p-3 space-x-3 transition-colors rounded-lg bg-secondary-50 hover:bg-secondary-100"
            >
              <Eye className="w-5 h-5 text-secondary-600" />
              <span className="font-medium text-secondary-700">Browse Rooms</span>
            </Link>
            <Link
              to="/dashboard/customer/bookings"
              className="flex items-center p-3 space-x-3 transition-colors rounded-lg bg-accent-50 hover:bg-accent-100"
            >
              <Calendar className="w-5 h-5 text-accent-600" />
              <span className="font-medium text-accent-700">My Bookings</span>
            </Link>
          </div>

          {/* Travel Tips */}
          <div className="p-4 mt-6 rounded-lg bg-gradient-to-r from-primary-50 to-accent-50">
            <h4 className="mb-2 font-semibold text-gray-800">💡 Travel Tip</h4>
            <p className="text-sm text-gray-600">
              Book in advance for better rates and availability, especially during peak seasons!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;