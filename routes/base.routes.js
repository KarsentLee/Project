const express = require("express");
const router = express.Router();

// call controllers appropriately
router.get("/", function (req, res) {
  res.redirect("/products");
});

module.exports = router;
