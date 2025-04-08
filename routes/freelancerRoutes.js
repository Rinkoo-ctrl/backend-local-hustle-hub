const express = require('express');
const router = express.Router();
const freelancerController = require('../controllers/freelancerController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, freelancerController.createOrUpdateFreelancer);
router.get('/:id', freelancerController.getFreelancerById);

module.exports = router;
