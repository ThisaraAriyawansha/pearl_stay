import React, { useState, useEffect } from 'react';
import {
  Hotel,
  Bed,
  Calendar,
  TrendingUp,
  Plus,
  Home,
  Menu,
  X,
  LogOut,
  Settings,
  User,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

// Define the different content views
type DashboardView = 'dashboard' | 'hotels' | 'rooms' | 'bookings' | 'settings' | 'add-hotel';

const OwnerDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalRooms: 0,
    totalBookings: 0,
    activeBookings: 0,
    revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // State for the add hotel form
  const [hotelForm, setHotelForm] = useState({
    name: '',
    address: '',
    city: '',
    description: '',
    logo: null as File | null,
    cover_image: null as File | null,
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

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
        revenue,
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
      textColor: 'text-blue-600',
    },
    {
      title: 'Total Rooms',
      value: stats.totalRooms,
      icon: Bed,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
  ];

  // Function to handle sidebar item clicks
  const handleSidebarItemClick = (view: DashboardView) => {
    setCurrentView(view);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHotelForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setHotelForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // Handle form submission
  const handleAddHotel = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!hotelForm.name || !hotelForm.address || !hotelForm.city) {
      setFormError('Please fill in all required fields (Name, Address, City).');
      return;
    }

    const formData = new FormData();
    formData.append('name', hotelForm.name);
    formData.append('location', hotelForm.address);
    formData.append('city', hotelForm.city);
    formData.append('description', hotelForm.description);
    if (hotelForm.logo) {
      formData.append('logo', hotelForm.logo);
    }
    if (hotelForm.cover_image) {
      formData.append('cover_image', hotelForm.cover_image);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/hotels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setFormSuccess(response.data.message);
      // Reset form
      setHotelForm({
        name: '',
        address: '',
        city: '',
        description: '',
        logo: null,
        cover_image: null,
      });
      // Refresh dashboard data
      await fetchDashboardData();
      // Navigate back to dashboard
      setCurrentView('dashboard');
    } catch (error: any) {
      setFormError(error.response?.data?.error || 'Failed to add hotel');
    }
  };

  // Render different content based on current view
  const renderContent = () => {
    switch (currentView) {
      case 'hotels':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">My Hotels</h2>
            <p className="text-gray-600">Manage your hotel properties here.</p>
            {/* Add hotel management content here */}
          </div>
        );
      case 'rooms':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Room Management</h2>
            <p className="text-gray-600">View and manage all your rooms.</p>
            {/* Add room management content here */}
          </div>
        );
      case 'bookings':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Bookings</h2>
            <p className="text-gray-600">View and manage all bookings across your properties.</p>
            {/* Add booking management content here */}
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Settings</h2>
            <p className="text-gray-600">Configure your account and application settings.</p>
            {/* Add settings content here */}
          </div>
        );
      case 'add-hotel':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-2xl font-bold text-gray-800">Add New Hotel</h2>
            <div className="max-w-md">
              <form onSubmit={handleAddHotel} className="space-y-4">
                {formError && (
                  <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{formError}</div>
                )}
                {formSuccess && (
                  <div className="p-3 text-sm text-green-700 bg-green-100 rounded-md">{formSuccess}</div>
                )}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Hotel Name</label>
                  <input
                    type="text"
                    name="name"
                    value={hotelForm.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter hotel name"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={hotelForm.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter hotel address"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={hotelForm.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter city"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={hotelForm.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter hotel description"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Logo</label>
                  <input
                    type="file"
                    name="logo"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Cover Image</label>
                  <input
                    type="file"
                    name="cover_image"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add Hotel
                </button>
              </form>
            </div>
          </div>
        );
      default: // dashboard view
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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

            {/* Recent Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Recent Bookings</h3>
                {recentBookings.length > 0 ? (
                  <div className="space-y-3">
                    {recentBookings.map((booking: any) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                        <div>
                          <p className="text-sm font-medium text-gray-800">{booking.room_name}</p>
                          <p className="text-xs text-gray-500">{booking.customer_name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(booking.check_in).toLocaleDateString()} -{' '}
                            {new Date(booking.check_out).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-green-600">${booking.price}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              booking.booking_status === 'confirmed'
                                ? 'bg-green-100 text-green-700'
                                : booking.booking_status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {booking.booking_status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="py-4 text-center text-gray-500">No recent bookings</p>
                )}
              </div>

              <div className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="mb-4 text-lg font-semibold text-gray-800">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleSidebarItemClick('hotels')}
                    className="flex items-center p-4 space-x-3 transition-colors rounded-lg bg-primary-50 hover:bg-primary-100"
                  >
                    <Hotel className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-primary-700">Manage Hotels</span>
                  </button>
                  <button
                    onClick={() => handleSidebarItemClick('rooms')}
                    className="flex items-center p-4 space-x-3 transition-colors rounded-lg bg-secondary-50 hover:bg-secondary-100"
                  >
                    <Bed className="w-5 h-5 text-secondary-600" />
                    <span className="font-medium text-secondary-700">Manage Rooms</span>
                  </button>
                  <button
                    onClick={() => handleSidebarItemClick('bookings')}
                    className="flex items-center p-4 space-x-3 transition-colors rounded-lg bg-accent-50 hover:bg-accent-100"
                  >
                    <Calendar className="w-5 h-5 text-accent-600" />
                    <span className="font-medium text-accent-700">View Bookings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const Sidebar = () => (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 z-30 h-screen w-64 transform transition-transform duration-300 ease-in-out
        bg-[#747293] text-white lg:translate-x-0 lg:static lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#908ea9]">
          <h1 className="text-xl font-bold">Hotel Manager</h1>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          <div className="mb-6 flex items-center space-x-3 rounded-lg bg-[#908ea9] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#acaabe]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name || 'Owner Name'}</p>
              <p className="text-xs text-[#c7c7d4]">Hotel Owner</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => handleSidebarItemClick('dashboard')}
              className={`flex w-full items-center space-x-3 rounded-lg p-3 ${
                currentView === 'dashboard'
                  ? 'bg-[#908ea9] text-white'
                  : 'text-[#c7c7d4] hover:bg-[#908ea9] hover:text-white'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleSidebarItemClick('add-hotel')}
              className={`flex w-full items-center space-x-3 rounded-lg p-3 ${
                currentView === 'add-hotel'
                  ? 'bg-[#908ea9] text-white'
                  : 'text-[#c7c7d4] hover:bg-[#908ea9] hover:text-white'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Add Hotel</span>
            </button>

            <button
              onClick={() => handleSidebarItemClick('hotels')}
              className={`flex w-full items-center space-x-3 rounded-lg p-3 ${
                currentView === 'hotels'
                  ? 'bg-[#908ea9] text-white'
                  : 'text-[#c7c7d4] hover:bg-[#908ea9] hover:text-white'
              }`}
            >
              <Hotel className="w-5 h-5" />
              <span>My Hotels</span>
            </button>
            <button
              onClick={() => handleSidebarItemClick('rooms')}
              className={`flex w-full items-center space-x-3 rounded-lg p-3 ${
                currentView === 'rooms'
                  ? 'bg-[#908ea9] text-white'
                  : 'text-[#c7c7d4] hover:bg-[#908ea9] hover:text-white'
              }`}
            >
              <Bed className="w-5 h-5" />
              <span>Rooms</span>
            </button>
            <button
              onClick={() => handleSidebarItemClick('bookings')}
              className={`flex w-full items-center space-x-3 rounded-lg p-3 ${
                currentView === 'bookings'
                  ? 'bg-[#908ea9] text-white'
                  : 'text-[#c7c7d4] hover:bg-[#908ea9] hover:text-white'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span>Bookings</span>
            </button>
            <button
              onClick={() => handleSidebarItemClick('settings')}
              className={`flex w-full items-center space-x-3 rounded-lg p-3 ${
                currentView === 'settings'
                  ? 'bg-[#908ea9] text-white'
                  : 'text-[#c7c7d4] hover:bg-[#908ea9] hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 w-full border-t border-[#908ea9] p-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-3 rounded-lg p-3 text-[#c7c7d4] hover:bg-[#908ea9] hover:text-white"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 p-6 lg:ml-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 bg-white rounded-lg shadow-md animate-pulse">
                <div className="w-12 h-12 mb-4 bg-gray-300 rounded-lg"></div>
                <div className="w-1/2 h-4 mb-2 bg-gray-300 rounded"></div>
                <div className="w-1/3 h-6 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden lg:ml-0">
        {/* Top header */}
        <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
          <button className="rounded-md lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-500" />
          </button>

          <div className="flex-1 lg:flex-none">
            <h1 className="ml-2 text-xl font-semibold text-gray-800 lg:ml-0">
              {currentView === 'dashboard' && 'Owner Dashboard'}
              {currentView === 'hotels' && 'My Hotels'}
              {currentView === 'rooms' && 'Room Management'}
              {currentView === 'bookings' && 'Booking Management'}
              {currentView === 'settings' && 'Settings'}
              {currentView === 'add-hotel' && 'Add New Hotel'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleSidebarItemClick('add-hotel')}
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-md bg-primary-600 hover:bg-primary-700"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Hotel</span>
            </button>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default OwnerDashboard;