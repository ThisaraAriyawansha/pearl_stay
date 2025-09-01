import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createRoom, listRooms, getRoom, updateRoom, deleteRoom } from '../controllers/roomsController.js';

const router = express.Router();

// Create room (owner, admin)
router.post('/', 
  authenticateToken, 
  authorizeRoles('owner', 'admin'),
  upload.array('images', 5),
  [
    body('hotel_id').isInt().withMessage('Valid hotel ID is required'),
    body('name').notEmpty().withMessage('Room name is required'),
    body('price_per_night').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('total_room').optional().isInt({ min: 1 }).withMessage('Total rooms must be at least 1')
  ],
  createRoom
);

// List rooms (public with filters)
router.get('/', listRooms);

// Get single room (public)
router.get('/:id', getRoom);

// Update room
router.put('/:id', 
  authenticateToken,
  [
    body('name').notEmpty().withMessage('Room name is required'),
    body('price_per_night').isFloat({ min: 0 }).withMessage('Valid price is required')
  ],
  updateRoom
);

// Delete room
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('owner', 'admin'), 
  deleteRoom
);

export default router;