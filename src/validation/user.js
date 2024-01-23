import Joi from "joi";
import validationData from "./validation-data.js";

const register = Joi.object({
  username: validationData.username.default,
  password: validationData.password.default,
  password_confirm: validationData.passwordConfirm.default,
});

const login = Joi.object({
  username: validationData.username.default,
  password: validationData.password.default,
});

const update = Joi.object({
  username: validationData.username.update,
  password: validationData.password.update,
  password_confirm: validationData.passwordConfirm.default,
  current_password: validationData.currentPassword.default,
});

export default { register, login, update };
