const Joi = require('joi');

const ticketValidationSchema = Joi.object({
  ticketId: Joi.number().required(),
  partyName:Joi.string().min(3).max(100).required(),
  userName: Joi.string().min(3).max(100).required(),
  purchasedDate: Joi.date().required(),
  price: Joi.number().min(0).required(),
  promoCode: Joi.string().optional()
});

module.exports = ticketValidationSchema;