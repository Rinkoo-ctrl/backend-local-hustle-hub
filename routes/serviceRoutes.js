const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController.js');

router.post('/', serviceController.createService);
router.get('/', serviceController.getAllServices);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);

module.exports = router;
