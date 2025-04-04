const pool = require('../Db');
const jwt = require('jsonwebtoken');




// Step 1: Send OTP
const sendOtp = async (req, res) => {
  const { phone, email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    if (!phone && !email) {
      return res.status(400).json({ error: 'Phone or Email is required' });
    }

    await pool.query(
      'INSERT INTO otps (phone, email, otp_code) VALUES ($1, $2, $3)',
      [phone || null, email || null, otp]
    );

    // Mock send (use SMS/email API later)
    console.log(`OTP sent to ${phone || email}: ${otp}`);

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP Error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Step 2: Verify OTP

const verifyOtp = async (req, res) => {
  const { phone, email, otp_code } = req.body;

  try {
    const result = await pool.query(
      `SELECT * FROM otps
         WHERE otp_code = $1 AND (phone = $2 OR email = $3)
         ORDER BY created_at DESC LIMIT 1`,
      [otp_code, phone || null, email || null]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    await pool.query('DELETE FROM otps WHERE phone = $1 OR email = $2', [phone || null, email || null]);
    // Delete all OTPs for this user
    await pool.query('DELETE FROM otps WHERE phone = $1 OR email = $2', [phone || null, email || null]);

    // ✅ FETCH or CREATE USER
    let user;

    if (phone) {
      const userQuery = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
      user = userQuery.rows[0];
    } else if (email) {
      const userQuery = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      user = userQuery.rows[0];
    }

    if (!user) {
      const insertQuery = phone
        ? await pool.query(
          'INSERT INTO users (phone, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
          [phone, 'New User', email || `${phone}@otp.com`, 'OTP_AUTH']
        )
        : await pool.query(
          'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING *',
          [email, 'New User', 'OTP_AUTH']
        );
      user = insertQuery.rows[0];
    }

    const token = jwt.sign(
      {
        userId: user.user_id,
        isAdmin: user.is_admin || false
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ message: 'Login successful', token, user });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
};


module.exports = { sendOtp, verifyOtp };

