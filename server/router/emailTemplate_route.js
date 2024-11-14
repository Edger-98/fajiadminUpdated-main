const express = require('express');
const router = express.Router();
const emailController = require("../controllers/emailTemplate_controller");

router.route('/').post(emailController.createEmail);
router.route('/').get(emailController.getEmailTemplate);
router.route('/:id').get(emailController.getEmailTemplateById);
router.route('/:id').put(emailController.updateEmailTemplate);
router.route('/:id').delete(emailController.deleteEmailTemplate);
module.exports = router;