const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController.js');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/', authenticateToken, serviceController.createService);
router.get('/', serviceController.getAllServices);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
