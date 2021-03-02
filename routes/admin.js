const express = require("express");

const expRouter = express.Router();

const adminsController = require("../controllers/admins");
const isAuth = require("../middleware/is-auth");

expRouter.get("/products", isAuth, adminsController.getAdminProductsPage);

expRouter.get("/add-product", isAuth, adminsController.getAddProductPage);

expRouter.post("/add-product", isAuth, adminsController.postAddProduct);

expRouter.get(
  "/edit-product/:productId",
  isAuth,
  adminsController.getEditProductPage
);

expRouter.post("/edit-product", isAuth, adminsController.postEditProduct);

expRouter.post("/delete-product", isAuth, adminsController.postDeleteProduct);

module.exports = expRouter;
