const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp } = require('../controllers/otpController');
const verifyToken = require('../middlewares/authMiddleware');

// router.post('/', verifyToken, placeOrder);
// router.get('/:userId', verifyToken, getUserOrders);

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;