const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders } = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/my-orders', verifyToken, getUserOrders);

router.post('/', placeOrder);           // Place order
router.get('/:userId', getUserOrders);  // Get all orders by user

module.exports = router;
