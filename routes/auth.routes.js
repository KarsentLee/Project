const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");

// call controllers appropriately
router.get("/signup", authController.getSignup);
router.get("/login", authController.getLogin);
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

module.exports = router;
