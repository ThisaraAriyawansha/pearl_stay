import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, CreditCard, Search, Eye, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

// Define interfaces
interface Booking {
  id: number;
  room_name: string;
  hotel_name: string;
  hotel_location: string;
  check_in: string;
  check_out: string;
  price: string;
  booking_status: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  nic?: string;
}

const SettingsTab = ({
  alert,
  setAlert,
  userForm,
  setUserForm,
  handleUpdateUser,
  handleUserInputChange,
  userDetails,
}: {
  alert: { type: string; message: string; visible: boolean };
  setAlert: React.Dispatch<React.SetStateAction<{ type: string; message: string; visible: boolean }>>;
  userForm: { name: string; email: string; mobile: string; nic: string; password: string; confirmPassword: string };
  setUserForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; mobile: string; nic: string; password: string; confirmPassword: string }>>;
  handleUpdateUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleUserInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userDetails: User | null;
}) => {
  return (
    <div className="w-full p-4 sm:p-6 md:p-8 bg-[#e3e3e9]">
      <div className="max-w-4xl p-6 mx-auto bg-white shadow-sm rounded-xl sm:p-8 md:p-10">
        <h2 className="text-2xl sm:text-3xl font-semibold text-[#747293] mb-6 sm:mb-8">Update Profile</h2>
        {alert.visible && (
          <div
            className={`p-4 mb-6 text-sm rounded-lg flex items-center justify-between ${
              alert.type === 'success' ? 'bg-[#c7c7d4] text-[#747293]' : 'bg-red-100 text-red-700'
            }`}
          >
            <span>{alert.message}</span>
            <button
              onClick={() => setAlert({ type: '', message: '', visible: false })}
              className="text-sm font-semibold"
            >
              ✕
            </button>
          </div>
        )}
        <form onSubmit={handleUpdateUser} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium text-[#747293]">Name</label>
              <input
                type="text"
                name="name"
                value={userForm.name}
                onChange={handleUserInputChange}
                className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                placeholder="Enter your name"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-[#747293]">Email</label>
              <input
                type="email"
                name="email"
                value={userForm.email}
                onChange={handleUserInputChange}
                className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                placeholder="Enter your email"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-[#747293]">Mobile</label>
              <input
                type="text"
                name="mobile"
                value={userForm.mobile}
                onChange={handleUserInputChange}
                className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                placeholder="Enter your mobile number"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-[#747293]">NIC</label>
              <input
                type="text"
                name="nic"
                value={userForm.nic}
                onChange={handleUserInputChange}
                className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                placeholder="Enter your NIC"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-[#747293]">New Password</label>
              <input
                type="password"
                name="password"
                value={userForm.password}
                onChange={handleUserInputChange}
                className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                placeholder="Enter new password (optional)"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-[#747293]">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={userForm.confirmPassword}
                onChange={handleUserInputChange}
                className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full px-6 py-3 mt-6 bg-[#747293] text-white rounded-lg hover:bg-[#908ea9] focus:ring-2 focus:ring-[#acaabe] focus:outline-none transition-all duration-300"
            >
              Update Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setUserForm({
                  name: userDetails?.name || '',
                  email: userDetails?.email || '',
                  mobile: userDetails?.mobile || '',
                  nic: userDetails?.nic || '',
                  password: '',
                  confirmPassword: '',
                });
                setAlert({ type: '', message: '', visible: false });
              }}
              className="w-full px-6 py-3 mt-6 bg-[#c7c7d4] text-[#747293] rounded-lg hover:bg-[#acaabe] focus:ring-2 focus:ring-[#908ea9] focus:outline-none transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CustomerDashboard = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    mobile: '',
    nic: '',
    password: '',
    confirmPassword: '',
  });
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'settings'>('dashboard');

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
      fetchUserDetails();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const bookings: Booking[] = response.data.bookings;

      const now = new Date();
      const upcomingBookings = bookings.filter((b) => new Date(b.check_in) > now);
      const totalSpent = bookings
        .filter((b) => b.booking_status === 'confirmed')
        .reduce((sum, b) => sum + parseFloat(b.price), 0);

      setStats({
        totalBookings: bookings.length,
        upcomingBookings: upcomingBookings.length,
        totalSpent,
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    if (!user?.id) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/userManage/me/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setUserDetails(response.data.user);
      setUserForm({
        name: response.data.user.name,
        email: response.data.user.email,
        mobile: response.data.user.mobile || '',
        nic: response.data.user.nic || '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error fetching user details:', error);
      setAlert({
        type: 'error',
        message: 'Failed to load user details',
        visible: true,
      });
      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert({ type: '', message: '', visible: false });

    if (userForm.password && userForm.password !== userForm.confirmPassword) {
      setAlert({ type: 'error', message: 'Passwords do not match', visible: true });
      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
      return;
    }

    try {
      const updateData: any = {
        name: userForm.name,
        email: userForm.email,
        mobile: userForm.mobile || null,
        nic: userForm.nic || null,
      };

      if (userForm.password) {
        updateData.password = userForm.password;
      }

      const response = await axios.put(
        `http://localhost:5000/api/userManage/me/${user?.id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }

      setAlert({ type: 'success', message: response.data.message, visible: true });

      if (response.data.user) {
        updateUser(response.data.user);
      } else if (user) {
        updateUser({ ...user, name: userForm.name, email: userForm.email });
      }

      await fetchUserDetails();

      setUserForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));

      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Failed to update profile',
        visible: true,
      });
      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
    }
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const statCards = [
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-[#747293]',
      bgColor: 'bg-[#e3e3e9]',
      textColor: 'text-[#747293]',
    },
    {
      title: 'Upcoming Trips',
      value: stats.upcomingBookings,
      icon: Clock,
      color: 'bg-[#908ea9]',
      bgColor: 'bg-[#e3e3e9]',
      textColor: 'text-[#908ea9]',
    },
    {
      title: 'Total Spent',
      value: `$${stats.totalSpent.toLocaleString()}`,
      icon: CreditCard,
      color: 'bg-[#acaabe]',
      bgColor: 'bg-[#e3e3e9]',
      textColor: 'text-[#acaabe]',
    },
  ];

  if (loading) {
    return (
      <div className="p-4 mx-auto space-y-6 sm:p-6 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-white shadow-sm rounded-xl animate-pulse">
              <div className="w-12 h-12 mb-4 bg-[#e3e3e9] rounded-lg"></div>
              <div className="w-1/2 h-4 mb-2 bg-[#e3e3e9] rounded"></div>
              <div className="w-1/3 h-6 bg-[#e3e3e9] rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 mx-auto space-y-6 sm:p-6 max-w-7xl">
      {/* Tab Navigation */}
      <div className="flex items-center gap-4 border-b border-[#c7c7d4]">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'dashboard'
              ? 'text-[#747293] border-b-2 border-[#747293]'
              : 'text-[#908ea9] hover:text-[#747293]'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'settings'
              ? 'text-[#747293] border-b-2 border-[#747293]'
              : 'text-[#908ea9] hover:text-[#747293]'
          }`}
        >
          Settings
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          {/* Header Section */}
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-[#747293]">
                Welcome Back, {user?.name || 'Guest'}!
              </h1>
              <p className="text-sm text-[#908ea9] mt-1">Plan your next unforgettable journey</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/hotels"
                className="flex items-center px-4 py-2 space-x-2 text-white rounded-lg bg-[#747293] hover:bg-[#908ea9] transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>Find Hotels</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 space-x-2 text-[#747293] rounded-lg bg-[#e3e3e9] hover:bg-[#c7c7d4] transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="p-6 transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#908ea9]">{stat.title}</p>
                    <p className="text-2xl font-semibold text-[#747293]">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Recent Bookings */}
            <div className="p-6 bg-white shadow-sm rounded-xl lg:col-span-2">
              <h3 className="text-lg font-semibold text-[#747293] mb-4">Recent Bookings</h3>
              {recentBookings.length > 0 ? (
                <div className="space-y-3">
                  {recentBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-[#e3e3e9] hover:bg-[#c7c7d4] transition-colors"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-[#747293]">{booking.room_name}</h4>
                        <p className="text-sm text-[#908ea9]">{booking.hotel_name}</p>
                        <div className="flex items-center mt-1 space-x-1 text-xs text-[#908ea9]">
                          <MapPin className="w-3 h-3" />
                          <span>{booking.hotel_location}</span>
                        </div>
                        <p className="mt-1 text-xs text-[#908ea9]">
                          {new Date(booking.check_in).toLocaleDateString()} -{' '}
                          {new Date(booking.check_out).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#747293]">${booking.price}</p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            booking.booking_status === 'confirmed'
                              ? 'bg-[#c7c7d4] text-[#747293]'
                              : booking.booking_status === 'pending'
                              ? 'bg-[#e3e3e9] text-[#908ea9]'
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
                <div className="py-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-[#c7c7d4]" />
                  <p className="mb-4 text-[#908ea9]">No bookings yet</p>
                  <Link
                    to="/hotels"
                    className="px-6 py-2 text-white rounded-lg bg-[#747293] hover:bg-[#908ea9] transition-colors"
                  >
                    Book Your First Stay
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="text-lg font-semibold text-[#747293] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/hotels"
                  className="flex items-center p-3 space-x-3 rounded-lg bg-[#e3e3e9] hover:bg-[#c7c7d4] transition-colors"
                >
                  <Search className="w-5 h-5 text-[#747293]" />
                  <span className="font-medium text-[#747293]">Find Hotels</span>
                </Link>
                <Link
                  to="/rooms"
                  className="flex items-center p-3 space-x-3 rounded-lg bg-[#e3e3e9] hover:bg-[#c7c7d4] transition-colors"
                >
                  <Eye className="w-5 h-5 text-[#747293]" />
                  <span className="font-medium text-[#747293]">Browse Rooms</span>
                </Link>
              </div>

              {/* Travel Tips */}
              <div className="p-4 mt-6 rounded-lg bg-gradient-to-r from-[#e3e3e9] to-[#c7c7d4]">
                <h4 className="mb-2 font-semibold text-[#747293]">💡 Travel Tip</h4>
                <p className="text-sm text-[#908ea9]">
                  Book early to secure the best rates and availability, especially during peak seasons!
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <SettingsTab
          alert={alert}
          setAlert={setAlert}
          userForm={userForm}
          setUserForm={setUserForm}
          handleUpdateUser={handleUpdateUser}
          handleUserInputChange={handleUserInputChange}
          userDetails={userDetails}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;