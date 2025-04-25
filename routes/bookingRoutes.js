const express = require("express");
const {
    createBooking,
    createRazorpayOrder,
    verifyPayment,
    getUserBookings,
    getActiveBookings,
    getCompletedBookings,
    markOrderComplete
} = require("../controllers/bookingController.js");
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/", authenticateToken, createBooking);
router.get("/my-bookings", authenticateToken, getUserBookings);
router.get("/my-completed", authenticateToken, getCompletedBookings);
router.post("/create-razorpay-order", authenticateToken, createRazorpayOrder);
router.post("/verify-payment", authenticateToken, verifyPayment);
router.get("/freelancer-active", authenticateToken, getActiveBookings);
router.patch("/mark-complete/:id", authenticateToken, markOrderComplete);

module.exports = router;
