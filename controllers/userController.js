const pool = require('../Db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



// GET /api/users/profile
const getProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT user_id, name, email, phone, address, second_address, city, state, pincode
       FROM users
       WHERE user_id = $1`,
      [userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get Profile Error:', err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

// PUT /api/users/profile
const updateProfile = async (req, res) => {
  const userId = req.user.userId;
  const {
    name,
    email,
    phone,
    address,
    second_address,
    city,
    state,
    pincode
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2, phone = $3, address = $4,
           second_address = $5, city = $6, state = $7, pincode = $8
       WHERE user_id = $9
       RETURNING user_id, name, email, phone, address, second_address, city, state, pincode`,
      [name, email, phone, address, second_address, city, state, pincode, userId]
    );

    res.json({ message: 'Profile updated', user: result.rows[0] });
  } catch (err) {
    console.error('Update Profile Error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};





module.exports = { getProfile, updateProfile };
