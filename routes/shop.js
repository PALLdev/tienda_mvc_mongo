const express = require("express");
const shopsController = require("../controllers/shops");

const expRouter = express.Router();

expRouter.get("/cart", shopsController.getCartPage);

expRouter.post("/cart", shopsController.postAddToCart);

expRouter.post("/cart-delete-item", shopsController.postDeleteCartItem);

expRouter.get("/orders", shopsController.getOrdersPage);

expRouter.post("/add-order", shopsController.postAddOrder);

// // expRouter.get("/checkout", shopsController.getCheckoutPage);

expRouter.get("/products", shopsController.getProductsPage);

// // ruta dinamica (page detalle producto)
expRouter.get("/products/:productId", shopsController.getDetailsPage);

expRouter.get("/", shopsController.getHomePage);

module.exports = expRouter;
