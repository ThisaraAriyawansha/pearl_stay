const bcrypt = require('bcrypt');
const db = require('../config/database');

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.execute(`
      SELECT u.id, u.name, u.email, u.mobile, u.role, u.nic, u.status_id, 
             s.name as status_name, u.created_at
      FROM users u
      LEFT JOIN statuses s ON u.status_id = s.id
      ORDER BY u.created_at DESC
    `);

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status_id } = req.body;

    await db.execute(
      'UPDATE users SET status_id = ? WHERE id = ?',
      [status_id, id]
    );

    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, email, mobile, nic, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // If password change is requested, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to change password' });
      }

      const [users] = await db.execute(
        'SELECT password FROM users WHERE id = ?',
        [userId]
      );

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, users[0].password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      await db.execute(
        'UPDATE users SET name = ?, email = ?, mobile = ?, nic = ?, password = ? WHERE id = ?',
        [name, email, mobile, nic, hashedPassword, userId]
      );
    } else {
      await db.execute(
        'UPDATE users SET name = ?, email = ?, mobile = ?, nic = ? WHERE id = ?',
        [name, email, mobile, nic, userId]
      );
    }

    // Get updated user details
    const [updatedUsers] = await db.execute(
      'SELECT id, name, email, mobile, role, nic, status_id FROM users WHERE id = ?',
      [userId]
    );

    res.json({
      message: 'Profile updated successfully',
      user: updatedUsers[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting admin users
    const [users] = await db.execute(
      'SELECT role FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (users[0].role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin users' });
    }

    await db.execute('DELETE FROM users WHERE id = ?', [id]);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  getAllUsers,
  updateUserStatus,
  updateProfile,
  deleteUser
};