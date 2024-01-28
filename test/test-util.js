import prismaClient from "../src/application/database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import supertest from "supertest";
import app from "../src/application/app.js";

const env = {
  setCaptchaCode: "Captcha-Code",
  setAuthentication: "Authentication",
  setAuthorization: "Authorization",
};

const DeleteTestUsers = async (pUsername) => {
  await prismaClient.user.deleteMany({
    where: {
      username: pUsername,
    },
  });
};

const GetCaptchaCode = (pExpiresIn = 60 * 5) => {
  const cCaptchaCode = "abc123";
  const cToken = jwt.sign({ captchaCode: cCaptchaCode }, process.env.JWTKEY, {
    expiresIn: pExpiresIn,
  });

  return {
    captchaCode: cCaptchaCode,
    token: `${process.env.TOKENKEY} ${cToken}`,
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
  pAuthentication,
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
    .set("Authentication", pAuthentication);

  const cVerifyJwt = jwt.verify(cLogin.body.data.token, process.env.JWTKEY);
  const cLoginToken = jwt.sign(
    { loginToken: pLoginToken || cVerifyJwt.loginToken },
    process.env.JWTKEY,
    {
      expiresIn: pExpiresLoginToken,
    }
  );

  return `${process.env.TOKENKEY} ${cLoginToken}`;
};

const GetTestUser = async (pUsername) => {
  return prismaClient.user.findUnique({
    where: {
      username: pUsername,
    },
  });
};

const AllowedObjectProps = (pAllowed, pObject) => {
  pObject = Object.keys(pObject);
  expect(pObject).toEqual(pAllowed);
};

export default {
  env,
  DeleteTestUsers,
  GetCaptchaCode,
  CreateTestUser,
  GetLoginToken,
  GetTestUser,
  AllowedObjectProps,
};
