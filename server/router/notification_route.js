const express = require("express");

const router = express.Router();

const notificationsController = require("../controllers/notifications_controller");

router.route("/").get( notificationsController.getAllNotifications);
router.route("/").post( notificationsController.addNotification);

router.route("/:id").get( notificationsController.getNotificationById);
router.route("/:id").put( notificationsController.updateNotification);
router.route("/:id").delete( notificationsController.deleteNotification);


module.exports = router;