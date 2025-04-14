const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: "Freelancer", required: true },
    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected", "completed"], default: "pending" },
    paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
    amount: Number,
    paymentId: String 
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
