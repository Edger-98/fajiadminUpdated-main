const Joi = require('joi');

// Validation schema
const authValidationSchema = Joi.object({
  userId: Joi.string().trim().min(3).max(255).required(),
  username: Joi.string().trim().min(3).max(255).required(),
  
  email: Joi.string().trim().min(3).max(255).required(),
  phoneNo: Joi.string().trim().min(10).max(20).required(),
  password: Joi.string().trim().min(7).max(1024).required(),
  role: Joi.string().valid('admin', 'attendee', 'organizer').required(),
  pushNotificationsEnabled: Joi.boolean().optional(),
  
});
module.exports = authValidationSchema;