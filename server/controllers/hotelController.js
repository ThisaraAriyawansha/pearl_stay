const db = require('../config/database');
const path = require('path');
const fs = require('fs').promises;

const getAllHotels = async (req, res) => {
  try {
    const { location, status } = req.query;
    let query = `
      SELECT h.*, u.name as owner_name, s.name as status_name
      FROM hotels h
      LEFT JOIN users u ON h.user_id = u.id
      LEFT JOIN statuses s ON h.status_id = s.id
    `;
    
    const conditions = [];
    const params = [];

    if (location) {
      conditions.push('h.location LIKE ?');
      params.push(`%${location}%`);
    }

    if (status) {
      conditions.push('h.status_id = ?');
      params.push(status);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY h.created_at DESC';

    const [hotels] = await db.execute(query, params);
    res.json({ hotels });
  } catch (error) {
    console.error('Get hotels error:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
};

const getHotelById = async (req, res) => {
  try {
    const { id } = req.params;

    const [hotels] = await db.execute(`
      SELECT h.*, u.name as owner_name, s.name as status_name
      FROM hotels h
      LEFT JOIN users u ON h.user_id = u.id
      LEFT JOIN statuses s ON h.status_id = s.id
      WHERE h.id = ?
    `, [id]);

    if (hotels.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Get rooms for this hotel
    const [rooms] = await db.execute(`
      SELECT r.*, s.name as status_name
      FROM rooms r
      LEFT JOIN statuses s ON r.status_id = s.id
      WHERE r.hotel_id = ? AND r.status_id = 1
      ORDER BY r.price_per_night ASC
    `, [id]);

    res.json({ 
      hotel: hotels[0],
      rooms 
    });
  } catch (error) {
    console.error('Get hotel error:', error);
    res.status(500).json({ error: 'Failed to fetch hotel' });
  }
};

const getOwnerHotels = async (req, res) => {
  try {
    const [hotels] = await db.execute(`
      SELECT h.*, s.name as status_name
      FROM hotels h
      LEFT JOIN statuses s ON h.status_id = s.id
      WHERE h.user_id = ?
      ORDER BY h.created_at DESC
    `, [req.user.id]);

    res.json({ hotels });
  } catch (error) {
    console.error('Get owner hotels error:', error);
    res.status(500).json({ error: 'Failed to fetch hotels' });
  }
};

const createHotel = async (req, res) => {
  try {
    const { name, location, description } = req.body;
    const userId = req.user.id;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    const logo = req.files?.logo?.[0]?.filename || null;
    const coverImage = req.files?.cover_image?.[0]?.filename || null;

    const [result] = await db.execute(
      'INSERT INTO hotels (name, location, description, logo, cover_image, user_id, status_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, location, description, logo, coverImage, userId, 2] // status_id 2 = pending
    );

    res.status(201).json({
      message: 'Hotel created successfully',
      hotel: {
        id: result.insertId,
        name,
        location,
        description,
        logo,
        cover_image: coverImage,
        user_id: userId,
        status_id: 2
      }
    });
  } catch (error) {
    console.error('Create hotel error:', error);
    res.status(500).json({ error: 'Failed to create hotel' });
  }
};

const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, description } = req.body;
    const userId = req.user.id;

    // Check if hotel belongs to user (for owners) or user is admin
    if (req.user.role === 'owner') {
      const [hotels] = await db.execute(
        'SELECT id FROM hotels WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (hotels.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    const logo = req.files?.logo?.[0]?.filename || null;
    const coverImage = req.files?.cover_image?.[0]?.filename || null;

    let query = 'UPDATE hotels SET name = ?, location = ?, description = ?';
    let params = [name, location, description];

    if (logo) {
      query += ', logo = ?';
      params.push(logo);
    }

    if (coverImage) {
      query += ', cover_image = ?';
      params.push(coverImage);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.execute(query, params);

    res.json({ message: 'Hotel updated successfully' });
  } catch (error) {
    console.error('Update hotel error:', error);
    res.status(500).json({ error: 'Failed to update hotel' });
  }
};

const updateHotelStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_id } = req.body;

    await db.execute(
      'UPDATE hotels SET status_id = ? WHERE id = ?',
      [status_id, id]
    );

    res.json({ message: 'Hotel status updated successfully' });
  } catch (error) {
    console.error('Update hotel status error:', error);
    res.status(500).json({ error: 'Failed to update hotel status' });
  }
};

const deleteHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if hotel belongs to user (for owners) or user is admin
    if (req.user.role === 'owner') {
      const [hotels] = await db.execute(
        'SELECT id FROM hotels WHERE id = ? AND user_id = ?',
        [id, userId]
      );

      if (hotels.length === 0) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    await db.execute('DELETE FROM hotels WHERE id = ?', [id]);

    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Delete hotel error:', error);
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
};

module.exports = {
  getAllHotels,
  getHotelById,
  getOwnerHotels,
  createHotel,
  updateHotel,
  updateHotelStatus,
  deleteHotel
};