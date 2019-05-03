const express = require("express");
const router = express.Router();
const staticController = require("../controllers/staticController");
const userController = require("../controllers/userController");
const validation = require("./validation");



router.get("/users/signup", userController.signUp);
router.post("/users", validation.validateUsers, userController.create);
router.get("/users/signin", userController.signInForm);
router.post("/users/signin", validation.validateUsers, userController.signIn);
router.get("/users/signout", userController.signOut);
router.get("/users/upgradeAccount", userController.upgradeAccount);
router.post("/users/charge", userController.charge);


module.exports = router;
