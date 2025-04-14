const express = require("express");
const {
    createBooking,
    createRazorpayOrder,
    verifyPayment
} = require("../controllers/bookingController");
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/", authenticateToken, createBooking);
// router.patch("/:id/status", authenticateToken, updateBookingStatus);
router.post("/create-razorpay-order", authenticateToken, createRazorpayOrder);
router.post("/verify-payment", authenticateToken, verifyPayment);

module.exports = router;
