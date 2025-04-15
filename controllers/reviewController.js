const Review = require("../models/Review");

exports.createReview = async (req, res) => {
    try {
        const { serviceId, freelancerId, rating, comment } = req.body;
        const userId = req.user.id;

        const newReview = new Review({
            serviceId,
            freelancerId,
            userId,
            rating,
            comment,
        });

        await newReview.save();

        res.status(201).json({ success: true, review: newReview });
    } catch (error) {
        res.status(500).json({ success: false, error: "Review create failed" });
    }
};

exports.getReviewsByService = async (req, res) => {
    try {
        const { serviceId } = req.params;

        const reviews = await Review.find({ serviceId })
            .populate("userId", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch reviews" });
    }
};
