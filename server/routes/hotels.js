import express from 'express';
import { 
  createHotel, 
  getHotels, 
  getHotelById, 
  updateHotelStatus,
  getMyHotels 
} from '../controllers/hotelController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('owner'), createHotel);
router.get('/', getHotels);
router.get('/my', authenticateToken, authorizeRoles('owner'), getMyHotels);
router.get('/:id', getHotelById);
router.put('/:id/status', authenticateToken, authorizeRoles('admin'), updateHotelStatus);

export default router;