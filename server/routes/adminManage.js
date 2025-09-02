const express = require('express');
const router = express.Router();
const pool = require('../config/database'); // Assuming this is the correct import for the database pool
const { authenticateToken } = require('../middleware/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin role required.' });
  }
  next();
};

// GET /api/adminManage/user - Get all users
router.get('/user', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query(`
      SELECT u.*, s.name as status_name 
      FROM users u 
      JOIN statuses s ON u.status_id = s.id
    `);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// PUT /api/adminManage/user/:id - Update user status
router.put('/user/:id', authenticateToken, isAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE users SET status_id = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

// GET /api/adminManage/hotel - Get all hotels
router.get('/hotel', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [hotels] = await pool.query(`
      SELECT h.*, s.name as status_name, u.name as owner_name,
      (SELECT COUNT(*) FROM rooms r WHERE r.hotel_id = h.id) as room_count
      FROM hotels h 
      JOIN statuses s ON h.status_id = s.id
      JOIN users u ON h.user_id = u.id
    `);
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
});

// PUT /api/adminManage/hotel/:id - Update hotel status
router.put('/hotel/:id', authenticateToken, isAdmin, async (req, res) => {
  const { status_id } = req.body;
  try {
    await pool.query('UPDATE hotels SET status_id = ? WHERE id = ?', [status_id, req.params.id]);
    res.json({ message: 'Hotel status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update hotel status' });
  }
});

// GET /api/adminManage/booking - Get all bookings
router.get('/booking', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [bookings] = await pool.query(`
      SELECT b.*, u.name as user_name, r.name as room_name, h.name as hotel_name
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN rooms r ON b.room_id = r.id
      JOIN hotels h ON r.hotel_id = h.id
      ORDER BY b.created_at DESC
    `);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// PUT /api/adminManage/booking/:id - Update booking status
router.put('/booking/:id', authenticateToken, isAdmin, async (req, res) => {
  const { booking_status } = req.body;
  try {
    await pool.query('UPDATE bookings SET booking_status = ? WHERE id = ?', [booking_status, req.params.id]);
    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

module.exports = router;