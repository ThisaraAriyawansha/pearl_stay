import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { getUsers, updateUserStatus, getHotels, updateHotel, getRooms, updateRoom, getBookings, updateBookingStatus } from "../services/api";

const AdminDashboard = () => {
  return (
    <DashboardLayout role="admin">
      <Routes>
        <Route path="users" element={<ManageUsers />} />
        <Route path="hotels" element={<ManageHotels />} />
        <Route path="rooms" element={<ManageRooms />} />
        <Route path="bookings" element={<ManageBookings />} />
        <Route index element={<div className="text-pearlstay-primary">Welcome to Admin Dashboard</div>} />
      </Routes>
    </DashboardLayout>
  );
};

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then((res) => setUsers(res.data)).catch((err) => console.error(err));
  }, []);

  const handleUpdateStatus = async (id, status_id) => {
    try {
      await updateUserStatus(id, { status_id });
      setUsers(users.map((user) => (user.id === id ? { ...user, status_id } : user)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-pearlstay-primary">Manage Users</h2>
      <table className="w-full bg-white rounded-lg shadow">
        <thead className="bg-pearlstay-neutral">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.role}</td>
              <td className="p-2">{user.status_id === 1 ? "Active" : "Inactive"}</td>
              <td className="p-2">
                <button
                  onClick={() => handleUpdateStatus(user.id, user.status_id === 1 ? 2 : 1)}
                  className="px-2 py-1 mr-2 text-white rounded bg-pearlstay-accent"
                >
                  Toggle Status
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ManageHotels = () => {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    getHotels().then((res) => setHotels(res.data)).catch((err) => console.error(err));
  }, []);

  const handleUpdateStatus = async (id, status_id) => {
    try {
      await updateHotel(id, { status_id });
      setHotels(hotels.map((hotel) => (hotel.id === id ? { ...hotel, status_id } : hotel)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-pearlstay-primary">Manage Hotels</h2>
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
              <td className="p-2">{hotel.status_id === 4 ? "Approved" : hotel.status_id === 3 ? "Pending" : "Rejected"}</td>
              <td className="p-2">
                <button
                  onClick={() => handleUpdateStatus(hotel.id, 4)}
                  className="px-2 py-1 mr-2 text-white rounded bg-pearlstay-accent"
                  disabled={hotel.status_id === 4}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(hotel.id, 5)}
                  className="px-2 py-1 text-white bg-red-500 rounded"
                  disabled={hotel.status_id === 5}
                >
                  Reject
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

  useEffect(() => {
    getHotels().then((res) => setHotels(res.data)).catch((err) => console.error(err));
    getRooms().then((res) => setRooms(res.data)).catch((err) => console.error(err));
  }, []);

  const handleUpdateStatus = async (id, status_id) => {
    try {
      await updateRoom(id, { status_id });
      setRooms(rooms.map((room) => (room.id === id ? { ...room, status_id } : room)));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-pearlstay-primary">Manage Rooms</h2>
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
              <td className="p-2">{room.status_id === 4 ? "Approved" : room.status_id === 3 ? "Pending" : "Rejected"}</td>
              <td className="p-2">
                <button
                  onClick={() => handleUpdateStatus(room.id, 4)}
                  className="px-2 py-1 mr-2 text-white rounded bg-pearlstay-accent"
                  disabled={room.status_id === 4}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdateStatus(room.id, 5)}
                  className="px-2 py-1 text-white bg-red-500 rounded"
                  disabled={room.status_id === 5}
                >
                  Reject
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

  const handleUpdateStatus = async (id, status) => {
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
                  onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                  className="px-2 py-1 mr-2 text-white rounded bg-pearlstay-accent"
                  disabled={booking.booking_status !== "pending"}
                >
                  Confirm
                </button>
                <button
                  onClick={() => handleUpdateStatus(booking.id, "cancelled")}
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

export default AdminDashboard;