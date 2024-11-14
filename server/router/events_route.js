const express = require("express");
const router = express.Router();
const upload = require("../uploads");
const eventsController = require("../controllers/events_controller");

router.route("/").get(eventsController.getEvents);

router.route("/total-seats").get(eventsController.totalSeats);
router.route("/totalEvents").get(eventsController.fetchTotalEvents);

router.route("/:id").get(eventsController.getEventById);

router.route("/").post(upload.array("image", 10), eventsController.createEvent);

router.route("/:id/status").put(eventsController.updatedEventStatus);

router.route("/update-event/:id").put(eventsController.updateEvent);

router.route("/:id").delete(eventsController.deleteEvent);

router.route("/?status").get(eventsController.eventsStatus);

module.exports = router;
