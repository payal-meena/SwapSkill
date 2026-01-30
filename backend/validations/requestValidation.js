const Joi = require("joi");

exports.sendRequestSchema = Joi.object({
  receiver: Joi.string().required().messages({
    "string.empty": "Receiver user id is required",
  }),

  offeredSkill: Joi.object({
    name: Joi.string(),
    level: Joi.string()
      .valid("Beginner", "Intermediate", "Advanced")
      ,
  }),

  requestedSkill: Joi.object({
    name: Joi.string(),
    level: Joi.string()
      .valid("Beginner", "Intermediate", "Advanced")
      ,
  }),
});
