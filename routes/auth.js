const express = require("express");
const authController = require("../controllers/auths");

const router = express.Router();

router.post("/login-user", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getRegistroPage);

router.post("/signup", authController.postRegistro);

module.exports = router;
