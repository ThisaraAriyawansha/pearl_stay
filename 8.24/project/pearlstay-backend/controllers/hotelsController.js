import { query } from '../config/db.js';
import { validationResult } from 'express-validator';

export const createHotel = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, location, description } = req.body;
    const userId = req.user.id;
    
    const logo = req.files?.logo?.[0]?.filename || null;
    const coverImage = req.files?.cover_image?.[0]?.filename || null;

    const [result] = await query(
      'INSERT INTO hotels (name, location, description, logo, cover_image, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name, location, description, logo, coverImage, userId]
    );

    const hotelId = result.lastInsertRowid || result.insertId;

    res.status(201).json({
      message: 'Hotel created successfully',
      hotelId
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listHotels = async (req, res) => {
  try {
    const { location, min_price, max_price, available } = req.query;
    
    let sql = `
      SELECT h.*, u.name as owner_name, s.name as status_name
      FROM hotels h
      LEFT JOIN users u ON h.user_id = u.id
      LEFT JOIN statuses s ON h.status_id = s.id
      WHERE h.status_id = 1
    `;
    const params = [];

    if (location) {
      sql += ' AND h.location LIKE ?';
      params.push(`%${location}%`);
    }

    if (min_price || max_price) {
      sql += ` AND h.id IN (
        SELECT DISTINCT hotel_id FROM rooms 
        WHERE status_id = 1
      `;
      if (min_price) {
        sql += ' AND price_per_night >= ?';
        params.push(min_price);
      }
      if (max_price) {
        sql += ' AND price_per_night <= ?';
        params.push(max_price);
      }
      sql += ')';
    }

    sql += ' ORDER BY h.created_at DESC';

    const [hotels] = await query(sql, params);

    // Get room count for each hotel
    for (let hotel of hotels) {
      const [roomCount] = await query(
        'SELECT COUNT(*) as room_count FROM rooms WHERE hotel_id = ? AND status_id = 1',
        [hotel.id]
      );
      hotel.room_count = roomCount[0].room_count;
    }

    res.json({ hotels });
  } catch (error) {
    console.error('List hotels error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;

    const [hotels] = await query(
      `SELECT h.*, u.name as owner_name, s.name as status_name
       FROM hotels h
       LEFT JOIN users u ON h.user_id = u.id
       LEFT JOIN statuses s ON h.status_id = s.id
       WHERE h.id = ?`,
      [hotelId]
    );

    if (hotels.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const hotel = hotels[0];

    // Get rooms for this hotel
    const [rooms] = await query(
      `SELECT r.*, s.name as status_name
       FROM rooms r
       LEFT JOIN statuses s ON r.status_id = s.id
       WHERE r.hotel_id = ? AND r.status_id = 1
       ORDER BY r.price_per_night ASC`,
      [hotelId]
    );

    // Get room images for each room
    for (let room of rooms) {
      const [images] = await query(
        'SELECT image FROM room_images WHERE room_id = ?',
        [room.id]
      );
      room.images = images.map(img => img.image);
    }

    hotel.rooms = rooms;

    res.json({ hotel });
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const { name, location, description } = req.body;

    // Check ownership
    const [hotels] = await query('SELECT user_id FROM hotels WHERE id = ?', [hotelId]);
    if (hotels.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    if (req.user.role !== 'admin' && hotels[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not your hotel' });
    }

    const [result] = await query(
      'UPDATE hotels SET name = ?, location = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, location, description, hotelId]
    );

    res.json({ message: 'Hotel updated successfully' });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const hotelId = req.params.id;

    // Check ownership
    const [hotels] = await query('SELECT user_id FROM hotels WHERE id = ?', [hotelId]);
    if (hotels.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    if (req.user.role !== 'admin' && hotels[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not your hotel' });
    }

    await query('DELETE FROM hotels WHERE id = ?', [hotelId]);

    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};