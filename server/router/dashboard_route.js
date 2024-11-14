const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboard_controller");
router.route("/lastWeekEvents").get(dashboardController.getLastWeekData);
router.route("/registeredUsers").get(dashboardController.getCurrentYearUsers);
module.exports = router;