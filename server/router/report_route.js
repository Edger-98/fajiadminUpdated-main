const express = require('express');
const router = express.Router();
const reportsController = require("../controllers/reports_controller");

router.route('/').post(reportsController.createReport);

router.route('/').get(reportsController.getReports);
router.route("/:id/action").put(reportsController.updatedReportActions);

router.route('/:id/spam').put(reportsController.spamEvent);

router.route('/:id/decline').put(reportsController.declineEvent);

router.route('/:id/request-info').put(reportsController.requestInfo);
module.exports = router;