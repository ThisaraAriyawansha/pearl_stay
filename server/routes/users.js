const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pearlstay',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get user details by ID (no auth)
router.get('/me/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const [users] = await pool.query(
      'SELECT id, name, email, mobile, nic FROM users WHERE id = ?',
      [userId]
    );
    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Update user details by ID (no auth)
router.put('/me/:id', async (req, res) => {
  const userId = req.params.id;
  const { name, email, mobile, nic, password } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const [existingUsers] = await pool.query(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, userId]
    );
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const queryParams = [name, email, mobile || null, nic || null];
    let updateQuery;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      queryParams.push(hashedPassword);
      queryParams.push(userId);
      updateQuery =
        'UPDATE users SET name = ?, email = ?, mobile = ?, nic = ?, password = ? WHERE id = ?';
    } else {
      queryParams.push(userId);
      updateQuery =
        'UPDATE users SET name = ?, email = ?, mobile = ?, nic = ? WHERE id = ?';
    }

    await pool.query(updateQuery, queryParams);

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

module.exports = router;
