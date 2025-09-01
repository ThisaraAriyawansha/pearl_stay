const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get rooms for a specific hotel
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const [rooms] = await db.execute(
      `SELECT r.*, s.name as status_name, h.name as hotel_name 
       FROM rooms r 
       JOIN statuses s ON r.status_id = s.id 
       JOIN hotels h ON r.hotel_id = h.id 
       WHERE r.hotel_id = ? 
       ORDER BY r.created_at DESC`,
      [req.params.hotelId]
    );

    // Get room images
    for (let room of rooms) {
      const [images] = await db.execute(
        'SELECT * FROM room_images WHERE room_id = ?',
        [room.id]
      );
      room.images = images;
    }

    res.json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single room
router.get('/:id', async (req, res) => {
  try {
    const [rooms] = await db.execute(
      `SELECT r.*, s.name as status_name, h.name as hotel_name 
       FROM rooms r 
       JOIN statuses s ON r.status_id = s.id 
       JOIN hotels h ON r.hotel_id = h.id 
       WHERE r.id = ?`,
      [req.params.id]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const [images] = await db.execute(
      'SELECT * FROM room_images WHERE room_id = ?',
      [req.params.id]
    );

    const room = { ...rooms[0], images };
    res.json({ room });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new room
router.post('/', authenticateToken, authorizeRoles('owner'), async (req, res) => {
  try {
    const { hotel_id, name, price_per_night, adult_price, total_room, size, bed_type, description, images } = req.body;

    if (!hotel_id || !name || !price_per_night) {
      return res.status(400).json({ error: 'Hotel ID, name, and price are required' });
    }

    // Check if hotel belongs to user
    const [hotels] = await db.execute(
      'SELECT * FROM hotels WHERE id = ? AND user_id = ?',
      [hotel_id, req.user.id]
    );

    if (hotels.length === 0) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const [result] = await db.execute(
      `INSERT INTO rooms (hotel_id, name, price_per_night, adult_price, total_room, size, bed_type, description, status_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [hotel_id, name, price_per_night, adult_price || 0, total_room || 1, size, bed_type, description, 1]
    );

    // Add room images
    if (images && images.length > 0) {
      for (const image of images) {
        await db.execute(
          'INSERT INTO room_images (room_id, image) VALUES (?, ?)',
          [result.insertId, image]
        );
      }
    }

    const [newRoom] = await db.execute(
      `SELECT r.*, s.name as status_name 
       FROM rooms r 
       JOIN statuses s ON r.status_id = s.id 
       WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ room: newRoom[0], message: 'Room created successfully' });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;