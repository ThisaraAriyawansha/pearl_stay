import { pool } from '../config/database.js';

export const createRoom = async (req, res) => {
  try {
    const { hotelId, name, price_per_night, adult_price, total_room, size, bed_type, description } = req.body;

    // Verify hotel belongs to user
    const [hotels] = await pool.execute(
      'SELECT id FROM hotels WHERE id = ? AND user_id = ?',
      [hotelId, req.user.id]
    );

    if (hotels.length === 0) {
      return res.status(403).json({ message: 'Unauthorized to add rooms to this hotel' });
    }

    const [result] = await pool.execute(
      'INSERT INTO rooms (hotel_id, name, price_per_night, adult_price, total_room, size, bed_type, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [hotelId, name, price_per_night, adult_price || 0, total_room, size, bed_type, description]
    );

    res.status(201).json({
      message: 'Room created successfully',
      roomId: result.insertId
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { checkIn, checkOut, minPrice, maxPrice, bedType, size } = req.query;

    let query = `
      SELECT r.*, 
             GROUP_CONCAT(ri.image) as images,
             (r.total_room - COALESCE(booked.rooms_booked, 0)) as available_rooms
      FROM rooms r
      LEFT JOIN room_images ri ON r.id = ri.room_id
      LEFT JOIN (
        SELECT room_id, SUM(room_count) as rooms_booked
        FROM bookings 
        WHERE booking_status != 'cancelled'
    `;

    const params = [hotelId];

    if (checkIn && checkOut) {
      query += ` AND ((check_in <= ? AND check_out > ?) OR (check_in < ? AND check_out >= ?))`;
      params.push(checkOut, checkIn, checkOut, checkIn);
    }

    query += `
        GROUP BY room_id
      ) booked ON r.id = booked.room_id
      WHERE r.hotel_id = ? AND r.status_id = 1
    `;

    if (minPrice) {
      query += ' AND r.price_per_night >= ?';
      params.push(minPrice);
    }

    if (maxPrice) {
      query += ' AND r.price_per_night <= ?';
      params.push(maxPrice);
    }

    if (bedType) {
      query += ' AND r.bed_type = ?';
      params.push(bedType);
    }

    if (size) {
      query += ' AND r.size = ?';
      params.push(size);
    }

    query += ' GROUP BY r.id ORDER BY r.price_per_night ASC';

    const [rooms] = await pool.execute(query, params);

    res.json(rooms.map(room => ({
      ...room,
      images: room.images ? room.images.split(',') : [],
      available_rooms: Math.max(0, room.available_rooms || room.total_room)
    })));
  } catch (error) {
    console.error('Get rooms error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, roomCount } = req.body;

    const [bookings] = await pool.execute(`
      SELECT SUM(room_count) as booked_rooms
      FROM bookings 
      WHERE room_id = ? 
        AND booking_status != 'cancelled'
        AND ((check_in <= ? AND check_out > ?) OR (check_in < ? AND check_out >= ?))
    `, [roomId, checkOut, checkIn, checkOut, checkIn]);

    const [rooms] = await pool.execute(
      'SELECT total_room FROM rooms WHERE id = ?',
      [roomId]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const totalRooms = rooms[0].total_room;
    const bookedRooms = bookings[0].booked_rooms || 0;
    const availableRooms = totalRooms - bookedRooms;

    res.json({
      available: availableRooms >= roomCount,
      availableRooms,
      totalRooms,
      bookedRooms
    });
  } catch (error) {
    console.error('Check availability error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};