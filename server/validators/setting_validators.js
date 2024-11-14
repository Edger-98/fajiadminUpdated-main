const Joi = require('joi');

const settingValidationSchema = Joi.object({
    title: Joi.string().required(),
    short_desc: Joi.string().required(),
    phone_num: Joi.string().required(),
    email: Joi.string().email().required(),
    currency: Joi.string().required()
});

module.exports = settingValidationSchema;