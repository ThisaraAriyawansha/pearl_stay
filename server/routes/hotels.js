const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Images only (jpeg, jpg, png)!'));
    }
  },
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Get all hotels for owner
router.get('/owner', authenticateToken, authorizeRoles('owner'), async (req, res) => {
  try {
    const [hotels] = await db.execute(
      `SELECT h.*, s.name as status_name 
       FROM hotels h 
       JOIN statuses s ON h.status_id = s.id 
       WHERE h.user_id = ? 
       ORDER BY h.created_at DESC`,
      [req.user.id]
    );

    res.json({ hotels });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single hotel
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const [hotels] = await db.execute(
      `SELECT h.*, s.name as status_name, u.name as owner_name 
       FROM hotels h 
       JOIN statuses s ON h.status_id = s.id 
       JOIN users u ON h.user_id = u.id 
       WHERE h.id = ?`,
      [req.params.id]
    );

    if (hotels.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    res.json({ hotel: hotels[0] });
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new hotel with file uploads
router.post(
  '/',
  authenticateToken,
  authorizeRoles('owner'),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, location, description, city } = req.body;
      const files = req.files;

      if (!name || !location || !city) {
        return res.status(400).json({ error: 'Name, location, and city are required' });
      }

      const logo = files.logo ? `/uploads/${files.logo[0].filename}` : null;
      const cover_image = files.cover_image ? `/uploads/${files.cover_image[0].filename}` : null;

      const [result] = await db.execute(
        `INSERT INTO hotels (name, location, description, logo, cover_image, user_id, status_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [name, `${location}, ${city}`, description, logo, cover_image, req.user.id, 1] 
      );

      const [newHotel] = await db.execute(
        `SELECT h.*, s.name as status_name 
         FROM hotels h 
         JOIN statuses s ON h.status_id = s.id 
         WHERE h.id = ?`,
        [result.insertId]
      );

      res.status(201).json({ hotel: newHotel[0], message: 'Hotel created successfully' });
    } catch (error) {
      console.error('Error creating hotel:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Update hotel
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('owner'),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'cover_image', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, location, description, city } = req.body;
      const files = req.files;

      // Check if hotel belongs to user
      const [hotels] = await db.execute(
        'SELECT * FROM hotels WHERE id = ? AND user_id = ?',
        [req.params.id, req.user.id]
      );

      if (hotels.length === 0) {
        return res.status(404).json({ error: 'Hotel not found' });
      }

      const logo = files.logo ? `/uploads/${files.logo[0].filename}` : hotels[0].logo;
      const cover_image = files.cover_image
        ? `/uploads/${files.cover_image[0].filename}`
        : hotels[0].cover_image;

      await db.execute(
        `UPDATE hotels 
         SET name = ?, location = ?, description = ?, logo = ?, cover_image = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE id = ?`,
        [name, `${location}, ${city}`, description, logo, cover_image, req.params.id]
      );

      const [updatedHotel] = await db.execute(
        `SELECT h.*, s.name as status_name 
         FROM hotels h 
         JOIN statuses s ON h.status_id = s.id 
         WHERE h.id = ?`,
        [req.params.id]
      );

      res.json({ hotel: updatedHotel[0], message: 'Hotel updated successfully' });
    } catch (error) {
      console.error('Error updating hotel:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Delete hotel
router.delete('/:id', authenticateToken, authorizeRoles('owner'), async (req, res) => {
  try {
    // Check if hotel belongs to user
    const [hotels] = await db.execute(
      'SELECT * FROM hotels WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (hotels.length === 0) {
      return res.status(404).json({ error: 'Hotel not found' });
    }

    await db.execute('DELETE FROM hotels WHERE id = ?', [req.params.id]);

    res.json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;