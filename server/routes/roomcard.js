const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Your database configuration

// Get all rooms for a specific hotel
// GET /api/hotels/:hotelId/rooms
router.get('/:hotelId/rooms', async (req, res) => {
  const { hotelId } = req.params;

  try {
    // Fetch hotel info
    const [hotelRows] = await db.execute(
      `SELECT id, name, location, description, logo, cover_image
       FROM hotels 
       WHERE id = ?`,
      [hotelId]
    );

    if (hotelRows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    const hotel = hotelRows[0];

    // Fetch rooms with images
    const [roomRows] = await db.execute(
      `SELECT r.id, r.name, r.price_per_night, r.adult_price, r.total_room,
              r.size, r.bed_type, r.description,
              GROUP_CONCAT(ri.image) AS images
       FROM rooms r
       LEFT JOIN room_images ri ON r.id = ri.room_id
       WHERE r.hotel_id = ?
       GROUP BY r.id`,
      [hotelId]
    );

    hotel.rooms = roomRows.map(room => ({
      ...room,
      images: room.images ? room.images.split(',') : []
    }));

    res.json(hotel);
  } catch (err) {
    console.error('Error fetching hotel rooms:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});


// Get a specific room details
router.get('/hotels/:hotelId/rooms/:roomId', async (req, res) => {
  try {
    const { hotelId, roomId } = req.params;
    const connection = await mysql.createConnection(dbConfig);

    const roomQuery = `
      SELECT 
        r.*,
        h.name as hotel_name,
        h.location as hotel_location,
        GROUP_CONCAT(ri.image) as images
      FROM rooms r
      JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN room_images ri ON r.id = ri.room_id
      WHERE r.id = ? AND r.hotel_id = ? AND r.status_id = 1 AND h.status_id = 1
      GROUP BY r.id
    `;

    const [room] = await connection.execute(roomQuery, [roomId, hotelId]);

    if (room.length === 0) {
      await connection.end();
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const roomData = {
      ...room[0],
      price_per_night: parseFloat(room[0].price_per_night),
      adult_price: parseFloat(room[0].adult_price),
      images: room[0].images ? room[0].images.split(',') : []
    };

    await connection.end();

    res.json({
      success: true,
      room: roomData
    });

  } catch (error) {
    console.error('Error fetching room details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get available rooms for specific dates (optional - for booking system)
router.get('/hotels/:hotelId/rooms/available', async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { check_in, check_out } = req.query;
    
    const connection = await mysql.createConnection(dbConfig);

    let roomsQuery = `
      SELECT 
        r.id,
        r.name,
        r.price_per_night,
        r.adult_price,
        r.total_room,
        r.size,
        r.bed_type,
        r.description,
        GROUP_CONCAT(ri.image) as images
      FROM rooms r
      LEFT JOIN room_images ri ON r.id = ri.room_id
      WHERE r.hotel_id = ? AND r.status_id = 1
    `;

    let queryParams = [hotelId];

    // If dates are provided, filter out booked rooms (you'll need a bookings table for this)
    if (check_in && check_out) {
      roomsQuery += `
        AND r.id NOT IN (
          SELECT DISTINCT room_id 
          FROM bookings 
          WHERE hotel_id = ? 
          AND status NOT IN ('cancelled', 'rejected')
          AND (
            (check_in_date <= ? AND check_out_date > ?) OR
            (check_in_date < ? AND check_out_date >= ?) OR
            (check_in_date >= ? AND check_out_date <= ?)
          )
        )
      `;
      queryParams.push(hotelId, check_in, check_in, check_out, check_out, check_in, check_out);
    }

    roomsQuery += ' GROUP BY r.id ORDER BY r.price_per_night ASC';

    const [rooms] = await connection.execute(roomsQuery, queryParams);

    const processedRooms = rooms.map(room => ({
      ...room,
      price_per_night: parseFloat(room.price_per_night),
      adult_price: parseFloat(room.adult_price),
      images: room.images ? room.images.split(',') : []
    }));

    await connection.end();

    res.json({
      success: true,
      rooms: processedRooms,
      total_available: processedRooms.length,
      filters: {
        check_in: check_in || null,
        check_out: check_out || null
      }
    });

  } catch (error) {
    console.error('Error fetching available rooms:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;