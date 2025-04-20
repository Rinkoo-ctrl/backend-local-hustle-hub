const Razorpay = require("razorpay");
const crypto = require("crypto");
const Booking = require("../models/Booking");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
});

exports.createBooking = async (req, res) => {
    try {
        const { freelancerId, serviceId, date, amount } = req.body;

        const booking = await Booking.create({
            userId: req.user.id,
            freelancerId,
            serviceId,
            date,
            amount,
            status: "pending",
            paymentStatus: "pending"
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: "Error creating booking", details: error });
    }
};

exports.createRazorpayOrder = async (req, res) => {
    try {
        const { bookingId, amount } = req.body;

        // Expect amount in rupees; convert to paise
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_order_${bookingId}`,
            notes: {
                bookingId
            }
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        res.status(500).json({ error: "Razorpay order creation failed", details: error });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
        console.log(req.body, "last of payment---------->");
        const sign = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");
        console.log(sign, "sign", razorpay_signature, "razorpay_signature");
        if (sign === razorpay_signature) {
            await Booking.findByIdAndUpdate(bookingId, {
                paymentStatus: "paid",
                status: "active",
                paymentId: razorpay_payment_id
            },
                { runValidators: true });
            res.json({ success: true });  // Fixed: return success true
        } else {
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        res.status(500).json({ error: "Payment verification failed", details: error });
    }
};

exports.getUserBookings = async (req, res) => {
    try {
        const userId = req.user.id;

        const bookings = await Booking.find({ userId })
            .populate("serviceId")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};

exports.getActiveBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            freelancerId: req.user.id,
            status: "active",
        }).populate("customerId serviceId");
        res.json({ bookings });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};