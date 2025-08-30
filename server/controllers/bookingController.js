import { pool } from '../config/database.js';

export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, roomCount, adultCount, specialNote } = req.body;
    const userId = req.user.id;

    // Get room details for price calculation
    const [rooms] = await pool.execute(
      'SELECT price_per_night, adult_price, total_room FROM rooms WHERE id = ?',
      [roomId]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = rooms[0];

    // Calculate price
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const roomPrice = room.price_per_night * roomCount * nights;
    const adultPrice = room.adult_price * adultCount * nights;
    const totalPrice = roomPrice + adultPrice;

    // Check availability
    const [bookings] = await pool.execute(`
      SELECT SUM(room_count) as booked_rooms
      FROM bookings 
      WHERE room_id = ? 
        AND booking_status != 'cancelled'
        AND ((check_in <= ? AND check_out > ?) OR (check_in < ? AND check_out >= ?))
    `, [roomId, checkOut, checkIn, checkOut, checkIn]);

    const bookedRooms = bookings[0].booked_rooms || 0;
    const availableRooms = room.total_room - bookedRooms;

    if (availableRooms < roomCount) {
      return res.status(400).json({ 
        message: 'Not enough rooms available',
        availableRooms 
      });
    }

    // Create booking
    const [result] = await pool.execute(
      'INSERT INTO bookings (room_id, check_in, check_out, room_count, adult_count, special_note, price, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [roomId, checkIn, checkOut, roomCount, adultCount, specialNote, totalPrice, userId]
    );

    res.status(201).json({
      message: 'Booking created successfully',
      bookingId: result.insertId,
      totalPrice
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const [bookings] = await pool.execute(`
      SELECT b.*, r.name as room_name, h.name as hotel_name, h.location
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN hotels h ON r.hotel_id = h.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [userId]);

    res.json(bookings);
  } catch (error) {
    console.error('Get my bookings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getHotelBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const [bookings] = await pool.execute(`
      SELECT b.*, r.name as room_name, h.name as hotel_name, u.email as customer_email
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN hotels h ON r.hotel_id = h.id
      JOIN users u ON b.user_id = u.id
      WHERE h.user_id = ?
      ORDER BY b.created_at DESC
    `, [userId]);

    res.json(bookings);
  } catch (error) {
    console.error('Get hotel bookings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { booking_status } = req.body;
    const userId = req.user.id;

    // Verify booking belongs to user's hotel (for owners) or user is admin
    let query = `
      SELECT b.id 
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN hotels h ON r.hotel_id = h.id
      WHERE b.id = ?
    `;
    
    const params = [id];

    if (req.user.role === 'owner') {
      query += ' AND h.user_id = ?';
      params.push(userId);
    }

    const [bookings] = await pool.execute(query, params);

    if (bookings.length === 0) {
      return res.status(403).json({ message: 'Unauthorized to update this booking' });
    }

    await pool.execute(
      'UPDATE bookings SET booking_status = ? WHERE id = ?',
      [booking_status, id]
    );

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const calculatePrice = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, roomCount, adultCount } = req.body;

    const [rooms] = await pool.execute(
      'SELECT price_per_night, adult_price FROM rooms WHERE id = ?',
      [roomId]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = rooms[0];
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const roomPrice = room.price_per_night * roomCount * nights;
    const adultPrice = room.adult_price * adultCount * nights;
    const totalPrice = roomPrice + adultPrice;

    res.json({
      nights,
      roomPrice,
      adultPrice,
      totalPrice,
      breakdown: {
        pricePerNight: room.price_per_night,
        adultPrice: room.adult_price,
        nights,
        roomCount,
        adultCount
      }
    });
  } catch (error) {
    console.error('Calculate price error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};