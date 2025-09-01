import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { getHotels, getRooms, createBooking, getBookings, updateBookingStatus } from "../services/api";

const CustomerDashboard = () => {
  return (
    <DashboardLayout role="customer">
      <Routes>
        <Route path="profile" element={<ProfileManagement />} />
        <Route path="search" element={<SearchHotels />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route path="book/:hotelId" element={<BookRoom />} />
        <Route index element={<div className="text-pearlstay-primary">Welcome to Customer Dashboard</div>} />
      </Routes>
    </DashboardLayout>
  );
};

const ProfileManagement = () => {
  const [profile, setProfile] = useState({ name: "", email: "", mobile: "" });

  useEffect(() => {
    getProfile().then((res) => setProfile(res.data)).catch((err) => console.error(err));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(profile.id, profile);
      alert("Profile updated!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-pearlstay-primary">Profile Management</h2>
      <form onSubmit={handleUpdate} className="max-w-md space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={profile.email}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Mobile"
          value={profile.mobile}
          onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 text-white rounded bg-pearlstay-accent">
          Update Profile
        </button>
      </form>
    </div>
  );
};

const SearchHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getHotels().then((res) => setHotels(res.data)).catch((err) => console.error(err));
  }, []);

  const filteredHotels = hotels.filter(
    (hotel) =>
      hotel.name.toLowerCase().includes(search.toLowerCase()) ||
      hotel.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-pearlstay-primary">Search Hotels</h2>
      <input
        type="text"
        placeholder="Search by name or location"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredHotels.map((hotel) => (
          <div key={hotel.id} className="p-4 bg-white rounded shadow">
            <h3 className="text-lg font-semibold">{hotel.name}</h3>
            <p>{hotel.location}</p>
            <button
              onClick={() => navigate(`/dashboard/customer/book/${hotel.id}`)}
              className="px-4 py-2 mt-2 text-white rounded bg-pearlstay-accent"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const BookRoom = () => {
  const navigate = useNavigate();
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState({
    room_id: "",
    check_in: "",
    check_out: "",
    room_count: 1,
    adult_count: 1,
    special_note: "",
    price: 0
  });

  useEffect(() => {
    getRooms(hotelId).then((res) => setRooms(res.data)).catch((err) => console.error(err));
  }, [hotelId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBooking(form);
      navigate("/dashboard/customer/bookings");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-pearlstay-primary">Book a Room</h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <select
          value={form.room_id}
          onChange={(e) => {
            const room = rooms.find(r => r.id === parseInt(e.target.value));
            setForm({ ...form, room_id: e.target.value, price: room?.price_per_night || 0 });
          }}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>{room.name} (${room.price_per_night})</option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Check-In Date"
          value={form.check_in}
          onChange={(e) => setForm({ ...form, check_in: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          placeholder="Check-Out Date"
          value={form.check_out}
          onChange={(e) => setForm({ ...form, check_out: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Room Count"
          value={form.room_count}
          onChange={(e) => setForm({ ...form, room_count: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Adult Count"
          value={form.adult_count}
          onChange={(e) => setForm({ ...form, adult_count: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Special Note"
          value={form.special_note}
          onChange={(e) => setForm({ ...form, special_note: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 text-white rounded bg-pearlstay-accent">
          Book Room
        </button>
      </form>
    </div>
  );
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings().then((res) => setBookings(res.data)).catch((err) => console.error(err));
  }, []);

  const handleCancel = async (id) => {
    try {
      await updateBookingStatus(id, { booking_status: "cancelled" });
      setBookings(bookings.map((b) => (b.id === id ? { ...b, booking_status: "cancelled" } : b)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-pearlstay-primary">My Bookings</h2>
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-pearlstay-neutral">
          <tr>
            <th className="p-2">Hotel</th>
            <th className="p-2">Room</th>
            <th className="p-2">Check-In</th>
            <th className="p-2">Check-Out</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id} className="border-t">
              <td className="p-2">{booking.hotel_name}</td>
              <td className="p-2">{booking.room_name}</td>
              <td className="p-2">{booking.check_in}</td>
              <td className="p-2">{booking.check_out}</td>
              <td className="p-2">{booking.booking_status}</td>
              <td className="p-2">
                {booking.booking_status === "pending" && (
                  <button
                    onClick={() => handleCancel(booking.id)}
                    className="px-2 py-1 text-white bg-red-500 rounded"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerDashboard;