const express = require('express');
const router = express.Router();
const db = require('../config/database'); // Your database configuration

// Get hotel details, rooms, and room images
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch hotel details
    const [hotelRows] = await db.query('SELECT * FROM hotels WHERE id = ?', [id]);
    if (hotelRows.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    // Fetch rooms for the hotel
    const [rooms] = await db.query('SELECT * FROM rooms WHERE hotel_id = ? AND status_id = 1', [id]);

    // Fetch images for each room
    const roomIds = rooms.map(room => room.id);
    let roomImages = [];
    if (roomIds.length > 0) {
      [roomImages] = await db.query('SELECT * FROM room_images WHERE room_id IN (?)', [roomIds]);
    }

    // Attach images to their respective rooms
    const roomsWithImages = rooms.map(room => ({
      ...room,
      images: roomImages.filter(image => image.room_id === room.id).map(image => image.image),
    }));

    res.json({
      hotel: hotelRows[0],
      rooms: roomsWithImages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;