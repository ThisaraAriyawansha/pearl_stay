import express from 'express';
import { 
  createRoom, 
  getRoomsByHotel, 
  checkAvailability 
} from '../controllers/roomController.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('owner'), createRoom);
router.get('/hotel/:hotelId', getRoomsByHotel);
router.post('/availability', checkAvailability);

export default router;