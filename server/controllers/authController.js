// server/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
require('dotenv').config(); // Load environment variables

// Helper to generate JWT token
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign({ userId }, secret, { expiresIn });
};

// Register new user
const register = async (req, res) => {
  try {
    const { name, email, password, mobile, role = 'customer', nic } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, mobile, role, nic, status_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, hashedPassword, mobile, role, nic, 1]
    );

    const userId = result.insertId;
    const token = generateToken(userId);

    // Get user details without password
    const [users] = await db.execute(
      'SELECT id, name, email, mobile, role, nic, status_id FROM users WHERE id = ?',
      [userId]
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: users[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [users] = await db.execute(
      'SELECT id, name, email, password, mobile, role, nic, status_id FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    if (user.status_id !== 1) {
      return res.status(401).json({ error: 'Account is not active' });
    }

    // Handle $2y$ hashes from PHP
    const hash = user.password.replace(/^\$2y/, '$2a');

    const isPasswordValid = await bcrypt.compare(password, hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    delete user.password;

    res.json({
      message: 'Login successful',
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get logged-in user profile
const getProfile = async (req, res) => {
  try {
    const [users] = await db.execute(
      'SELECT id, name, email, mobile, role, nic, status_id FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

module.exports = {
  register,
  login,
  getProfile
};
