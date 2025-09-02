const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const path = require('path');
const fs = require('fs').promises;
const multer = require('multer');

// Configure multer for file uploads
const uploadDir = path.join(__dirname, '..', 'RoomUploads');
fs.mkdir(uploadDir, { recursive: true }).catch(console.error);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});


const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG, JPG, and PNG files are allowed'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Get rooms for a specific hotel
router.get('/hotel/:hotelId', async (req, res) => {
  try {
    const hotelId = parseInt(req.params.hotelId, 10);
    if (isNaN(hotelId)) {
      return res.status(400).json({ error: 'Invalid hotel ID' });
    }

    const [hotels] = await db.execute('SELECT id, name FROM hotels WHERE id = ?', [hotelId]);
    if (hotels.length === 0) {
      return res.status(404).json({ error: `Hotel with ID ${hotelId} not found` });
    }

    const [rooms] = await db.execute(
      `SELECT r.*, s.name as status_name, h.name as hotel_name 
       FROM rooms r 
       JOIN statuses s ON r.status_id = s.id 
       JOIN hotels h ON r.hotel_id = h.id 
       WHERE r.hotel_id = ? 
       ORDER BY r.created_at DESC`,
      [hotelId]
    );

    for (let room of rooms) {
      const [images] = await db.execute(
        'SELECT id, image, created_at FROM room_images WHERE room_id = ?',
        [room.id]
      );
      room.images = images;
    }

    res.json({ rooms });
  } catch (error) {
    console.error('Error fetching rooms:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
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
      'SELECT id, image, created_at FROM room_images WHERE room_id = ?',
      [req.params.id]
    );

    const room = { ...rooms[0], images };
    res.json({ room });
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Create new room
router.post('/', authenticateToken, authorizeRoles('owner'), (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    console.log('Uploaded files:', req.files ? req.files.map(f => f.filename) : 'No files');
    next();
  });
}, async (req, res) => {
  try {
    const { hotel_id, name, price_per_night, adult_price, total_room, size, bed_type, description } = req.body;
    const parsedHotelId = parseInt(hotel_id, 10);

    if (isNaN(parsedHotelId) || !name || !price_per_night) {
      return res.status(400).json({ error: 'Hotel ID, name, and price are required' });
    }

    const [hotels] = await db.execute(
      'SELECT id FROM hotels WHERE id = ? AND user_id = ?',
      [parsedHotelId, req.user.id]
    );
    if (hotels.length === 0) {
      return res.status(403).json({ error: `Access denied: Hotel ID ${parsedHotelId} not found or not owned` });
    }

    const [result] = await db.execute(
      `INSERT INTO rooms (hotel_id, name, price_per_night, adult_price, total_room, size, bed_type, description, status_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [parsedHotelId, name, price_per_night, adult_price || 0, total_room || 1, size || null, bed_type || null, description || null, 1]
    );

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imagePath = `/RoomUploads/${file.filename}`;
        const [imageResult] = await db.execute(
          'INSERT INTO room_images (room_id, image) VALUES (?, ?)',
          [result.insertId, imagePath]
        );
        images.push({ id: imageResult.insertId, room_id: result.insertId, image: imagePath });
      }
    }

    const [newRoom] = await db.execute(
      `SELECT r.*, s.name as status_name, h.name as hotel_name 
       FROM rooms r 
       JOIN statuses s ON r.status_id = s.id 
       JOIN hotels h ON r.hotel_id = h.id 
       WHERE r.id = ?`,
      [result.insertId]
    );

    res.status(201).json({ room: { ...newRoom[0], images }, message: 'Room created successfully' });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Update room
router.put('/:id', authenticateToken, authorizeRoles('owner'), (req, res, next) => {
  upload.array('images', 5)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: `Multer error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }
    console.log('Uploaded files:', req.files ? req.files.map(f => f.filename) : 'No files');
    next();
  });
}, async (req, res) => {
  try {
    const { hotel_id, name, price_per_night, adult_price, total_room, size, bed_type, description } = req.body;
    const parsedHotelId = parseInt(hotel_id, 10);

    if (isNaN(parsedHotelId) || !name || !price_per_night) {
      return res.status(400).json({ error: 'Hotel ID, name, and price are required' });
    }

    const [hotels] = await db.execute(
      'SELECT id FROM hotels WHERE id = ? AND user_id = ?',
      [parsedHotelId, req.user.id]
    );
    if (hotels.length === 0) {
      return res.status(403).json({ error: `Access denied: Hotel ID ${parsedHotelId} not found or not owned` });
    }

    const [rooms] = await db.execute(
      'SELECT id FROM rooms WHERE id = ? AND hotel_id = ?',
      [req.params.id, parsedHotelId]
    );
    if (rooms.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }

    await db.execute(
      `UPDATE rooms 
       SET name = ?, price_per_night = ?, adult_price = ?, total_room = ?, size = ?, bed_type = ?, description = ? 
       WHERE id = ?`,
      [name, price_per_night, adult_price || 0, total_room || 1, size || null, bed_type || null, description || null, req.params.id]
    );

    if (req.files && req.files.length > 0) {
      const [existingImages] = await db.execute(
        'SELECT id, image FROM room_images WHERE room_id = ?',
        [req.params.id]
      );
      for (const img of existingImages) {
        try {
          await fs.unlink(path.join(__dirname, '..', img.image));
        } catch (err) {
          console.error(`Error deleting image ${img.image}:`, err);
        }
      }
      await db.execute('DELETE FROM room_images WHERE room_id = ?', [req.params.id]);

      for (const file of req.files) {
        const imagePath = `/RoomUploads/${file.filename}`;
        await db.execute(
          'INSERT INTO room_images (room_id, image) VALUES (?, ?)',
          [req.params.id, imagePath]
        );
      }
    }

    const [updatedRoom] = await db.execute(
      `SELECT r.*, s.name as status_name, h.name as hotel_name 
       FROM rooms r 
       JOIN statuses s ON r.status_id = s.id 
       JOIN hotels h ON r.hotel_id = h.id 
       WHERE r.id = ?`,
      [req.params.id]
    );

    const [images] = await db.execute(
      'SELECT id, image, created_at FROM room_images WHERE room_id = ?',
      [req.params.id]
    );

    res.json({ room: { ...updatedRoom[0], images }, message: 'Room updated successfully' });
  } catch (error) {
    console.error('Error updating room:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Delete room
router.delete('/:id', authenticateToken, authorizeRoles('owner'), async (req, res) => {
  try {
    const [rooms] = await db.execute(
      `SELECT r.id, h.user_id 
       FROM rooms r 
       JOIN hotels h ON r.hotel_id = h.id 
       WHERE r.id = ? AND h.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (rooms.length === 0) {
      return res.status(404).json({ error: 'Room not found or access denied' });
    }

    const [images] = await db.execute(
      'SELECT id, image FROM room_images WHERE room_id = ?',
      [req.params.id]
    );
    for (const img of images) {
      try {
        await fs.unlink(path.join(__dirname, '..', img.image));
      } catch (err) {
        console.error(`Error deleting image ${img.image}:`, err);
      }
    }
    await db.execute('DELETE FROM room_images WHERE room_id = ?', [req.params.id]);

    await db.execute('DELETE FROM rooms WHERE id = ?', [req.params.id]);

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Delete single room image
router.delete('/image/:id', authenticateToken, authorizeRoles('owner'), async (req, res) => {
  try {
    const [images] = await db.execute(
      `SELECT ri.id, ri.image, h.user_id 
       FROM room_images ri 
       JOIN rooms r ON ri.room_id = r.id 
       JOIN hotels h ON r.hotel_id = h.id 
       WHERE ri.id = ? AND h.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (images.length === 0) {
      return res.status(404).json({ error: 'Image not found or access denied' });
    }

    try {
      await fs.unlink(path.join(__dirname, '..', images[0].image));
    } catch (err) {
      console.error(`Error deleting image ${images[0].image}:`, err);
    }

    await db.execute('DELETE FROM room_images WHERE id = ?', [req.params.id]);

    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

module.exports = router;