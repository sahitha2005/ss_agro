const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST request to /api/orders
router.post('/', orderController.placeOrder);

module.exports = router;
