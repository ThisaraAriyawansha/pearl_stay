import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { createBooking, listBookings, getBooking, updateBookingStatus } from '../controllers/bookingsController.js';

const router = express.Router();

// Create booking (authenticated users)
router.post('/', 
  authenticateToken,
  [
    body('room_id').isInt().withMessage('Valid room ID is required'),
    body('check_in').isDate().withMessage('Valid check-in date is required'),
    body('check_out').isDate().withMessage('Valid check-out date is required'),
    body('room_count').isInt({ min: 1 }).withMessage('Room count must be at least 1'),
    body('adult_count').isInt({ min: 1 }).withMessage('Adult count must be at least 1')
  ],
  createBooking
);

// List bookings (role-based access)
router.get('/', authenticateToken, listBookings);

// Get single booking
router.get('/:id', authenticateToken, getBooking);

// Update booking status (owner can confirm/reject, customer can cancel, admin can do all)
router.patch('/:id/status', 
  authenticateToken,
  [
    body('booking_status').isIn(['pending', 'confirmed', 'cancelled']).withMessage('Invalid booking status')
  ],
  updateBookingStatus
);

export default router;