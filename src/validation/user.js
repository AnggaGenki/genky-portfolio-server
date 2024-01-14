import Joi from "joi";
import validationUnit from "./validation-unit.js";

const register = Joi.object({
  username: Joi.string()
    .regex(new RegExp(validationUnit.regex.username))
    .custom(validationUnit.InvalidSeparator)
    .required(),
  password: Joi.string().min(5).max(100).required(),
  password_confirm: Joi.ref("password"),
});

export default { register };
