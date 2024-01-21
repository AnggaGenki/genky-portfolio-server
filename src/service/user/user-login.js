import Validate from "../../validation/validation.js";
import userValidation from "../../validation/user.js";
import prismaClient from "../../application/database.js";
import ResponseError from "../../error/response.js";
import env from "../../env.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";

const UserLoginService = async (pReqBody) => {
  const cReqBody = Validate(userValidation.login, pReqBody);

  const cQueryFindUser = await prismaClient.user.findFirst({
    where: {
      username: cReqBody.username,
    },
    select: {
      id: true,
      username: true,
      password: true,
    },
  });

  const cNotFoundCode = env.httpStatus.clientError.notFound.code;

  if (!cQueryFindUser) {
    throw new ResponseError(cNotFoundCode, "User Not Found", [
      "Login Failed",
      "Incorrect username or password",
      "Please use the username or password that you already registered",
    ]);
  }

  const cIsPasswordValid = await bcrypt.compare(
    cReqBody.password,
    cQueryFindUser.password
  );

  if (!cIsPasswordValid) {
    throw new ResponseError(cNotFoundCode, "User Not Found", [
      "Login Failed",
      "Incorrect username or password",
      "Please use the username or password that you already registered",
    ]);
  }

  const cLoginToken = uuid().toString();
  const cToken = jwt.sign({ loginToken: cLoginToken }, process.env.JWTKEY, {
    expiresIn: env.appSettings.jwtExpires,
  });

  await prismaClient.user.update({
    data: {
      token: cLoginToken,
    },
    where: {
      id: cQueryFindUser.id,
    },
  });

  return {
    username: cQueryFindUser.username,
    token: cToken,
  };
};

export default UserLoginService;
