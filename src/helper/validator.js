const Joi = require("joi");

const validateUserSchema = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(25).required(),
    password: Joi.string().min(3).required(),
    isAdmin: Joi.bool().required()
  });
  return schema.validate(user);
};

const validateLoginSchema = (user) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(25).required(),
    password: Joi.string().min(3).required(),
  })
  return schema.validate(user);
}

module.exports = { validateUserSchema, validateLoginSchema };