const express = require("express");

const expRouter = express.Router();

const adminsController = require("../controllers/admins");

expRouter.get("/products", adminsController.getAdminProductsPage);

expRouter.get("/add-product", adminsController.getAddProductPage);

expRouter.post("/add-product", adminsController.postAddProduct);

expRouter.get("/edit-product/:productId", adminsController.getEditProductPage);

expRouter.post("/edit-product", adminsController.postEditProduct);

expRouter.post("/delete-product", adminsController.postDeleteProduct);

module.exports = expRouter;
