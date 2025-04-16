const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const authenticateToken = require('../middleware/authMiddleware');

router.post("/", authenticateToken, reviewController.createReview);
router.get("/:serviceId", authenticateToken, reviewController.getReviewsByService);

module.exports = router;
