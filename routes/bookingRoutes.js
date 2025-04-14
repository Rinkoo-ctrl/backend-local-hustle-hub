const express = require("express");
const { createBooking, updateBookingStatus, createPaymentIntent, stripeWebhook } = require("../controllers/bookingController");
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/", authenticateToken, createBooking);
router.patch("/:id/status", authenticateToken, updateBookingStatus);
router.post("/create-payment-intent", authenticateToken, createPaymentIntent);
router.post("/webhook", express.raw({ type: 'application/json' }), stripeWebhook);

module.exports = router;
