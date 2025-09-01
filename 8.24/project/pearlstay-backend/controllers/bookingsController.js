import { query } from '../config/db.js';
import { validationResult } from 'express-validator';
import { calculatePrice } from '../utils/bookingCalc.js';

export const createBooking = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { room_id, check_in, check_out, room_count, adult_count, special_note } = req.body;
    const user_id = req.user.id;

    // Get room details
    const [rooms] = await query('SELECT * FROM rooms WHERE id = ? AND status_id = 1', [room_id]);
    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = rooms[0];

    // Check availability
    const [bookedRows] = await query(
      `SELECT COALESCE(SUM(room_count), 0) as booked_count
       FROM bookings 
       WHERE room_id = ? 
       AND booking_status != 'cancelled'
       AND NOT (check_out <= ? OR check_in >= ?)`,
      [room_id, check_in, check_out]
    );

    const alreadyBooked = bookedRows[0]?.booked_count || 0;
    const available = room.total_room - alreadyBooked;

    if (room_count > available) {
      return res.status(400).json({ 
        message: `Only ${available} rooms available for selected dates`,
        available_rooms: available
      });
    }

    // Calculate total price
    const priceCalculation = calculatePrice(
      { pricePerNight: room.price_per_night, adultPrice: room.adult_price },
      check_in,
      check_out,
      room_count,
      adult_count
    );

    // Create booking
    const [result] = await query(
      `INSERT INTO bookings (room_id, check_in, check_out, room_count, adult_count, special_note, price, user_id, booking_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [room_id, check_in, check_out, room_count, adult_count, special_note || '', priceCalculation.total, user_id, 'pending']
    );

    const bookingId = result.lastInsertRowid || result.insertId;

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: bookingId,
        room_id,
        check_in,
        check_out,
        room_count,
        adult_count,
        price: priceCalculation.total,
        booking_status: 'pending'
      },
      price_breakdown: priceCalculation
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listBookings = async (req, res) => {
  try {
    const { user_id, hotel_id, status } = req.query;
    
    let sql = `
      SELECT b.*, r.name as room_name, h.name as hotel_name, u.name as customer_name, u.email as customer_email
      FROM bookings b
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    // Role-based filtering
    if (req.user.role === 'customer') {
      sql += ' AND b.user_id = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'owner') {
      sql += ' AND h.user_id = ?';
      params.push(req.user.id);
    }

    if (user_id && req.user.role === 'admin') {
      sql += ' AND b.user_id = ?';
      params.push(user_id);
    }

    if (hotel_id) {
      sql += ' AND h.id = ?';
      params.push(hotel_id);
    }

    if (status) {
      sql += ' AND b.booking_status = ?';
      params.push(status);
    }

    sql += ' ORDER BY b.created_at DESC';

    const [bookings] = await query(sql, params);

    res.json({ bookings });
  } catch (error) {
    console.error('List bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { booking_status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(booking_status)) {
      return res.status(400).json({ message: 'Invalid booking status' });
    }

    // Check if user can update this booking
    const [bookings] = await query(
      `SELECT b.*, h.user_id as hotel_owner_id
       FROM bookings b
       LEFT JOIN rooms r ON b.room_id = r.id
       LEFT JOIN hotels h ON r.hotel_id = h.id
       WHERE b.id = ?`,
      [bookingId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[0];

    // Permission check: admin can update any, owner can update their hotel bookings, customer can cancel their own
    if (req.user.role === 'customer') {
      if (booking.user_id !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: Not your booking' });
      }
      if (booking_status !== 'cancelled') {
        return res.status(403).json({ message: 'Customers can only cancel bookings' });
      }
    } else if (req.user.role === 'owner') {
      if (booking.hotel_owner_id !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: Not your hotel booking' });
      }
    }

    await query(
      'UPDATE bookings SET booking_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [booking_status, bookingId]
    );

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const [bookings] = await query(
      `SELECT b.*, r.name as room_name, r.size, r.bed_type, 
              h.name as hotel_name, h.location as hotel_location,
              u.name as customer_name, u.email as customer_email, u.mobile as customer_mobile
       FROM bookings b
       LEFT JOIN rooms r ON b.room_id = r.id
       LEFT JOIN hotels h ON r.hotel_id = h.id
       LEFT JOIN users u ON b.user_id = u.id
       WHERE b.id = ?`,
      [bookingId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[0];

    // Permission check
    if (req.user.role === 'customer' && booking.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not your booking' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};