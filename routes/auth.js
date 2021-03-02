const express = require("express");
const authController = require("../controllers/auths");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.post("/login-user", authController.postLogin);

router.post("/logout", isAuth, authController.postLogout);

router.get("/signup", authController.getRegistroPage);

router.post("/signup", authController.postRegistro);

module.exports = router;
