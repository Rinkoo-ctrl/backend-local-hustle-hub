const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, reviewController.createReview);
router.get("/:serviceId", reviewController.getReviewsByService);

module.exports = router;
