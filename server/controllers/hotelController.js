import { pool } from '../config/database.js';

export const createHotel = async (req, res) => {
  try {
    const { name, location, description } = req.body;
    const userId = req.user.id;

    const [result] = await pool.execute(
      'INSERT INTO hotels (name, location, description, user_id) VALUES (?, ?, ?, ?)',
      [name, location, description, userId]
    );

    res.status(201).json({
      message: 'Hotel created successfully',
      hotelId: result.insertId
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getHotels = async (req, res) => {
  try {
    const { location, checkIn, checkOut, guests, rooms } = req.query;
    
    let query = `
      SELECT h.*, u.email as owner_email, 
             COUNT(r.id) as total_rooms,
             MIN(r.price_per_night) as min_price
      FROM hotels h
      LEFT JOIN users u ON h.user_id = u.id
      LEFT JOIN rooms r ON h.id = r.hotel_id AND r.status_id = 1
      WHERE h.status_id = 1
    `;
    
    const params = [];

    if (location) {
      query += ' AND h.location LIKE ?';
      params.push(`%${location}%`);
    }

    query += ' GROUP BY h.id ORDER BY h.created_at DESC';

    const [hotels] = await pool.execute(query, params);
    res.json(hotels);
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const [hotels] = await pool.execute(
      'SELECT h.*, u.email as owner_email FROM hotels h LEFT JOIN users u ON h.user_id = u.id WHERE h.id = ?',
      [id]
    );

    if (hotels.length === 0) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Get hotel rooms with images
    const [rooms] = await pool.execute(`
      SELECT r.*, 
             GROUP_CONCAT(ri.image) as images
      FROM rooms r
      LEFT JOIN room_images ri ON r.id = ri.room_id
      WHERE r.hotel_id = ? AND r.status_id = 1
      GROUP BY r.id
    `, [id]);

    res.json({
      ...hotels[0],
      rooms: rooms.map(room => ({
        ...room,
        images: room.images ? room.images.split(',') : []
      }))
    });
  } catch (error) {
    console.error('Get hotel by id error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateHotelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_id } = req.body;

    await pool.execute(
      'UPDATE hotels SET status_id = ? WHERE id = ?',
      [status_id, id]
    );

    res.json({ message: 'Hotel status updated successfully' });
  } catch (error) {
    console.error('Update hotel status error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getMyHotels = async (req, res) => {
  try {
    const userId = req.user.id;

    const [hotels] = await pool.execute(`
      SELECT h.*, 
             COUNT(r.id) as total_rooms,
             COUNT(b.id) as total_bookings
      FROM hotels h
      LEFT JOIN rooms r ON h.id = r.hotel_id
      LEFT JOIN bookings b ON r.id = b.room_id
      WHERE h.user_id = ?
      GROUP BY h.id
      ORDER BY h.created_at DESC
    `, [userId]);

    res.json(hotels);
  } catch (error) {
    console.error('Get my hotels error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};