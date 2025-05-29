const express = require("express");
const router = express.Router();

const productsController = require("../controllers/products.controller");

// call controllers appropriately
router.get("/products", productsController.getAllProducts);

router.get("/products/:id", productsController.getProductDetails);

module.exports = router;
