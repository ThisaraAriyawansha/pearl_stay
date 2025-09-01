import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { getHotels, createHotel, updateHotel, deleteHotel, getRooms, createRoom, updateRoom, deleteRoom, getBookings, updateBookingStatus } from "../services/api";

const OwnerDashboard = () => {
  return (
    <DashboardLayout role="owner">
      <Routes>
        <Route path="profile" element={<ProfileManagement />} />
        <Route path="hotels" element={<ManageHotels />} />
        <Route path="rooms" element={<ManageRooms />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route index element={<div className="text-pearlstay-primary">Welcome to Owner Dashboard</div>} />
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

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", description: "", logo: null, cover_image: null });

  useEffect(() => {
    getHotels().then((res) => setHotels(res.data)).catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createHotel(form);
      setHotels([...hotels, res.data]);
      setForm({ name: "", location: "", description: "", logo: null, cover_image: null });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-pearlstay-primary">Manage Hotels</h2>
      <form onSubmit={handleSubmit} className="max-w-md mb-8 space-y-4">
        <input
          type="text"
          placeholder="Hotel Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, logo: e.target.files[0] })}
          className="w-full p-2"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, cover_image: e.target.files[0] })}
          className="w-full p-2"
        />
        <button type="submit" className="px-4 py-2 text-white rounded bg-pearlstay-accent">
          Add Hotel
        </button>
      </form>
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-pearlstay-neutral">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Location</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((hotel) => (
            <tr key={hotel.id} className="border-t">
              <td className="p-2">{hotel.name}</td>
              <td className="p-2">{hotel.location}</td>
              <td className="p-2">{hotel.status_id === 4 ? "Approved" : "Pending"}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteHotel(hotel.id).then(() => setHotels(hotels.filter((h) => h.id !== hotel.id)))}
                  className="px-2 py-1 text-white bg-red-500 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({
    hotel_id: "",
    name: "",
    price_per_night: "",
    total_room: 1,
    size: "",
    bed_type: "",
    description: "",
    images: []
  });

  useEffect(() => {
    getHotels().then((res) => setHotels(res.data)).catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createRoom(form);
      setRooms([...rooms, res.data]);
      setForm({ hotel_id: "", name: "", price_per_night: "", total_room: 1, size: "", bed_type: "", description: "", images: [] });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-pearlstay-primary">Manage Rooms</h2>
      <form onSubmit={handleSubmit} className="max-w-md mb-8 space-y-4">
        <select
          value={form.hotel_id}
          onChange={(e) => setForm({ ...form, hotel_id: e.target.value })}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Hotel</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Room Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Price per Night"
          value={form.price_per_night}
          onChange={(e) => setForm({ ...form, price_per_night: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Total Rooms"
          value={form.total_room}
          onChange={(e) => setForm({ ...form, total_room: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Size"
          value={form.size}
          onChange={(e) => setForm({ ...form, size: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Bed Type"
          value={form.bed_type}
          onChange={(e) => setForm({ ...form, bed_type: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setForm({ ...form, images: Array.from(e.target.files) })}
          className="w-full p-2"
        />
        <button type="submit" className="px-4 py-2 text-white rounded bg-pearlstay-accent">
          Add Room
        </button>
      </form>
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-pearlstay-neutral">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Hotel</th>
            <th className="p-2">Price</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-t">
              <td className="p-2">{room.name}</td>
              <td className="p-2">{hotels.find(h => h.id === room.hotel_id)?.name}</td>
              <td className="p-2">{room.price_per_night}</td>
              <td className="p-2">{room.status_id === 4 ? "Approved" : "Pending"}</td>
              <td className="p-2">
                <button
                  onClick={() => deleteRoom(room.id).then(() => setRooms(rooms.filter((r) => r.id !== room.id)))}
                  className="px-2 py-1 text-white bg-red-500 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    getBookings().then((res) => setBookings(res.data)).catch((err) => console.error(err));
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateBookingStatus(id, { booking_status: status });
      setBookings(bookings.map((b) => (b.id === id ? { ...b, booking_status: status } : b)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-pearlstay-primary">Manage Bookings</h2>
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
                <button
                  onClick={() => handleStatusUpdate(booking.id, "confirmed")}
                  className="px-2 py-1 mr-2 text-white rounded bg-pearlstay-accent"
                  disabled={booking.booking_status !== "pending"}
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleStatusUpdate(booking.id, "cancelled")}
                  className="px-2 py-1 text-white bg-red-500 rounded"
                  disabled={booking.booking_status !== "pending"}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnerDashboard;