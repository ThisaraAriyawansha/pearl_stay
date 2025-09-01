import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, CreditCard, Search, Star } from 'lucide-react';
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
          <p className="text-gray-600">Plan your next amazing getaway</p>
        </div>
        <Link
          to="/hotels"
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors flex items-center space-x-2"
        >
          <Search className="h-4 w-4" />
          <span>Find Hotels</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
            <Link
              to="/dashboard/customer/bookings"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
            >
              View All
            </Link>
          </div>
          
          {recentBookings.length > 0 ? (
            <div className="space-y-3">
              {recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{booking.room_name}</h4>
                    <p className="text-sm text-gray-600">{booking.hotel_name}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{booking.hotel_location}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
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
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No bookings yet</p>
              <Link
                to="/hotels"
                className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                Book Your First Stay
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/hotels"
              className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <Search className="h-5 w-5 text-primary-600" />
              <span className="font-medium text-primary-700">Find Hotels</span>
            </Link>
            <Link
              to="/rooms"
              className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg hover:bg-secondary-100 transition-colors"
            >
              <Eye className="h-5 w-5 text-secondary-600" />
              <span className="font-medium text-secondary-700">Browse Rooms</span>
            </Link>
            <Link
              to="/dashboard/customer/bookings"
              className="flex items-center space-x-3 p-3 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors"
            >
              <Calendar className="h-5 w-5 text-accent-600" />
              <span className="font-medium text-accent-700">My Bookings</span>
            </Link>
          </div>

          {/* Travel Tips */}
          <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">💡 Travel Tip</h4>
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