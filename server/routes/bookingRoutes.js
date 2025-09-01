const express = require('express');
const {
  createBooking,
  getUserBookings,
  getHotelBookings,
  getAllBookings,
  updateBookingStatus,
  calculatePrice
} = require('../controllers/bookingController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, createBooking);
router.get('/me', authenticateToken, getUserBookings);
router.get('/hotel/:hotelId', authenticateToken, authorizeRoles('owner', 'admin'), getHotelBookings);
router.get('/all', authenticateToken, authorizeRoles('admin'), getAllBookings);
router.put('/:id/status', authenticateToken, authorizeRoles('owner', 'admin'), updateBookingStatus);
router.get('/calculate-price', calculatePrice);

module.exports = router;