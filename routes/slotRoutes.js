const express = require('express');
const router = express.Router();
const pool = require('../Db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cust_slot_details ORDER BY slot_id');
    res.json(result.rows);
  } catch (err) {
    console.error("Slot fetch error:", err);
    res.status(500).json({ error: 'Failed to fetch delivery slots' });
  }
});

module.exports = router;
