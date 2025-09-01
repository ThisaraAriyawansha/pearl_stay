const express = require('express');
const { getAllUsers, updateUserStatus, updateProfile, deleteUser } = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.put('/:id/status', authenticateToken, authorizeRoles('admin'), updateUserStatus);
router.put('/profile', authenticateToken, updateProfile);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

module.exports = router;