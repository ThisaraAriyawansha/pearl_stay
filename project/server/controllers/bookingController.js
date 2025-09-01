const db = require('../config/database');

const calculateBookingPrice = (pricePerNight, adultPrice, checkIn, checkOut, roomCount, adultCount) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const roomTotal = nights * pricePerNight * roomCount;
  const adultSurcharge = (adultCount > 2) ? (adultCount - 2) * adultPrice * nights * roomCount : 0;
  
  return roomTotal + adultSurcharge;
};

const checkAvailability = async (roomId, checkIn, checkOut, roomCount, excludeBookingId = null) => {
  let query = `
    SELECT SUM(room_count) as booked_rooms
    FROM bookings 
    WHERE room_id = ? 
    AND booking_status IN ('pending', 'confirmed')
    AND NOT (check_out <= ? OR check_in >= ?)
  `;
  
  const params = [roomId, checkIn, checkOut];
  
  if (excludeBookingId) {
    query += ' AND id != ?';
    params.push(excludeBookingId);
  }

  const [bookings] = await db.execute(query, params);
  const bookedRooms = bookings[0].booked_rooms || 0;

  const [rooms] = await db.execute(
    'SELECT total_room FROM rooms WHERE id = ?',
    [roomId]
  );

  if (rooms.length === 0) {
    return false;
  }

  const totalRooms = rooms[0].total_room;
  const availableRooms = totalRooms - bookedRooms;

  return availableRooms >= roomCount;
};

const createBooking = async (req, res) => {
  try {
    const { room_id, check_in, check_out, room_count, adult_count, special_note } = req.body;
    const userId = req.user.id;

    if (!room_id || !check_in || !check_out || !room_count || !adult_count) {
      return res.status(400).json({ error: 'All booking fields are required' });
    }

    // Validate dates
    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(400).json({ error: 'Check-in date cannot be in the past' });
    }

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ error: 'Check-out date must be after check-in date' });
    }

    // Get room details
    const [rooms] = await db.execute(
      'SELECT price_per_night, adult_price FROM rooms WHERE id = ? AND status_id = 1',
      [room_id]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ error: 'Room not found or not available' });
    }

    const room = rooms[0];

    // Check availability
    const isAvailable = await checkAvailability(room_id, check_in, check_out, room_count);
    if (!isAvailable) {
      return res.status(400).json({ error: 'Room not available for selected dates' });
    }

    // Calculate price
    const totalPrice = calculateBookingPrice(
      room.price_per_night,
      room.adult_price,
      check_in,
      check_out,
      room_count,
      adult_count
    );

    const [result] = await db.execute(
      'INSERT INTO bookings (room_id, check_in, check_out, room_count, adult_count, special_note, price, user_id, booking_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [room_id, check_in, check_out, room_count, adult_count, special_note, totalPrice, userId, 'pending']
    );

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        id: result.insertId,
        room_id,
        check_in,
        check_out,
        room_count,
        adult_count,
        special_note,
        price: totalPrice,
        booking_status: 'pending'
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const [bookings] = await db.execute(`
      SELECT b.*, r.name as room_name, h.name as hotel_name, h.location as hotel_location
      FROM bookings b
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      WHERE b.user_id = ?
      ORDER BY b.created_at DESC
    `, [req.user.id]);

    res.json({ bookings });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const getHotelBookings = async (req, res) => {
  try {
    const { hotel_id } = req.params;

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

    const [bookings] = await db.execute(`
      SELECT b.*, r.name as room_name, u.name as customer_name, u.email as customer_email
      FROM bookings b
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN users u ON b.user_id = u.id
      WHERE r.hotel_id = ?
      ORDER BY b.created_at DESC
    `, [hotel_id]);

    res.json({ bookings });
  } catch (error) {
    console.error('Get hotel bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch hotel bookings' });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.execute(`
      SELECT b.*, r.name as room_name, h.name as hotel_name, h.location as hotel_location,
             u.name as customer_name, u.email as customer_email
      FROM bookings b
      LEFT JOIN rooms r ON b.room_id = r.id
      LEFT JOIN hotels h ON r.hotel_id = h.id
      LEFT JOIN users u ON b.user_id = u.id
      ORDER BY b.created_at DESC
    `);

    res.json({ bookings });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { booking_status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(booking_status)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }

    await db.execute(
      'UPDATE bookings SET booking_status = ? WHERE id = ?',
      [booking_status, id]
    );

    res.json({ message: 'Booking status updated successfully' });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
};

const calculatePrice = async (req, res) => {
  try {
    const { room_id, check_in, check_out, room_count, adult_count } = req.query;

    const [rooms] = await db.execute(
      'SELECT price_per_night, adult_price FROM rooms WHERE id = ?',
      [room_id]
    );

    if (rooms.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    const room = rooms[0];
    const totalPrice = calculateBookingPrice(
      room.price_per_night,
      room.adult_price,
      check_in,
      check_out,
      parseInt(room_count),
      parseInt(adult_count)
    );

    const checkInDate = new Date(check_in);
    const checkOutDate = new Date(check_out);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));

    res.json({ 
      totalPrice: totalPrice.toFixed(2),
      nights,
      breakdown: {
        basePrice: room.price_per_night,
        adultPrice: room.adult_price,
        roomCount: parseInt(room_count),
        adultCount: parseInt(adult_count),
        nights
      }
    });
  } catch (error) {
    console.error('Calculate price error:', error);
    res.status(500).json({ error: 'Failed to calculate price' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getHotelBookings,
  getAllBookings,
  updateBookingStatus,
  calculatePrice,
  checkAvailability
};