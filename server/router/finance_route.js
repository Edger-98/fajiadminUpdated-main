const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/finance_controller");
router.route("/revenue").get(dashboardController.lastMonthRevenue);
router.route("/totalRevenue").get(dashboardController.totalRevenue);
router.route("/profit").get(dashboardController.profitEarned);
router.route("/hostPayment").get(dashboardController.totalHostPayment);
router.route("/lastMonthPayout").get(dashboardController.lastMonthHostpayout);
module.exports = router;