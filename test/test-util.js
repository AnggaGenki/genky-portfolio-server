import prismaClient from "../src/application/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

const DeleteTestUsers = async (pUsername) => {
  await prismaClient.user.deleteMany({
    where: {
      username: pUsername,
    },
  });
};

const GetCaptchaCode = async (
  pTokenKeyword = "Bearer",
  pCode = "abc123",
  pExpiresIn = 60 * 5
) => {
  const cCaptchaCode = pCode;
  const cToken = jwt.sign({ captchaCode: cCaptchaCode }, process.env.JWTKEY, {
    expiresIn: pExpiresIn,
  });

  return {
    captchaCode: cCaptchaCode,
    token: `${pTokenKeyword} ${cToken}`,
  };
};

const CreateTestUser = async (pUsername, pPassword) => {
  await prismaClient.user.create({
    data: {
      username: pUsername,
      password: await bcrypt.hash(pPassword, 10),
      token: uuid().toString(),
    },
  });
};

export default { DeleteTestUsers, GetCaptchaCode, CreateTestUser };
