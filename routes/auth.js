const express = require("express");
const authController = require("../controllers/auths");

const router = express.Router();

router.get("/login", authController.getLoginPage);

router.post("/login-user", authController.postLogin);

module.exports = router;
