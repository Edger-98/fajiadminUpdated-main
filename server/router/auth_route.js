const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth_controller");

router.route("/register").post(authController.signUp);
router.route("/login").post(authController.signIn);
router.route("/users/:id").get(authController.getUserById);
router.route("/logout").post(authController.logOut);
router.route("/forget-password").post(authController.forgetPassword);
router.route("/reset-password/:token").post(authController.resetPassword);
router.route("/change-password").post(authController.changePassword);

module.exports = router;
