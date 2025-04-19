const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController.js');
const authenticateToken = require('../middleware/authMiddleware.js');

router.post('/', authenticateToken, customerController.createOrUpdateCustomer);
router.get('/:id', authenticateToken, customerController.getCustomerById);

module.exports = router;
