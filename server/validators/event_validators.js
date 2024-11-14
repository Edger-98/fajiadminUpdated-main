const Joi = require('joi');

const eventValidationSchema = Joi.object({
  eventTitle: Joi.string().min(3).max(100).required(),
  date: Joi.date().required(),
  time: Joi.string().pattern(/^\d{2}:\d{2}$/).required(), // Validates time in HH:MM format
  seats: Joi.number().integer().min(1).required(),
  location: Joi.string().min(3).max(100).required(),
  description: Joi.string().required(),
  price: Joi.string().min(0).required(),
  status: Joi.string().valid('pending', 'approved', 'declined').optional(),
  imageUrl: Joi.string().uri().optional()
});

module.exports = eventValidationSchema;