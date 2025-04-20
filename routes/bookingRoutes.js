const express = require("express");
const {
    createBooking,
    createRazorpayOrder,
    verifyPayment,
    getUserBookings
} = require("../controllers/bookingController.js");
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/", authenticateToken, createBooking);
router.get("/my-bookings", authenticateToken, getUserBookings);
router.post("/create-razorpay-order", authenticateToken, createRazorpayOrder);
router.post("/verify-payment", authenticateToken, verifyPayment);

module.exports = router;
