import { query } from '../config/db.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

export const listUsers = async (req, res) => {
  try {
    // Only admin can list all users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const [users] = await query(
      `SELECT u.id, u.name, u.email, u.mobile, u.role, u.nic, u.created_at, s.name as status_name
       FROM users u
       LEFT JOIN statuses s ON u.status_id = s.id
       ORDER BY u.created_at DESC`
    );

    res.json({ users });
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.params.id;
    const { name, email, mobile, nic, password } = req.body;

    // Check permission: admin can update any user, users can update themselves
    if (req.user.role !== 'admin' && req.user.id != userId) {
      return res.status(403).json({ message: 'Forbidden: Can only update own profile' });
    }

    // Check if user exists
    const [users] = await query('SELECT id FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    let updateSql = 'UPDATE users SET name = ?, email = ?, mobile = ?, nic = ?, updated_at = CURRENT_TIMESTAMP';
    let params = [name, email, mobile, nic];

    // Include password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateSql += ', password = ?';
      params.push(hashedPassword);
    }

    updateSql += ' WHERE id = ?';
    params.push(userId);

    await query(updateSql, params);

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    // Only admin can update user status
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    const userId = req.params.id;
    const { status_id } = req.body;

    // Check if user exists
    const [users] = await query('SELECT id FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    await query('UPDATE users SET status_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status_id, userId]);

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};