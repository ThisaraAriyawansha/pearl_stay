const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getAllHotels,
  getHotelById,
  getOwnerHotels,
  createHotel,
  updateHotel,
  updateHotelStatus,
  deleteHotel
} = require('../controllers/hotelController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
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

router.get('/', getAllHotels);
router.get('/owner', authenticateToken, authorizeRoles('owner'), getOwnerHotels);
router.get('/:id', getHotelById);
router.post('/', authenticateToken, authorizeRoles('owner'), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 }
]), createHotel);
router.put('/:id', authenticateToken, authorizeRoles('owner', 'admin'), upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'cover_image', maxCount: 1 }
]), updateHotel);
router.put('/:id/status', authenticateToken, authorizeRoles('admin'), updateHotelStatus);
router.delete('/:id', authenticateToken, authorizeRoles('owner', 'admin'), deleteHotel);

module.exports = router;