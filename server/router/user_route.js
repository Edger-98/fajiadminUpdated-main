const express = require("express");

const router = express.Router();

const userController = require("../controllers/user_controller");

router.route("/add-user").post(userController.addUser);
router.route("/getUserById").get(userController.getPurchasedUser);
router.route("/").get(userController.getAllUsers);

// router.route("/getTickets").get( userController.calculateTicketsPurchased);
router.route("/:id").get(userController.getUserById);
router.route("/:id").put(userController.updateUser);
router.route("/:id").delete(userController.deleteUser);

router.route("/:id/status").get(userController.updatedUserStatusAndRole);

module.exports = router;
