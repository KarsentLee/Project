const cartController = require("../controllers/cart.controller");
const express = require("express");

const router = express.Router();

router.post("/items", cartController.addCartItem);

module.exports = router;
