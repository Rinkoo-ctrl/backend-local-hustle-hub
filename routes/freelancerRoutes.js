const express = require('express');
const router = express.Router();
const freelancerController = require('../controllers/freelancerController');

router.post('/', freelancerController.createOrUpdateFreelancer);
router.get('/:id', freelancerController.getFreelancerById);

module.exports = router;
