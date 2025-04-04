// const express = require("express");
// const Razorpay = require("razorpay");
// require("dotenv").config();

// const router = express.Router();

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// router.post("/create-order", async (req, res) => {
//   const { amount } = req.body;

//   try {
//     const options = {
//       amount: amount * 100, // Amount in paisa
//       currency: "INR",
//       receipt: `order_rcptid_${Math.floor(Math.random() * 10000)}`,
//     };

//     const order = await razorpay.orders.create(options);

//     res.status(200).json({
//       success: true,
//       order_id: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       key: process.env.RAZORPAY_KEY_ID,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// module.exports = router;
