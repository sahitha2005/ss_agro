const express = require('express');
const router = express.Router();
const vegController = require('../controllers/vegController');

router.get('/', vegController.getAllVegetables);
router.get('/:id', vegController.getVegetableById);

// NEW: Route for fetching fertilizer data
router.get('/:id/fertilizer', vegController.getFertilizerByVegId);

module.exports = router;
