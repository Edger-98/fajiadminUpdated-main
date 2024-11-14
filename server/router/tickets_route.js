const express = require("express");

const router = express.Router();

const ticketsController = require("../controllers/tickets_controller");

router.route("/").get(ticketsController.getAllTickets);
router.route("/totalTicketsSold/:eventId").get(ticketsController.getTotalTicketsSold);
router.route("/usersByEvent/:eventId").get(ticketsController.getUsersByEventId);
router.route("/:id").get(ticketsController.getTicketById);
router.route("/").post(ticketsController.createTicket);

router.route("/filterTicket").get(ticketsController.filterTickets);
module.exports = router;
