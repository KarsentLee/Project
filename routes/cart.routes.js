const cartController = require("../controllers/cart.controller");
const express = require("express");

const router = express.Router();

router.get("/", cartController.getCart);

router.post("/items", cartController.addCartItem);

router.patch("/items", cartController.updateCartItem);

module.exports = router;
