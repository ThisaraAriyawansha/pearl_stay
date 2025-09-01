import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Hotel,
  Calendar,
  Settings,
  Menu,
  X,
  LogOut,
  Home,
  Bed,
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalRooms: 0,
    totalBookings: 0,
    pendingHotels: 0,
    activeBookings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, hotelsRes, roomsRes, bookingsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/users'),
          axios.get('http://localhost:5000/api/hotels'),
          axios.get('http://localhost:5000/api/rooms'),
          axios.get('http://localhost:5000/api/bookings/all'),
        ]);

        const users = usersRes.data.users || [];
        const hotels = hotelsRes.data.hotels || [];
        const rooms = roomsRes.data.rooms || [];
        const bookings = bookingsRes.data.bookings || [];

        setStats({
          totalUsers: users.length,
          totalHotels: hotels.length,
          totalRooms: rooms.length,
          totalBookings: bookings.length,
          pendingHotels: hotels.filter((h: any) => h.status_id === 2).length,
          activeBookings: bookings.filter((b: any) => b.booking_status === 'confirmed').length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getMenuItems = () => {
    const basePath = `/dashboard/${user?.role}`;
    switch (user?.role) {
      case 'admin':
        return [
          { path: basePath, icon: Home, label: 'Dashboard' },
          { path: `${basePath}/users`, icon: Users, label: 'Users' },
          { path: `${basePath}/hotels`, icon: Hotel, label: 'Hotels' },
          { path: `${basePath}/rooms`, icon: Bed, label: 'Rooms' },
          { path: `${basePath}/bookings`, icon: Calendar, label: 'Bookings' },
        ];
      case 'owner':
        return [
          { path: basePath, icon: Home, label: 'Dashboard' },
          { path: `${basePath}/hotels`, icon: Hotel, label: 'My Hotels' },
          { path: `${basePath}/rooms`, icon: Bed, label: 'My Rooms' },
          { path: `${basePath}/bookings`, icon: Calendar, label: 'Bookings' },
          { path: `${basePath}/profile`, icon: Settings, label: 'Profile' },
        ];
      case 'customer':
        return [
          { path: basePath, icon: Home, label: 'Dashboard' },
          { path: `${basePath}/bookings`, icon: Calendar, label: 'My Bookings' },
          { path: `${basePath}/profile`, icon: Settings, label: 'Profile' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const isActive = (path: string) => location.pathname === path;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
    },
    {
      title: 'Total Hotels',
      value: stats.totalHotels,
      icon: Hotel,
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
    },
    {
      title: 'Total Rooms',
      value: stats.totalRooms,
      icon: Bed,
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-700',
    },
    {
      title: 'Pending Hotels',
      value: stats.pendingHotels,
      icon: Building2,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-700',
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-semibold text-gray-800">PearlStay</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-600 lg:hidden hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center mb-6 space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <span className="font-medium text-blue-600">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 space-x-2 text-sm font-medium text-gray-600 transition-colors rounded-lg hover:bg-red-100 hover:text-red-600"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 min-h-screen">
        <header className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 shadow-sm lg:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 lg:hidden hover:text-gray-800"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link
            to="/"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600"
          >
            Back to Website
          </Link>
        </header>

        <main className="p-4 mx-auto lg:p-6 max-w-7xl">
          {loading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="p-4 bg-white rounded-lg shadow animate-pulse min-w-[200px]"
                  >
                    <div className="w-8 h-8 mb-4 bg-gray-200 rounded-full"></div>
                    <div className="w-1/2 h-4 mb-2 bg-gray-200 rounded"></div>
                    <div className="w-1/3 h-6 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 lg:text-3xl">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">Manage your PearlStay platform</p>
              </div>

              <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                  <div
                    key={stat.title}
                    className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow min-w-[200px]"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{stat.title}</p>
                        <p className="text-xl font-semibold text-gray-800">
                          {stat.value.toLocaleString()}
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="p-4 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-semibold text-gray-800">Recent Activity</h2>
                  <div className="space-y-2">
                    <div className="flex items-center p-2 rounded-lg bg-blue-50">
                      <Users className="w-5 h-5 mr-2 text-blue-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">New user registered</p>
                        <p className="text-xs text-gray-500">5 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center p-2 rounded-lg bg-green-50">
                      <Hotel className="w-5 h-5 mr-2 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">Hotel approved</p>
                        <p className="text-xs text-gray-500">20 minutes ago</p>
                      </div>
                    </div>
                    <div className="flex items-center p-2 rounded-lg bg-purple-50">
                      <Calendar className="w-5 h-5 mr-2 text-purple-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-800">New booking created</p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white rounded-lg shadow">
                  <h2 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/dashboard/admin/users"
                      className="p-3 text-center transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
                    >
                      <Users className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                      <span className="text-sm font-medium text-blue-700">Users</span>
                    </Link>
                    <Link
                      to="/dashboard/admin/hotels"
                      className="p-3 text-center transition-colors rounded-lg bg-green-50 hover:bg-green-100"
                    >
                      <Hotel className="w-6 h-6 mx-auto mb-1 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Hotels</span>
                    </Link>
                    <Link
                      to="/dashboard/admin/rooms"
                      className="p-3 text-center transition-colors rounded-lg bg-yellow-50 hover:bg-yellow-100"
                    >
                      <Bed className="w-6 h-6 mx-auto mb-1 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-700">Rooms</span>
                    </Link>
                    <Link
                      to="/dashboard/admin/bookings"
                      className="p-3 text-center transition-colors rounded-lg bg-purple-50 hover:bg-purple-100"
                    >
                      <Calendar className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">Bookings</span>
                    </Link>
                  </div>
                </div>
              </div>

              {stats.pendingHotels > 0 && (
                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Building2 className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-orange-800">
                          {stats.pendingHotels} Hotel{stats.pendingHotels !== 1 ? 's' : ''} Pending
                        </h3>
                        <p className="text-sm text-orange-700">Review new hotel registrations</p>
                      </div>
                    </div>
                    <Link
                      to="/dashboard/admin/hotels"
                      className="px-3 py-1.5 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm"
                    >
                      Review
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;