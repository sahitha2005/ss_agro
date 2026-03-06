const express = require("express");
const router = express.Router();
const detailsController = require("../controllers/detailsController");

router.get("/:id", detailsController.getVegetableDetails);

module.exports = router;