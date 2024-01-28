import prismaClient from "../../application/database.js";
import env from "../../env.js";
import ResponseError from "../../error/response.js";
import userValidation from "../../validation/user.js";
import Validate from "../../validation/tools/validation.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";

const UserRegisterService = async (pReqBody) => {
  const cReqBody = Validate(userValidation.register, pReqBody);

  const cQueryCountUser = await prismaClient.user.count({
    where: {
      username: cReqBody.username,
    },
  });

  if (cQueryCountUser > 0) {
    throw new ResponseError(
      env.httpStatus.clientError.conflict.code,
      "Username Already Exists",
      [
        "Registration failed",
        "The username used is already used by another user",
        "Please use another username",
      ]
    );
  }

  cReqBody.password = await bcrypt.hash(cReqBody.password, 10);

  const cLoginToken = uuid().toString();
  const cToken = jwt.sign({ loginToken: cLoginToken }, process.env.JWTKEY, {
    expiresIn: env.appSettings.jwtExpires,
  });

  const cQueryCreateUser = await prismaClient.user.create({
    data: {
      username: cReqBody.username,
      password: cReqBody.password,
      token: cLoginToken,
    },
    select: {
      username: true,
    },
  });

  return {
    username: cQueryCreateUser.username,
    token: cToken,
  };
};

export default UserRegisterService;
