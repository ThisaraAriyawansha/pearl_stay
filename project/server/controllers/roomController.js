const db = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

const getAllRooms = async (req, res) => {
  try {
    const { hotel_id, price_min, price_max, size, bed_type, location } = req.query;
    
    let query = `
      SELECT r.*, h.name as hotel_name, h.location as hotel_location, s.name as status_name,
             GROUP_CONCAT(ri.image) as images
      FROM rooms r
      LEFT JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN statuses s ON r.status_id = s.id
      LEFT JOIN room_images ri ON r.id = ri.room_id
    `;
    
    const conditions = [];
    const params = [];

    if (hotel_id) {
      conditions.push('r.hotel_id = ?');
      params.push(hotel_id);
    }

    if (price_min) {
      conditions.push('r.price_per_night >= ?');
      params.push(price_min);
    }

    if (price_max) {
      conditions.push('r.price_per_night <= ?');
      params.push(price_max);
    }

    if (size) {
      conditions.push('r.size LIKE ?');
      params.push(`%${size}%`);
    }

    if (bed_type) {
      conditions.push('r.bed_type = ?');
      params.push(bed_type);
    }

    if (location) {
      conditions.push('h.location LIKE ?');
      params.push(`%${location}%`);
    }

    // Only show active rooms from active hotels
    conditions.push('r.status_id = 1');
    conditions.push('h.status_id = 1');

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY r.id ORDER BY r.price_per_night ASC';

    const [rooms] = await db.execute(query, params);

    // Process images
    const processedRooms = rooms.map(room => ({
      ...room,
      images: room.images ? room.images.split(',') : []
    }));

    res.json({ rooms: processedRooms });
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch rooms' });
  }
};

const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rooms] = await db.execute(`
      SELECT r.*, h.name as hotel_name, h.location as hotel_location, 
             h.description as hotel_description, s.name as status_name
      FROM rooms r
      LEFT JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN statuses s ON r.status_id = s.id
      WHERE r.id = ?
    `, [id]);

    if (rooms.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    // Get room images
    const [images] = await db.execute(
      'SELECT image FROM room_images WHERE room_id = ?',
      [id]
    );

    const room = {
      ...rooms[0],
      images: images.map(img => img.image)
    };

    res.json({ room });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({ error: 'Failed to fetch room' });
  }
};

const getHotelRooms = async (req, res) => {
  try {
    const { hotel_id } = req.params;

    const [rooms] = await db.execute(`
      SELECT r.*, s.name as status_name,
             GROUP_CONCAT(ri.image) as images
      FROM rooms r
      LEFT JOIN statuses s ON r.status_id = s.id
      LEFT JOIN room_images ri ON r.id = ri.room_id
      WHERE r.hotel_id = ?
      GROUP BY r.id
      ORDER BY r.created_at DESC
    `, [hotel_id]);

    const processedRooms = rooms.map(room => ({
      ...room,
      images: room.images ? room.images.split(',') : []
    }));

    res.json({ rooms: processedRooms });
  } catch (error) {
    console.error('Get hotel rooms error:', error);
    res.status(500).json({ error: 'Failed to fetch hotel rooms' });
  }
};

const createRoom = async (req, res) => {
  try {
    const { hotel_id, name, price_per_night, adult_price, total_room, size, bed_type, description } = req.body;

    // Check if hotel belongs to user (for owners)
    if (req.user.role === 'owner') {
      const [hotels] = await db.execute(
        'SELECT id FROM hotels WHERE id = ? AND user_id = ?',
        [hotel_id, req.user.id]
      );

      if (hotels.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const [result] = await db.execute(
      'INSERT INTO rooms (hotel_id, name, price_per_night, adult_price, total_room, size, bed_type, description, status_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [hotel_id, name, price_per_night, adult_price || 0, total_room || 1, size, bed_type, description, 1]
    );

    const roomId = result.insertId;

    // Handle room images
    if (req.files && req.files.length > 0) {
      const imageInserts = req.files.map(file => [roomId, file.filename]);
      await db.execute(
        'INSERT INTO room_images (room_id, image) VALUES ?',
        [imageInserts]
      );
    }

    res.status(201).json({
      message: 'Room created successfully',
      room: {
        id: roomId,
        hotel_id,
        name,
        price_per_night,
        adult_price,
        total_room,
        size,
        bed_type,
        description
      }
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price_per_night, adult_price, total_room, size, bed_type, description } = req.body;

    // Check if room belongs to user's hotel (for owners)
    if (req.user.role === 'owner') {
      const [rooms] = await db.execute(`
        SELECT r.id FROM rooms r
        LEFT JOIN hotels h ON r.hotel_id = h.id
        WHERE r.id = ? AND h.user_id = ?
      `, [id, req.user.id]);

      if (rooms.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    await db.execute(
      'UPDATE rooms SET name = ?, price_per_night = ?, adult_price = ?, total_room = ?, size = ?, bed_type = ?, description = ? WHERE id = ?',
      [name, price_per_night, adult_price || 0, total_room || 1, size, bed_type, description, id]
    );

    // Handle new room images
    if (req.files && req.files.length > 0) {
      const imageInserts = req.files.map(file => [id, file.filename]);
      await db.execute(
        'INSERT INTO room_images (room_id, image) VALUES ?',
        [imageInserts]
      );
    }

    res.json({ message: 'Room updated successfully' });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({ error: 'Failed to update room' });
  }
};

const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_id } = req.body;

    await db.execute(
      'UPDATE rooms SET status_id = ? WHERE id = ?',
      [status_id, id]
    );

    res.json({ message: 'Room status updated successfully' });
  } catch (error) {
    console.error('Update room status error:', error);
    res.status(500).json({ error: 'Failed to update room status' });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if room belongs to user's hotel (for owners)
    if (req.user.role === 'owner') {
      const [rooms] = await db.execute(`
        SELECT r.id FROM rooms r
        LEFT JOIN hotels h ON r.hotel_id = h.id
        WHERE r.id = ? AND h.user_id = ?
      `, [id, req.user.id]);

      if (rooms.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    await db.execute('DELETE FROM rooms WHERE id = ?', [id]);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};

const deleteRoomImage = async (req, res) => {
  try {
    const { room_id, image_id } = req.params;

    // Check if room belongs to user's hotel (for owners)
    if (req.user.role === 'owner') {
      const [rooms] = await db.execute(`
        SELECT r.id FROM rooms r
        LEFT JOIN hotels h ON r.hotel_id = h.id
        WHERE r.id = ? AND h.user_id = ?
      `, [room_id, req.user.id]);

      if (rooms.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Get image filename for deletion
    const [images] = await db.execute(
      'SELECT image FROM room_images WHERE id = ? AND room_id = ?',
      [image_id, room_id]
    );

    if (images.length > 0) {
      // Delete file from filesystem
      const imagePath = path.join(__dirname, '..', 'uploads', images[0].image);
      try {
        await fs.unlink(imagePath);
      } catch (err) {
        console.log('File already deleted or not found');
      }
    }

    await db.execute(
      'DELETE FROM room_images WHERE id = ? AND room_id = ?',
      [image_id, room_id]
    );

    res.json({ message: 'Room image deleted successfully' });
  } catch (error) {
    console.error('Delete room image error:', error);
    res.status(500).json({ error: 'Failed to delete room image' });
  }
};

module.exports = {
  getAllRooms,
  getRoomById,
  getHotelRooms,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
  deleteRoomImage
};