import { query } from '../config/db.js';
import { validationResult } from 'express-validator';

export const createRoom = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { hotel_id, name, price_per_night, adult_price, total_room, size, bed_type, description } = req.body;

    // Check if user owns the hotel
    const [hotels] = await query('SELECT user_id FROM hotels WHERE id = ?', [hotel_id]);
    if (hotels.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    if (req.user.role !== 'admin' && hotels[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not your hotel' });
    }

    const [result] = await query(
      'INSERT INTO rooms (hotel_id, name, price_per_night, adult_price, total_room, size, bed_type, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [hotel_id, name, price_per_night, adult_price || 0, total_room || 1, size, bed_type, description]
    );

    const roomId = result.lastInsertRowid || result.insertId;

    // Handle room images if uploaded
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await query(
          'INSERT INTO room_images (room_id, image) VALUES (?, ?)',
          [roomId, file.filename]
        );
      }
    }

    res.status(201).json({
      message: 'Room created successfully',
      roomId
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listRooms = async (req, res) => {
  try {
    const { hotel_id, min_price, max_price, bed_type, size, available, check_in, check_out } = req.query;

    let sql = `
      SELECT r.*, h.name as hotel_name, h.location as hotel_location, s.name as status_name
      FROM rooms r
      LEFT JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN statuses s ON r.status_id = s.id
      WHERE r.status_id = 1 AND h.status_id = 1
    `;
    const params = [];

    if (hotel_id) {
      sql += ' AND r.hotel_id = ?';
      params.push(hotel_id);
    }

    if (min_price) {
      sql += ' AND r.price_per_night >= ?';
      params.push(min_price);
    }

    if (max_price) {
      sql += ' AND r.price_per_night <= ?';
      params.push(max_price);
    }

    if (bed_type) {
      sql += ' AND r.bed_type LIKE ?';
      params.push(`%${bed_type}%`);
    }

    if (size) {
      sql += ' AND r.size LIKE ?';
      params.push(`%${size}%`);
    }

    sql += ' ORDER BY r.price_per_night ASC';

    const [rooms] = await query(sql, params);

    // Get images for each room
    for (let room of rooms) {
      const [images] = await query(
        'SELECT image FROM room_images WHERE room_id = ?',
        [room.id]
      );
      room.images = images.map(img => img.image);

      // Calculate availability if dates provided
      if (available === 'true' && check_in && check_out) {
        const [booked] = await query(
          `SELECT COALESCE(SUM(room_count), 0) as booked_count
           FROM bookings 
           WHERE room_id = ? 
           AND booking_status != 'cancelled'
           AND NOT (check_out <= ? OR check_in >= ?)`,
          [room.id, check_in, check_out]
        );
        
        room.available_rooms = room.total_room - (booked[0]?.booked_count || 0);
        room.is_available = room.available_rooms > 0;
      }
    }

    res.json({ rooms });
  } catch (error) {
    console.error('List rooms error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    const [rooms] = await query(
      `SELECT r.*, h.name as hotel_name, h.location as hotel_location, h.description as hotel_description, h.cover_image as hotel_cover
       FROM rooms r
       LEFT JOIN hotels h ON r.hotel_id = h.id
       WHERE r.id = ? AND r.status_id = 1`,
      [roomId]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = rooms[0];

    // Get room images
    const [images] = await query(
      'SELECT image FROM room_images WHERE room_id = ?',
      [roomId]
    );
    room.images = images.map(img => img.image);

    // Get other rooms in the same hotel
    const [otherRooms] = await query(
      'SELECT id, name, price_per_night, size, bed_type FROM rooms WHERE hotel_id = ? AND id != ? AND status_id = 1 LIMIT 3',
      [room.hotel_id, roomId]
    );
    room.other_rooms = otherRooms;

    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { name, price_per_night, adult_price, total_room, size, bed_type, description } = req.body;

    // Check ownership
    const [rooms] = await query(
      'SELECT r.*, h.user_id FROM rooms r LEFT JOIN hotels h ON r.hotel_id = h.id WHERE r.id = ?',
      [roomId]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (req.user.role !== 'admin' && rooms[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not your room' });
    }

    await query(
      'UPDATE rooms SET name = ?, price_per_night = ?, adult_price = ?, total_room = ?, size = ?, bed_type = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [name, price_per_night, adult_price || 0, total_room || 1, size, bed_type, description, roomId]
    );

    res.json({ message: 'Room updated successfully' });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    // Check ownership
    const [rooms] = await query(
      'SELECT r.*, h.user_id FROM rooms r LEFT JOIN hotels h ON r.hotel_id = h.id WHERE r.id = ?',
      [roomId]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (req.user.role !== 'admin' && rooms[0].user_id !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden: Not your room' });
    }

    await query('DELETE FROM rooms WHERE id = ?', [roomId]);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};