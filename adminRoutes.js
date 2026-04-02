const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/orders', adminController.getAllOrders);
router.post('/veg', adminController.addVegetable);
router.put('/veg/:id', adminController.updateVegetable);
router.delete('/veg/:id', adminController.deleteVegetable);

// NEW: Routes for Orders and Fertilizers
router.delete('/orders/:id', adminController.deleteOrder);
router.put('/fertilizer/:id', adminController.updateFertilizer);

module.exports = router;
