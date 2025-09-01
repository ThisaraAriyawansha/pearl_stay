import express from 'express';
import { body } from 'express-validator';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import { listUsers, updateUser, updateUserStatus } from '../controllers/usersController.js';

const router = express.Router();

// List users (admin only)
router.get('/', authenticateToken, authorizeRoles('admin'), listUsers);

// Update user profile
router.put('/:id', 
  authenticateToken,
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  updateUser
);

// Update user status (admin only)
router.patch('/:id/status', 
  authenticateToken, 
  authorizeRoles('admin'),
  [
    body('status_id').isInt({ min: 1, max: 5 }).withMessage('Valid status ID is required')
  ],
  updateUserStatus
);

export default router;