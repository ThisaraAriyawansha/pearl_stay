import express from 'express';
import { 
  createBooking, 
  getMyBookings, 
  getHotelBookings,
  updateBookingStatus,
  calculatePrice 
} from '../controllers/bookingController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('customer'), createBooking);
router.get('/my', authenticateToken, authorizeRoles('customer'), getMyBookings);
router.get('/hotel', authenticateToken, authorizeRoles('owner'), getHotelBookings);
router.put('/:id/status', authenticateToken, authorizeRoles('owner', 'admin'), updateBookingStatus);
router.post('/calculate-price', calculatePrice);

export default router;