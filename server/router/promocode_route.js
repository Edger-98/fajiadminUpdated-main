const express = require("express");

const router = express.Router();

const promocodeController = require("../controllers/promocodes_controller");

const validatePromocode = require("../validators/promocode_validators");
router
  .route("/")
  .get(promocodeController.getAllPromocodes)
  .post(validatePromocode, promocodeController.createPromocodes);

router.route("/:id").get(promocodeController.getSinglePromocode);

router.route("/:id").put(validatePromocode,promocodeController.updatedPromocode);

router.route("/:id").delete(promocodeController.deletePromocode);

module.exports = router;
