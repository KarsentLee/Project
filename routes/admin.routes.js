const express = require("express");
const adminController = require("../controllers/admin.controller");

const router = express.Router();

router.get("/admin/products", adminController.getProducts);

router.get("/admin/products/new", adminController.getNewProduct);

module.exports = router;
