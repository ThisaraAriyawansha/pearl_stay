const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

router.get('/hotel/:hotelId', authenticateToken, async (req, res) => {
  try {
    const [bookings] = await db.execute(
      `SELECT b.*, r.name as room_name, h.name as hotel_name, u.name as customer_name, u.email as customer_email 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       JOIN hotels h ON r.hotel_id = h.id
       JOIN users u ON b.user_id = u.id 
       WHERE r.hotel_id = ? 
       ORDER BY b.created_at DESC`,
      [req.params.hotelId]
    );
    res.json({ bookings: bookings || [] });
  } catch (error) {
    console.error('Error fetching bookings:', {
      error: error.message,
      stack: error.stack,
      hotelId: req.params.hotelId,
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's bookings
router.get('/user/my-bookings', authenticateToken, async (req, res) => {
  try {
    const [bookings] = await db.execute(
      `SELECT b.*, r.name as room_name, h.name as hotel_name 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       JOIN hotels h ON r.hotel_id = h.id 
       WHERE b.user_id = ? 
       ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { room_id, check_in, check_out, room_count, adult_count, special_note, price } = req.body;

    if (!room_id || !check_in || !check_out || !price) {
      return res.status(400).json({ error: 'Room ID, check-in, check-out, and price are required' });
    }

    const [result] = await db.execute(
      `INSERT INTO bookings (room_id, check_in, check_out, room_count, adult_count, special_note, price, user_id, booking_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [room_id, check_in, check_out, room_count || 1, adult_count || 1, special_note, price, req.user.id]
    );

    const [newBooking] = await db.execute(
      `SELECT b.*, r.name as room_name, h.name as hotel_name 
       FROM bookings b 
       JOIN rooms r ON b.room_id = r.id 
       JOIN hotels h ON r.hotel_id = h.id 
       WHERE b.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ booking: newBooking[0], message: 'Booking created successfully' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update booking status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { booking_status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(booking_status)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }

    await db.execute(
      'UPDATE bookings SET booking_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [booking_status, req.params.id]
    );

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Update booking status
router.put('/:bookingId', authenticateToken, async (req, res) => {
  const { bookingId } = req.params;
  const { booking_status } = req.body;

  if (!['pending', 'confirmed', 'cancelled'].includes(booking_status)) {
    return res.status(400).json({ error: 'Invalid booking status' });
  }

  try {
    const [bookings] = await db.execute('SELECT * FROM bookings WHERE id = ?', [bookingId]);

    if (bookings.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await db.execute('UPDATE bookings SET booking_status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [
      booking_status,
      bookingId,
    ]);

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});



module.exports = router;