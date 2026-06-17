const joi = require("joi");

const signupValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().max(100).min(4).required(),
    email: joi.string().email().required(),
    password: joi.string().max(100).min(4).required(),
    role: joi.string().valid("client", "freelancer").required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "bad json file", error });
  }
  next();
};
const loginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().max(100).min(4).required(),
  });
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: "bad json file", error });
  }
  next();
};

module.exports = {
  signupValidation,
  loginValidation,
};
