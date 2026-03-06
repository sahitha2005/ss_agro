const express = require('express');
const router = express.Router();

const vegetableController = require('../controllers/vegetableController');

/* ============================
   ROUTES
============================ */

// Get all vegetables
router.get('/', vegetableController.getAllVegetables);

// Get vegetable details by vegetable_id
router.get('/vegetable-details/:id', vegetableController.getVegetableDetails);

module.exports = router;