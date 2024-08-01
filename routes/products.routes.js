const express = require("express");
const router = express.Router();

// call controllers appropriately
router.get("/products", function (req, res) {
  console.log("products routes called");
  res.render("customer/products/all-products");
});

module.exports = router;
