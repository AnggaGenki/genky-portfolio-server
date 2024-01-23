import prismaClient from "../src/application/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import supertest from "supertest";
import app from "../src/application/app.js";

const DeleteTestUsers = async (pUsername) => {
  await prismaClient.user.deleteMany({
    where: {
      username: pUsername,
    },
  });
};

const GetCaptchaCode = (
  pTokenKeyword = process.env.TOKENKEY,
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

const GetLoginToken = async (
  pUsername,
  pPassword,
  pCaptchaCode,
  pAuthorization,
  pTokenKeyword = process.env.TOKENKEY,
  pExpiresLoginToken = 60 * 60 * 24,
  pLoginToken = null
) => {
  const cLogin = await supertest(app)
    .post("/api/users/login")
    .send({
      username: pUsername,
      password: pPassword,
    })
    .set("Captcha-Code", pCaptchaCode)
    .set("Authorization", pAuthorization);

  const cVerifyJwt = jwt.verify(cLogin.body.data.token, process.env.JWTKEY);
  const cLoginToken = jwt.sign(
    { loginToken: pLoginToken || cVerifyJwt.loginToken },
    process.env.JWTKEY,
    {
      expiresIn: pExpiresLoginToken,
    }
  );

  return `${pTokenKeyword} ${cLoginToken}`;
};

export default {
  DeleteTestUsers,
  GetCaptchaCode,
  CreateTestUser,
  GetLoginToken,
};
