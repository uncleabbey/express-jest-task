const {
  validateUserSchema,
  validateLoginSchema,
} = require("../helper/validator");

const validateInput = (req, res, next) => {
  const error = validateUserSchema(req.body);
  if (error.error) {
    return next({
      status: 400,
      error: error.error.details[0].message,
    });
  }
  return next();
};
const validateLoginInput = (req, res, next) => {
  const error = validateLoginSchema(req.body);
  if (error.error) {
    return next({
      status: 400,
      error: error.error.details[0].message,
    });
  }
  return next();
};

module.exports = { validateInput, validateLoginInput };
