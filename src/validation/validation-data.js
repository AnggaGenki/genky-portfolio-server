import Joi from "joi";
import validationUnit from "./validation-unit.js";

export default {
  username: {
    default: Joi.string()
      .regex(new RegExp(validationUnit.regex.username))
      .custom(validationUnit.InvalidSeparator)
      .required(),
    update: Joi.string()
      .regex(new RegExp(validationUnit.regex.username))
      .custom(validationUnit.InvalidSeparator)
      .optional(),
  },
  password: {
    default: Joi.string().min(5).max(100).required(),
    update: Joi.string().min(5).max(100).optional(),
  },
  passwordConfirm: {
    default: Joi.when("password", {
      is: Joi.exist(),
      then: Joi.valid(Joi.ref("password")).required(),
    }),
  },
  currentPassword: {
    default: Joi.when("password", {
      is: Joi.exist(),
      then: Joi.string().required(),
    }),
  },
};
