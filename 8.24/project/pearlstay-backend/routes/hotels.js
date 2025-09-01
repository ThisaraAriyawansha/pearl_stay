import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { createHotel, listHotels, getHotel, updateHotel, deleteHotel } from '../controllers/hotelsController.js';

const router = express.Router();

// Create hotel (owner, admin)
router.post('/', 
  authenticateToken, 
  authorizeRoles('owner', 'admin'),
  upload.fields([{ name: 'logo' }, { name: 'cover_image' }]),
  [
    body('name').notEmpty().withMessage('Hotel name is required'),
    body('location').notEmpty().withMessage('Location is required')
  ],
  createHotel
);

// List hotels (public)
router.get('/', listHotels);

// Get single hotel (public)
router.get('/:id', getHotel);

// Update hotel
router.put('/:id', 
  authenticateToken,
  [
    body('name').notEmpty().withMessage('Hotel name is required'),
    body('location').notEmpty().withMessage('Location is required')
  ],
  updateHotel
);

// Delete hotel
router.delete('/:id', 
  authenticateToken, 
  authorizeRoles('owner', 'admin'), 
  deleteHotel
);

export default router;