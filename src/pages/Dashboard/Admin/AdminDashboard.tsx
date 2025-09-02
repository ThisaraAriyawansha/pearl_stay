import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

import { 
  BarChart3, 
  Users, 
  Hotel, 
  Calendar, 
  Settings, 
  Menu, 
  X,
  User,
  LogOut,
  Bed,
  DollarSign,
  TrendingUp,
  Edit,
  CheckCircle,
  XCircle,
  MoreVertical
} from 'lucide-react';

// Type definitions
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status_id: number;
  mobile?: string;
  nic?: string;
}

interface Hotel {
  id: number;
  name: string;
  location: string;
  rooms?: any[];
  status_id: number;
}

interface Booking {
  id: number;
  user_id: number;
  user_name: string;
  room_id: number;
  room_name: string;
  hotel_name: string;
  check_in: string;
  check_out: string;
  booking_status: string;
  price: number;
}

interface Stats {
  totalUsers: number;
  totalHotels: number;
  totalBookings: number;
  revenue: number;
}

// Main Dashboard Component
const PearlStayDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalHotels: 0,
    totalBookings: 0,
    revenue: 0
  });
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const { user, updateUser } = useAuth();
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    mobile: '',
    nic: '',
    password: '',
    confirmPassword: '',
  });
  
  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    if (!user?.id) return; // prevent call if user is not loaded yet

    try {
      const response = await axios.get(
        `http://localhost:5000/api/userManage/me/${user.id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

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
    }
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));
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

      // Update token if returned
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
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, hotelsResponse, bookingsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/adminManage/user', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:5000/api/adminManage/hotel', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
          axios.get('http://localhost:5000/api/adminManage/booking', {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }),
        ]);

        // Make sure we're working with arrays
        const usersData = Array.isArray(usersResponse.data) ? usersResponse.data : [];
        const hotelsData = Array.isArray(hotelsResponse.data) ? hotelsResponse.data : [];
        const bookingsData = Array.isArray(bookingsResponse.data) ? bookingsResponse.data : [];

        setUsers(usersData);
        setHotels(hotelsData);
        setBookings(bookingsData);

        setStats({
          totalUsers: usersData.length,
          totalHotels: hotelsData.length,
          totalBookings: bookingsData.length,
          revenue: bookingsData.reduce((sum: number, booking: Booking) => sum + booking.price, 0),
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays to prevent further errors
        setUsers([]);
        setHotels([]);
        setBookings([]);
      }
    };

    fetchData();
  }, []);

  // Update user status
  const updateUserStatus = async (userId: number, status: number) => {
    try {
      await axios.put(
        `http://localhost:5000/api/adminManage/user/${userId}`,
        { status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setUsers(users.map(user => (user.id === userId ? { ...user, status_id: status } : user)));
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  // Update hotel status
  const updateHotelStatus = async (hotelId: number, status: number) => {
    try {
      await axios.put(
        `http://localhost:5000/api/adminManage/hotel/${hotelId}`,
        { status_id: status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setHotels(hotels.map(hotel => (hotel.id === hotelId ? { ...hotel, status_id: status } : hotel)));
    } catch (error) {
      console.error('Error updating hotel status:', error);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId: number, status: string) => {
    try {
      await axios.put(
        `http://localhost:5000/api/adminManage/booking/${bookingId}`,
        { booking_status: status },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setBookings(bookings.map(booking => (booking.id === bookingId ? { ...booking, booking_status: status } : booking)));
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  return (
    <div className="flex h-screen bg-[#e3e3e9]">
      {/* Sidebar */}
      <div className={`fixed md:relative z-50 w-64 bg-[#747293] text-white h-full transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300`}>
        <div className="p-4 flex items-center justify-between border-b border-[#908ea9]">
          <h1 className="text-xl font-bold">PearlStay Admin</h1>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-[#908ea9]' : 'hover:bg-[#908ea9]'}`}
              >
                <BarChart3 size={20} className="mr-3" />
                Dashboard
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('users')}
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'users' ? 'bg-[#908ea9]' : 'hover:bg-[#908ea9]'}`}
              >
                <Users size={20} className="mr-3" />
                Users
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('hotels')}
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'hotels' ? 'bg-[#908ea9]' : 'hover:bg-[#908ea9]'}`}
              >
                <Hotel size={20} className="mr-3" />
                Hotels
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('bookings')}
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'bookings' ? 'bg-[#908ea9]' : 'hover:bg-[#908ea9]'}`}
              >
                <Calendar size={20} className="mr-3" />
                Bookings
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center p-3 rounded-lg ${activeTab === 'settings' ? 'bg-[#908ea9]' : 'hover:bg-[#908ea9]'}`}
              >
                <Settings size={20} className="mr-3" />
                Settings
              </button>
            </li>
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-[#908ea9]">
          <button className="w-full flex items-center p-3 rounded-lg hover:bg-[#908ea9]">
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow-sm">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          
          <div className="flex-1 md:flex-none">
            <h2 className="text-xl font-semibold text-[#747293] capitalize">{activeTab}</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User size={20} className="text-[#908ea9]" />
              </div>
              <span className="pl-10 pr-4 py-2 bg-[#e3e3e9] rounded-full text-[#747293]">Admin</span>
            </div>
          </div>
        </header>
        
        {/* Dashboard Content */}
        <main className="p-4">
          {activeTab === 'dashboard' && <DashboardTab stats={stats} bookings={bookings} />}
          {activeTab === 'users' && <UsersTab users={users} updateUserStatus={updateUserStatus} />}
          {activeTab === 'hotels' && <HotelsTab hotels={hotels} updateHotelStatus={updateHotelStatus} />}
          {activeTab === 'bookings' && <BookingsTab bookings={bookings} updateBookingStatus={updateBookingStatus} />}
          {activeTab === 'settings' && <SettingsTab alert={alert} setAlert={setAlert} userForm={userForm} setUserForm={setUserForm} handleUpdateUser={handleUpdateUser} handleUserInputChange={handleUserInputChange} userDetails={userDetails} />}
        </main>
      </div>
    </div>
  );
};

// Dashboard Tab Component
const DashboardTab = ({ stats, bookings }: { stats: Stats, bookings: Booking[] }) => {
  // Ensure bookings is always an array
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#747293] mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards - unchanged */}
      <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#e3e3e9] mr-4">
              <Users className="text-[#747293]" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#908ea9]">Total Users</p>
              <h3 className="text-2xl font-bold text-[#747293]">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#e3e3e9] mr-4">
              <Hotel className="text-[#747293]" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#908ea9]">Total Hotels</p>
              <h3 className="text-2xl font-bold text-[#747293]">{stats.totalHotels}</h3>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#e3e3e9] mr-4">
              <Calendar className="text-[#747293]" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#908ea9]">Total Bookings</p>
              <h3 className="text-2xl font-bold text-[#747293]">{stats.totalBookings}</h3>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-[#e3e3e9] mr-4">
              <DollarSign className="text-[#747293]" size={24} />
            </div>
            <div>
              <p className="text-sm text-[#908ea9]">Total Revenue</p>
              <h3 className="text-2xl font-bold text-[#747293]">${stats.revenue}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Bookings */}
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#747293]">Recent Bookings</h3>
          <button className="text-[#747293] hover:text-[#908ea9] text-sm">View all</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e3e3e9]">
                <th className="pb-3 text-left text-[#908ea9] text-sm">User</th>
                <th className="pb-3 text-left text-[#908ea9] text-sm">Hotel</th>
                <th className="pb-3 text-left text-[#908ea9] text-sm">Check In</th>
                <th className="pb-3 text-left text-[#908ea9] text-sm">Check Out</th>
                <th className="pb-3 text-left text-[#908ea9] text-sm">Status</th>
                <th className="pb-3 text-left text-[#908ea9] text-sm">Amount</th>
              </tr>
            </thead>
            <tbody>
              {safeBookings.slice(0, 5).map(booking => (
                <tr key={booking.id} className="border-b border-[#e3e3e9]">
                  <td className="py-3 text-[#747293]">{booking.user_name}</td>
                  <td className="py-3 text-[#747293]">{booking.room_name} ({booking.hotel_name})</td>
                  <td className="py-3 text-[#747293]">{booking.check_in}</td>
                  <td className="py-3 text-[#747293]">{booking.check_out}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {booking.booking_status}
                    </span>
                  </td>
                  <td className="py-3 text-[#747293]">${booking.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Users Tab Component
const UsersTab = ({ users, updateUserStatus }: { users: User[], updateUserStatus: (userId: number, status: number) => Promise<void> }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#747293] mb-6">User Management</h2>
      
      <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e3e3e9]">
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Name</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Email</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Role</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Status</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-[#e3e3e9] hover:bg-[#f8f8fa]">
                  <td className="py-4 px-6 text-[#747293]">{user.name}</td>
                  <td className="py-4 px-6 text-[#747293]">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : user.role === 'owner' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${user.status_id === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.status_id === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => updateUserStatus(user.id, user.status_id === 1 ? 3 : 1)}
                        className={`p-2 rounded ${user.status_id === 1 ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                      >
                        {user.status_id === 1 ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button className="p-2 rounded bg-[#e3e3e9] text-[#747293] hover:bg-[#d5d5e1]">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Hotels Tab Component
const HotelsTab = ({ hotels, updateHotelStatus }: { hotels: Hotel[], updateHotelStatus: (hotelId: number, status: number) => Promise<void> }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#747293] mb-6">Hotel Management</h2>
      
      <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e3e3e9]">
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Name</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Location</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Rooms</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Status</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map(hotel => (
                <tr key={hotel.id} className="border-b border-[#e3e3e9] hover:bg-[#f8f8fa]">
                  <td className="py-4 px-6 text-[#747293] font-medium">{hotel.name}</td>
                  <td className="py-4 px-6 text-[#747293]">{hotel.location}</td>
                  <td className="py-4 px-6 text-[#747293]">{hotel.rooms?.length || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${hotel.status_id === 1 ? 'bg-green-100 text-green-800' : hotel.status_id === 2 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {hotel.status_id === 1 ? 'Active' : hotel.status_id === 2 ? 'Pending' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => updateHotelStatus(hotel.id, hotel.status_id === 1 ? 3 : 1)}
                        className={`p-2 rounded ${hotel.status_id === 1 ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
                      >
                        {hotel.status_id === 1 ? <XCircle size={16} /> : <CheckCircle size={16} />}
                      </button>
                      <button className="p-2 rounded bg-[#e3e3e9] text-[#747293] hover:bg-[#d5d5e1]">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Bookings Tab Component
const BookingsTab = ({ bookings, updateBookingStatus }: { bookings: Booking[], updateBookingStatus: (bookingId: number, status: string) => Promise<void> }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#747293] mb-6">Booking Management</h2>
      
      <div className="overflow-hidden bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e3e3e9]">
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">ID</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">User</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Room</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Check In</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Check Out</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Amount</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Status</th>
                <th className="pb-3 px-6 text-left text-[#908ea9] text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking.id} className="border-b border-[#e3e3e9] hover:bg-[#f8f8fa]">
                  <td className="py-4 px-6 text-[#747293]">#{booking.id}</td>
                  <td className="py-4 px-6 text-[#747293]">{booking.user_name}</td>
                  <td className="py-4 px-6 text-[#747293]">{booking.room_name} ({booking.hotel_name})</td>
                  <td className="py-4 px-6 text-[#747293]">{booking.check_in}</td>
                  <td className="py-4 px-6 text-[#747293]">{booking.check_out}</td>
                  <td className="py-4 px-6 text-[#747293]">${booking.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {booking.booking_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      {booking.booking_status === 'pending' && (
                        <button 
                          onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          className="p-2 text-green-600 bg-green-100 rounded hover:bg-green-200"
                        >
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {booking.booking_status !== 'cancelled' && (
                        <button 
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                          className="p-2 text-red-600 bg-red-100 rounded hover:bg-red-200"
                        >
                          <XCircle size={16} />
                        </button>
                      )}
                      <button className="p-2 rounded bg-[#e3e3e9] text-[#747293] hover:bg-[#d5d5e1]">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Settings Tab Component
const SettingsTab = ({ alert, setAlert, userForm, setUserForm, handleUpdateUser, handleUserInputChange, userDetails }: {
  alert: { type: string; message: string; visible: boolean };
  setAlert: React.Dispatch<React.SetStateAction<{ type: string; message: string; visible: boolean }>>;
  userForm: { name: string; email: string; mobile: string; nic: string; password: string; confirmPassword: string };
  setUserForm: React.Dispatch<React.SetStateAction<{ name: string; email: string; mobile: string; nic: string; password: string; confirmPassword: string }>>;
  handleUpdateUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleUserInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userDetails: User | null;
}) => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#e3e3e9] to-[#c7c7d4] p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl p-6 mx-auto bg-white shadow-xl rounded-2xl sm:p-8 md:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#747293] mb-6 sm:mb-8">Update Profile</h2>
              {alert.visible && (
                <div
                  className={`p-4 mb-6 text-sm rounded-lg flex items-center justify-between ${
                    alert.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
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

export default PearlStayDashboard;