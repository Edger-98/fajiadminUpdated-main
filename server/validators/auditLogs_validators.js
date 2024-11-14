const Joi = require("joi");

const logsValidationSchema = Joi.object({
  ID: Joi.number().required(),
  timeStamp: Joi.date().required(),
  userId: Joi.number().required(),
  userName: Joi.string().required(),
  changes: Joi.object()
    .pattern(
      Joi.string(),
      Joi.object({ old: Joi.any().required(), new: Joi.any().required() })
    )
    .required(),
});

module.exports = logsValidationSchema;
