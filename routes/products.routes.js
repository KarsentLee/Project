const express = require("express");
const router = express.Router();

// call controllers appropriately
router.get("/products", function (req, res) {
  res.render("customer/products/all-products");
});

module.exports = router;
