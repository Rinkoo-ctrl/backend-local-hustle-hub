const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true,
    },
    freelancerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Freelancer",
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
