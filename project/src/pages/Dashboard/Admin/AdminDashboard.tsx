import React, { useState, useEffect } from 'react';
import { Users, Hotel, Calendar, TrendingUp, Building2, Bed } from 'lucide-react';
import axios from 'axios';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalRooms: 0,
    totalBookings: 0,
    pendingHotels: 0,
    activeBookings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // In a real app, you'd have a dedicated stats endpoint
      const [usersRes, hotelsRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users'),
        axios.get('http://localhost:5000/api/hotels'),
        axios.get('http://localhost:5000/api/bookings/all')
      ]);

      const users = usersRes.data.users;
      const hotels = hotelsRes.data.hotels;
      const bookings = bookingsRes.data.bookings;

      setStats({
        totalUsers: users.length,
        totalHotels: hotels.length,
        totalRooms: 0, // You'd need to fetch this separately
        totalBookings: bookings.length,
        pendingHotels: hotels.filter((h: any) => h.status_id === 2).length,
        activeBookings: bookings.filter((b: any) => b.booking_status === 'confirmed').length
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Hotels',
      value: stats.totalHotels,
      icon: Hotel,
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
      title: 'Pending Hotels',
      value: stats.pendingHotels,
      icon: Building2,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
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
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your PearlStay platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value.toLocaleString()}</p>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">New user registered</p>
                <p className="text-xs text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
              <Hotel className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">Hotel approved</p>
                <p className="text-xs text-gray-500">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-800">New booking received</p>
                <p className="text-xs text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/dashboard/admin/users"
              className="p-4 bg-primary-50 rounded-lg text-center hover:bg-primary-100 transition-colors"
            >
              <Users className="h-6 w-6 text-primary-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-primary-700">Manage Users</span>
            </Link>
            <Link
              to="/dashboard/admin/hotels"
              className="p-4 bg-secondary-50 rounded-lg text-center hover:bg-secondary-100 transition-colors"
            >
              <Hotel className="h-6 w-6 text-secondary-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-secondary-700">Manage Hotels</span>
            </Link>
            <Link
              to="/dashboard/admin/rooms"
              className="p-4 bg-accent-50 rounded-lg text-center hover:bg-accent-100 transition-colors"
            >
              <Bed className="h-6 w-6 text-accent-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-accent-700">Manage Rooms</span>
            </Link>
            <Link
              to="/dashboard/admin/bookings"
              className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors"
            >
              <Calendar className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm font-medium text-green-700">All Bookings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      {stats.pendingHotels > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Building2 className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-orange-800">
                {stats.pendingHotels} Hotel{stats.pendingHotels !== 1 ? 's' : ''} Awaiting Approval
              </h3>
              <p className="text-sm text-orange-700">
                Review and approve new hotel registrations
              </p>
            </div>
            <Link
              to="/dashboard/admin/hotels"
              className="ml-auto bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
            >
              Review Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;