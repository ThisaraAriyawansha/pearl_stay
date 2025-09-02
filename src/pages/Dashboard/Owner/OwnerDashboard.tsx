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
  Edit,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';

type DashboardView = 'dashboard' | 'hotels' | 'rooms' | 'bookings' | 'settings' | 'add-hotel' | 'edit-hotel' | 'add-room' | 'edit-room';

interface Booking {
  id: number;
  booking_status: string;
  price: string;
  created_at: string;
  room_name: string;
  customer_name: string;
  check_in: string;
  check_out: string;
  room_count: number;
  adult_count: number;
  special_note: string | null;
  hotel_name: string;
}

interface Hotel {
  id: number;
  name: string;
  location: string;
  description: string;
  cover_image: string | null;
  logo: string | null;
}

interface Room {
  id: number;
  hotel_id: number;
  name: string;
  price_per_night: number;
  adult_price: number;
  total_room: number;
  size: string;
  bed_type: string;
  description: string;
  status_name: string;
  hotel_name: string;
  images: { id: number; image: string }[];
}

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  nic: string | null;
}

const OwnerDashboard = () => {
  const [stats, setStats] = useState({
    totalHotels: 0,
    totalRooms: 0,
    totalBookings: 0,
    activeBookings: 0,
    revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState<DashboardView>('dashboard');
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState<string>('');
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  // State for alerts
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });

  // State for the hotel form
  const [hotelForm, setHotelForm] = useState({
    name: '',
    location: '',
    description: '',
    logo: null as File | null,
    cover_image: null as File | null,
  });

  // State for the room form
  const [roomForm, setRoomForm] = useState<{
    hotel_id: string;
    name: string;
    price_per_night: string;
    adult_price: string;
    total_room: string;
    size: string;
    bed_type: string;
    description: string;
    images: File[];
  }>({
    hotel_id: '',
    name: '',
    price_per_night: '',
    adult_price: '',
    total_room: '',
    size: '',
    bed_type: '',
    description: '',
    images: [],
  });

  // State for user settings form
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    mobile: '',
    nic: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchDashboardData();
    fetchUserDetails();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const hotelsRes = await axios.get('http://localhost:5000/api/hotels/owner', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const hotels: Hotel[] = hotelsRes.data.hotels;
      setHotels(hotels);

      let totalRooms = 0;
      let totalBookings = 0;
      let activeBookings = 0;
      let revenue = 0;
      const allBookings: Booking[] = [];

      for (const hotel of hotels) {
        try {
          const roomsRes = await axios.get(`http://localhost:5000/api/roomsmanage/hotel/${hotel.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          totalRooms += roomsRes.data.rooms.length;

          const bookingsRes = await axios.get(`http://localhost:5000/api/bookingsManage/hotel/${hotel.id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          });
          const hotelBookings: Booking[] = bookingsRes.data.bookings;

          totalBookings += hotelBookings.length;
          activeBookings += hotelBookings.filter((b) => b.booking_status === 'confirmed').length;
          revenue += hotelBookings
            .filter((b) => b.booking_status === 'confirmed')
            .reduce((sum: number, b) => sum + parseFloat(b.price), 0);

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

      setRecentBookings(
        allBookings
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 5)
      );

      setBookings(allBookings);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setAlert({ type: 'error', message: 'Failed to load dashboard data', visible: true });
    } finally {
      setLoading(false);
    }
  };

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


  const fetchRooms = async (hotelId: string) => {
    try {
      setSelectedHotelForRooms(hotelId);
      const response = await axios.get(`http://localhost:5000/api/roomsmanage/hotel/${hotelId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      setAlert({ type: 'error', message: 'Failed to load rooms', visible: true });
    }
  };

  const handleUpdateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/bookingsManage/${bookingId}`,
        { booking_status: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setAlert({ type: 'success', message: response.data.message, visible: true });
      await fetchDashboardData();
      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Failed to update booking status',
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
      `http://localhost:5000/api/userManage/me/${user?.id}`, // 👈 use user.id here
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

    updateUser({ ...user!, name: userForm.name, email: userForm.email });

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


  const statCards = [
    {
      title: 'My Hotels',
      value: stats.totalHotels,
      icon: Hotel,
      color: 'bg-[#747293]',
      bgColor: 'bg-[#e3e3e9]',
      textColor: 'text-[#747293]',
    },
    {
      title: 'Total Rooms',
      value: stats.totalRooms,
      icon: Bed,
      color: 'bg-[#908ea9]',
      bgColor: 'bg-[#c7c7d4]',
      textColor: 'text-[#908ea9]',
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-[#acaabe]',
      bgColor: 'bg-[#e3e3e9]',
      textColor: 'text-[#acaabe]',
    },
    {
      title: 'Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'bg-[#747293]',
      bgColor: 'bg-[#c7c7d4]',
      textColor: 'text-[#747293]',
    },
  ];

  const handleSidebarItemClick = (view: DashboardView) => {
    setCurrentView(view);
    setAlert({ type: '', message: '', visible: false });
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleHotelInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHotelForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleHotelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setHotelForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleRoomInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoomForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      setRoomForm((prev) => ({ ...prev, images: Array.from(files) }));
    }
  };

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddHotel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert({ type: '', message: '', visible: false });

    if (!hotelForm.name || !hotelForm.location) {
      setAlert({ type: 'error', message: 'Please fill in all required fields (Name, Location).', visible: true });
      return;
    }

    const formData = new FormData();
    formData.append('name', hotelForm.name);
    formData.append('location', hotelForm.location);
    formData.append('description', hotelForm.description);
    if (hotelForm.logo) formData.append('logo', hotelForm.logo);
    if (hotelForm.cover_image) formData.append('cover_image', hotelForm.cover_image);

    try {
      const response = await axios.post('http://localhost:5000/api/hotels', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAlert({ type: 'success', message: response.data.message, visible: true });
      setHotelForm({
        name: '',
        location: '',
        description: '',
        logo: null,
        cover_image: null,
      });
      await fetchDashboardData();
      setTimeout(() => {
        setCurrentView('hotels');
        setAlert({ type: '', message: '', visible: false });
      }, 3000);
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Failed to add hotel',
        visible: true,
      });
      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
    }
  };

  const handleEditHotel = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setHotelForm({
      name: hotel.name || '',
      location: hotel.location || '',
      description: hotel.description || '',
      logo: null,
      cover_image: null,
    });
    setCurrentView('edit-hotel');
  };

  const handleUpdateHotel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert({ type: '', message: '', visible: false });

    if (!hotelForm.name || !hotelForm.location) {
      setAlert({ type: 'error', message: 'Please fill in all required fields (Name, Location).', visible: true });
      return;
    }

    const formData = new FormData();
    formData.append('name', hotelForm.name);
    formData.append('location', hotelForm.location);
    formData.append('description', hotelForm.description);
    if (hotelForm.logo) formData.append('logo', hotelForm.logo);
    if (hotelForm.cover_image) formData.append('cover_image', hotelForm.cover_image);

    try {
      const response = await axios.put(`http://localhost:5000/api/hotels/${selectedHotel!.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAlert({ type: 'success', message: response.data.message, visible: true });
      setHotelForm({
        name: '',
        location: '',
        description: '',
        logo: null,
        cover_image: null,
      });
      setSelectedHotel(null);
      await fetchDashboardData();
      setTimeout(() => {
        setCurrentView('hotels');
        setAlert({ type: '', message: '', visible: false });
      }, 3000);
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Failed to update hotel',
        visible: true,
      });
      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
    }
  };

  const handleAddRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert({ type: '', message: '', visible: false });

    if (!roomForm.hotel_id || !roomForm.name || !roomForm.price_per_night) {
      setAlert({ type: 'error', message: 'Please fill in all required fields (Hotel, Name, Price per Night).', visible: true });
      return;
    }

    const formData = new FormData();
    formData.append('hotel_id', roomForm.hotel_id);
    formData.append('name', roomForm.name);
    formData.append('price_per_night', roomForm.price_per_night);
    formData.append('adult_price', roomForm.adult_price);
    formData.append('total_room', roomForm.total_room);
    formData.append('size', roomForm.size);
    formData.append('bed_type', roomForm.bed_type);
    formData.append('description', roomForm.description);
    roomForm.images.forEach((image) => formData.append('images', image));

    try {
      const response = await axios.post('http://localhost:5000/api/roomsmanage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAlert({ type: 'success', message: response.data.message, visible: true });
      setRoomForm({
        hotel_id: '',
        name: '',
        price_per_night: '',
        adult_price: '',
        total_room: '',
        size: '',
        bed_type: '',
        description: '',
        images: [],
      });
      await fetchDashboardData();
      if (selectedHotelForRooms) {
        fetchRooms(selectedHotelForRooms);
      }
      setTimeout(() => {
        setCurrentView('rooms');
        setAlert({ type: '', message: '', visible: false });
      }, 3000);
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Failed to add room',
        visible: true,
      });
      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
    }
  };

  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setRoomForm({
      hotel_id: room.hotel_id.toString(),
      name: room.name || '',
      price_per_night: room.price_per_night.toString() || '',
      adult_price: room.adult_price.toString() || '',
      total_room: room.total_room.toString() || '',
      size: room.size || '',
      bed_type: room.bed_type || '',
      description: room.description || '',
      images: [],
    });
    setCurrentView('edit-room');
  };

  const handleUpdateRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert({ type: '', message: '', visible: false });

    if (!roomForm.hotel_id || !roomForm.name || !roomForm.price_per_night) {
      setAlert({ type: 'error', message: 'Please fill in all required fields (Hotel, Name, Price per Night).', visible: true });
      return;
    }

    const formData = new FormData();
    formData.append('hotel_id', roomForm.hotel_id);
    formData.append('name', roomForm.name);
    formData.append('price_per_night', roomForm.price_per_night);
    formData.append('adult_price', roomForm.adult_price);
    formData.append('total_room', roomForm.total_room);
    formData.append('size', roomForm.size);
    formData.append('bed_type', roomForm.bed_type);
    formData.append('description', roomForm.description);
    roomForm.images.forEach((image) => formData.append('images', image));

    try {
      const response = await axios.put(`http://localhost:5000/api/roomsmanage/${selectedRoom!.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setAlert({ type: 'success', message: response.data.message, visible: true });
      setRoomForm({
        hotel_id: '',
        name: '',
        price_per_night: '',
        adult_price: '',
        total_room: '',
        size: '',
        bed_type: '',
        description: '',
        images: [],
      });
      setSelectedRoom(null);
      await fetchDashboardData();
      if (selectedHotelForRooms) {
        fetchRooms(selectedHotelForRooms);
      }
      setTimeout(() => {
        setCurrentView('rooms');
        setAlert({ type: '', message: '', visible: false });
      }, 3000);
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Failed to update room',
        visible: true,
      });
      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/roomsmanage/${roomId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAlert({ type: 'success', message: 'Room deleted successfully', visible: true });
      await fetchDashboardData();
      if (selectedHotelForRooms) {
        fetchRooms(selectedHotelForRooms);
      }
      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Failed to delete room',
        visible: true,
      });
      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
    }
  };

  const handleDeleteRoomImage = async (imageId: number) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/roomsmanage/images/${imageId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setAlert({ type: 'success', message: 'Image deleted successfully', visible: true });
      if (selectedRoom) {
        const response = await axios.get(`http://localhost:5000/api/roomsmanage/${selectedRoom.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSelectedRoom(response.data.room);
      }
      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.response?.data?.error || 'Failed to delete image',
        visible: true,
      });
      setTimeout(() => setAlert({ type: '', message: '', visible: false }), 3000);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'hotels':
        return (
          <div className="p-6 bg-white shadow-xl rounded-2xl">
            <h2 className="mb-6 text-2xl font-bold text-[#747293]">My Hotels</h2>
            {hotels.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {hotels.map((hotel) => (
                  <div key={hotel.id} className="p-4 bg-[#e3e3e9] rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <img
                      src={hotel.cover_image ? `http://localhost:5000/uploads/${hotel.cover_image}` : 'https://via.placeholder.com/300x150'}
                      alt={hotel.name}
                      className="object-cover w-full h-40 mb-4 rounded-lg"
                    />
                    <h3 className="text-lg font-semibold text-[#747293]">{hotel.name}</h3>
                    <p className="text-sm text-[#908ea9] mb-2">{hotel.location}</p>
                    <p className="text-sm text-[#908ea9] line-clamp-2">{hotel.description || 'No description provided'}</p>
                    <button
                      onClick={() => handleEditHotel(hotel)}
                      className="mt-4 flex items-center space-x-2 px-4 py-2 bg-[#acaabe] text-white rounded-lg hover:bg-[#908ea9] transition-all"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Hotel</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#908ea9] text-center py-6">No hotels found. Add a new hotel to get started!</p>
            )}
          </div>
        );
      case 'rooms':
        return (
          <div className="p-6 bg-white shadow-xl rounded-2xl">
            <h2 className="mb-6 text-2xl font-bold text-[#747293]">Room Management</h2>
            {hotels.length > 0 ? (
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-[#747293]">Select Hotel</label>
                <select
                  value={selectedHotelForRooms}
                  onChange={(e) => {
                    if (e.target.value) {
                      fetchRooms(e.target.value);
                    } else {
                      setRooms([]);
                      setSelectedHotelForRooms('');
                    }
                  }}
                  className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                >
                  <option value="">Select a hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-[#908ea9] text-center py-6">No hotels found. Add a hotel first!</p>
            )}
            
            {selectedHotelForRooms && rooms.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                  <div key={room.id} className="p-4 bg-[#e3e3e9] rounded-lg shadow-md hover:shadow-lg transition-shadow">
                    <div className="relative w-full h-40 mb-4">
                      {room.images && room.images.length > 0 ? (
                        <img
                          src={`http://localhost:5000${room.images[0].image}`}
                          alt={room.name}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      ) : (
                        <img
                          src="https://via.placeholder.com/300x150"
                          alt={room.name}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-[#747293]">{room.name}</h3>
                    <p className="text-sm text-[#908ea9] mb-1">Hotel: {room.hotel_name}</p>
                    <p className="text-sm text-[#908ea9] mb-1">Price: ${room.price_per_night}/night</p>
                    <p className="text-sm text-[#908ea9] mb-2">Total Rooms: {room.total_room}</p>
                    <p className="text-sm text-[#908ea9] line-clamp-2">{room.description || 'No description'}</p>
                    <div className="flex mt-4 space-x-2">
                      <button
                        onClick={() => handleEditRoom(room)}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-[#acaabe] text-white rounded-lg hover:bg-[#908ea9] transition-all"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteRoom(room.id)}
                        className="flex items-center justify-center flex-1 px-4 py-2 space-x-2 text-white transition-all bg-red-500 rounded-lg hover:bg-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedHotelForRooms ? (
              <div className="py-8 text-center">
                <Bed className="w-12 h-12 mx-auto text-[#908ea9] mb-4" />
                <p className="text-[#908ea9]">No rooms found for this hotel.</p>
                <button
                  onClick={() => handleSidebarItemClick('add-room')}
                  className="mt-4 px-4 py-2 bg-[#747293] text-white rounded-lg hover:bg-[#908ea9]"
                >
                  Add Room
                </button>
              </div>
            ) : null}
          </div>
        );
      case 'add-room':
      case 'edit-room':
        return (
          <div className="w-full min-h-screen bg-gradient-to-b from-[#e3e3e9] to-[#c7c7d4] p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl p-6 mx-auto bg-white shadow-xl rounded-2xl sm:p-8 md:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#747293] mb-6 sm:mb-8">
                {currentView === 'add-room' ? 'Add New Room' : 'Edit Room'}
              </h2>
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
              <form onSubmit={currentView === 'add-room' ? handleAddRoom : handleUpdateRoom} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Hotel</label>
                    <select
                      name="hotel_id"
                      value={roomForm.hotel_id}
                      onChange={handleRoomInputChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                    >
                      <option value="">Select a hotel</option>
                      {hotels.map((hotel) => (
                        <option key={hotel.id} value={hotel.id}>
                          {hotel.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Room Name</label>
                    <input
                      type="text"
                      name="name"
                      value={roomForm.name}
                      onChange={handleRoomInputChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                      placeholder="Enter room name"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Price per Night</label>
                    <input
                      type="number"
                      name="price_per_night"
                      value={roomForm.price_per_night}
                      onChange={handleRoomInputChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                      placeholder="Enter price per night"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Adult Price</label>
                    <input
                      type="number"
                      name="adult_price"
                      value={roomForm.adult_price}
                      onChange={handleRoomInputChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                      placeholder="Enter adult price"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Total Rooms</label>
                    <input
                      type="number"
                      name="total_room"
                      value={roomForm.total_room}
                      onChange={handleRoomInputChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                      placeholder="Enter total rooms"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Size</label>
                    <input
                      type="text"
                      name="size"
                      value={roomForm.size}
                      onChange={handleRoomInputChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                      placeholder="Enter room size (e.g., 300 sq ft)"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Bed Type</label>
                    <input
                      type="text"
                      name="bed_type"
                      value={roomForm.bed_type}
                      onChange={handleRoomInputChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                      placeholder="Enter bed type (e.g., Queen, King)"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Description</label>
                    <textarea
                      name="description"
                      value={roomForm.description}
                      onChange={handleRoomInputChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                      placeholder="Enter room description"
                      rows={4}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Room Images</label>
                    <input
                      type="file"
                      name="images"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleRoomFileChange}
                      multiple
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#acaabe] file:text-white hover:file:bg-[#908ea9] transition-all"
                    />
                    {currentView === 'edit-room' && selectedRoom?.images && selectedRoom.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3">
                        {selectedRoom.images.map((image) => (
                          <div key={image.id} className="relative">
                            <img
                              src={`http://localhost:5000${image.image}`}
                              alt="Room"
                              className="object-cover w-full h-24 rounded-lg"
                            />
                            <button
                              onClick={() => handleDeleteRoomImage(image.id)}
                              className="absolute p-1 text-white bg-red-500 rounded-full top-1 right-1 hover:bg-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 mt-6 bg-[#747293] text-white rounded-lg hover:bg-[#908ea9] focus:ring-2 focus:ring-[#acaabe] focus:outline-none transition-all duration-300"
                  >
                    {currentView === 'add-room' ? 'Add Room' : 'Update Room'}
                  </button>
                  {currentView === 'edit-room' && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentView('rooms');
                        setAlert({ type: '', message: '', visible: false });
                      }}
                      className="w-full px-6 py-3 mt-6 bg-[#c7c7d4] text-[#747293] rounded-lg hover:bg-[#acaabe] focus:ring-2 focus:ring-[#908ea9] focus:outline-none transition-all duration-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        );
      case 'bookings':
        return (
          <div className="p-6 bg-white shadow-xl rounded-2xl">
            <h2 className="mb-6 text-2xl font-bold text-[#747293]">Bookings</h2>
            {hotels.length > 0 ? (
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-[#747293]">Select Hotel</label>
                <select
                  value={selectedHotelForRooms}
                  onChange={(e) => {
                    if (e.target.value) {
                      fetchRooms(e.target.value);
                    } else {
                      setRooms([]);
                      setSelectedHotelForRooms('');
                    }
                  }}
                  className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                >
                  <option value="">Select a hotel</option>
                  {hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-[#908ea9] text-center py-6">No hotels found. Add a hotel first!</p>
            )}
            {bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings
                  .filter((booking) => !selectedHotelForRooms || booking.hotel_name === hotels.find(h => h.id === parseInt(selectedHotelForRooms))?.name)
                  .map((booking) => (
                    <div key={booking.id} className="p-4 bg-[#e3e3e9] rounded-lg shadow-md">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-sm font-medium text-[#747293]">{booking.room_name}</p>
                          <p className="text-xs text-[#908ea9]">Hotel: {booking.hotel_name}</p>
                          <p className="text-xs text-[#908ea9]">Customer: {booking.customer_name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#908ea9]">
                            Check-in: {new Date(booking.check_in).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-[#908ea9]">
                            Check-out: {new Date(booking.check_out).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-[#908ea9]">
                            Rooms: {booking.room_count} | Adults: {booking.adult_count}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#747293]">${booking.price}</p>
                          <p className="text-xs text-[#908ea9]">
                            Special Note: {booking.special_note || 'None'}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={booking.booking_status}
                            onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                            className="px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293]"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
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
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-[#908ea9] text-center py-6">No bookings found.</p>
            )}
          </div>
        );
      case 'settings':
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
      case 'add-hotel':
      case 'edit-hotel':
        return (
          <div className="w-full min-h-screen bg-gradient-to-b from-[#e3e3e9] to-[#c7c7d4] p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl p-6 mx-auto bg-white shadow-xl rounded-2xl sm:p-8 md:p-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#747293] mb-6 sm:mb-8">
                {currentView === 'add-hotel' ? 'Add New Hotel' : 'Edit Hotel'}
              </h2>
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
              <form onSubmit={currentView === 'add-hotel' ? handleAddHotel : handleUpdateHotel} className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Hotel Name</label>
                    <input
                      type="text"
                      name="name"
                      value={hotelForm.name}
                      onChange={handleHotelInputChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293] transition-all"
                      placeholder="Enter hotel name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={hotelForm.location}
                      onChange={handleHotelInputChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293] transition-all"
                      placeholder="Enter hotel location"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Description</label>
                    <textarea
                      name="description"
                      value={hotelForm.description}
                      onChange={handleHotelInputChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293] transition-all"
                      placeholder="Enter hotel description"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Logo</label>
                    <input
                      type="file"
                      name="logo"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleHotelFileChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#acaabe] file:text-white hover:file:bg-[#908ea9] transition-all"
                    />
                    {currentView === 'edit-hotel' && selectedHotel?.logo && (
                      <p className="mt-2 text-xs text-[#908ea9]">
                        Current logo: {selectedHotel.logo.replace('/uploads/', '')}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-[#747293]">Cover Image</label>
                    <input
                      type="file"
                      name="cover_image"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleHotelFileChange}
                      className="w-full px-4 py-3 bg-[#e3e3e9] border border-[#c7c7d4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#908ea9] text-[#747293] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#acaabe] file:text-white hover:file:bg-[#908ea9] transition-all"
                    />
                    {currentView === 'edit-hotel' && selectedHotel?.cover_image && (
                      <p className="mt-2 text-xs text-[#908ea9]">
                        Current cover image: {selectedHotel.cover_image.replace('/uploads/', '')}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 mt-6 bg-[#747293] text-white rounded-lg hover:bg-[#908ea9] focus:ring-2 focus:ring-[#acaabe] focus:outline-none transition-all duration-300"
                  >
                    {currentView === 'add-hotel' ? 'Add Hotel' : 'Update Hotel'}
                  </button>
                  {currentView === 'edit-hotel' && (
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentView('hotels');
                        setAlert({ type: '', message: '', visible: false });
                      }}
                      className="w-full px-6 py-3 mt-6 bg-[#c7c7d4] text-[#747293] rounded-lg hover:bg-[#acaabe] focus:ring-2 focus:ring-[#908ea9] focus:outline-none transition-all duration-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {statCards.map((stat, index) => (
                <div key={index} className="p-6 transition-shadow bg-white shadow-xl rounded-2xl hover:shadow-2xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="mb-1 text-sm text-[#908ea9]">{stat.title}</p>
                      <p className="text-2xl font-bold text-[#747293]">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="p-6 bg-white shadow-xl rounded-2xl">
                <h3 className="mb-4 text-lg font-semibold text-[#747293]">Recent Bookings</h3>
                {recentBookings.length > 0 ? (
                  <div className="space-y-3">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 rounded-lg bg-[#e3e3e9]">
                        <div>
                          <p className="text-sm font-medium text-[#747293]">{booking.room_name}</p>
                          <p className="text-xs text-[#908ea9]">{booking.customer_name}</p>
                          <p className="text-xs text-[#908ea9]">
                            {new Date(booking.check_in).toLocaleDateString()} -{' '}
                            {new Date(booking.check_out).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-[#747293]">${booking.price}</p>
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
                  <p className="py-4 text-center text-[#908ea9]">No recent bookings</p>
                )}
              </div>
              <div className="p-6 bg-white shadow-xl rounded-2xl">
                <h3 className="mb-4 text-lg font-semibold text-[#747293]">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => handleSidebarItemClick('hotels')}
                    className="flex items-center p-4 space-x-3 transition-colors rounded-lg bg-[#e3e3e9] hover:bg-[#c7c7d4]"
                  >
                    <Hotel className="w-5 h-5 text-[#747293]" />
                    <span className="font-medium text-[#747293]">Manage Hotels</span>
                  </button>
                  <button
                    onClick={() => handleSidebarItemClick('rooms')}
                    className="flex items-center p-4 space-x-3 transition-colors rounded-lg bg-[#e3e3e9] hover:bg-[#c7c7d4]"
                  >
                    <Bed className="w-5 h-5 text-[#747293]" />
                    <span className="font-medium text-[#747293]">Manage Rooms</span>
                  </button>
                  <button
                    onClick={() => handleSidebarItemClick('bookings')}
                    className="flex items-center p-4 space-x-3 transition-colors rounded-lg bg-[#e3e3e9] hover:bg-[#c7c7d4]"
                  >
                    <Calendar className="w-5 h-5 text-[#747293]" />
                    <span className="font-medium text-[#747293]">View Bookings</span>
                  </button>
                  <button
                    onClick={() => handleSidebarItemClick('settings')}
                    className="flex items-center p-4 space-x-3 transition-colors rounded-lg bg-[#e3e3e9] hover:bg-[#c7c7d4]"
                  >
                    <Settings className="w-5 h-5 text-[#747293]" />
                    <span className="font-medium text-[#747293]">Settings</span>
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
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
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
                currentView === 'rooms' || currentView === 'add-room' || currentView === 'edit-room'
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
      <div className="flex h-screen bg-[#e3e3e9]">
        <Sidebar />
        <div className="flex-1 p-6 lg:ml-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 bg-white shadow-xl rounded-2xl animate-pulse">
                <div className="w-12 h-12 mb-4 bg-[#c7c7d4] rounded-lg"></div>
                <div className="w-1/2 h-4 mb-2 bg-[#c7c7d4] rounded"></div>
                <div className="w-1/3 h-6 bg-[#c7c7d4] rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#e3e3e9]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden lg:ml-0">
        <header className="flex items-center justify-between p-4 bg-white border-b border-[#c7c7d4]">
          <button className="rounded-md lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-[#747293]" />
          </button>
          <div className="flex-1 lg:flex-none">
            <h1 className="ml-2 text-xl font-semibold text-[#747293] lg:ml-0">
              {currentView === 'dashboard' && 'Owner Dashboard'}
              {currentView === 'hotels' && 'My Hotels'}
              {currentView === 'rooms' && 'Room Management'}
              {currentView === 'bookings' && 'Booking Management'}
              {currentView === 'settings' && 'Settings'}
              {currentView === 'add-hotel' && 'Add New Hotel'}
              {currentView === 'edit-hotel' && 'Edit Hotel'}
              {currentView === 'add-room' && 'Add New Room'}
              {currentView === 'edit-room' && 'Edit Room'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleSidebarItemClick('add-hotel')}
              className="flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-lg bg-[#747293] hover:bg-[#908ea9]"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Hotel</span>
            </button>
            {(currentView === 'rooms' || currentView === 'add-room' || currentView === 'edit-room') && (
              <button
                onClick={() => handleSidebarItemClick('add-room')}
                className="flex items-center px-4 py-2 space-x-2 text-white transition-colors rounded-lg bg-[#747293] hover:bg-[#908ea9]"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Room</span>
              </button>
            )}
          </div>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {alert.visible && (
            <div
              className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm flex items-center justify-between ${
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
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;