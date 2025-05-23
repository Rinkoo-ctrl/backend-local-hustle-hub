const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController.js');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, serviceController.createService);
router.get('/', authenticateToken, serviceController.getAllServices);
router.put('/:id', authenticateToken, serviceController.updateService);
router.delete('/:id', authenticateToken, serviceController.deleteService);

module.exports = router;
