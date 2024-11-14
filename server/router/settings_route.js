const express = require("express");

const router = express.Router();

const settingsController = require("../controllers/setting_controller");

router.route("/").post( settingsController. createSettings);

module.exports = router;