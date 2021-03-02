const express = require("express");
const shopsController = require("../controllers/shops");
const isAuth = require("../middleware/is-auth");

const expRouter = express.Router();

expRouter.get("/cart", isAuth, shopsController.getCartPage);

expRouter.post("/cart", isAuth, shopsController.postAddToCart);

expRouter.post("/cart-delete-item", isAuth, shopsController.postDeleteCartItem);

expRouter.get("/orders", isAuth, shopsController.getOrdersPage);

expRouter.post("/add-order", isAuth, shopsController.postAddOrder);

// // expRouter.get("/checkout", shopsController.getCheckoutPage);

expRouter.get("/products", shopsController.getProductsPage);

// // ruta dinamica (page detalle producto)
expRouter.get("/products/:productId", shopsController.getDetailsPage);

expRouter.get("/", shopsController.getHomePage);

module.exports = expRouter;
