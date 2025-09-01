const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllRooms,
  getRoomById,
  getHotelRooms,
  createRoom,
  updateRoom,
  updateRoomStatus,
  deleteRoom,
  deleteRoomImage
} = require('../controllers/roomController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Configure multer for room images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'room-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

router.get('/', getAllRooms);
router.get('/:id', getRoomById);
router.get('/hotel/:hotelId', getHotelRooms);
router.post('/', authenticateToken, authorizeRoles('owner', 'admin'), upload.array('images', 5), createRoom);
router.put('/:id', authenticateToken, authorizeRoles('owner', 'admin'), upload.array('images', 5), updateRoom);
router.put('/:id/status', authenticateToken, authorizeRoles('admin'), updateRoomStatus);
router.delete('/:id', authenticateToken, authorizeRoles('owner', 'admin'), deleteRoom);
router.delete('/:roomId/images/:imageId', authenticateToken, authorizeRoles('owner', 'admin'), deleteRoomImage);

module.exports = router;