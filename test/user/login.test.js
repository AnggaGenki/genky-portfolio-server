import supertest from "supertest";
import testUtil from "../test-util.js";
import app from "../../src/application/app.js";

const cPath = "/api/users/login";
const cReqBody = {
  username: "test",
  password: "test123",
};

describe(`POST ${cPath}`, () => {
  beforeEach(async () => {
    await testUtil.CreateTestUser(cReqBody.username, cReqBody.password);
  });

  afterEach(async () => {
    await testUtil.DeleteTestUsers(cReqBody.username);
  });

  it("should be able to log in", async () => {
    let vUser = await testUtil.GetTestUser(cReqBody.username);
    const cUserToken = vUser.token;

    expect(cUserToken).not.toBeNull();

    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post(cPath)
      .send(cReqBody)
      .set(testUtil.env.setCaptchaCode, cAuth.captchaCode)
      .set(testUtil.env.setAuthentication, cAuth.token);

    expect(cResult.status).toBe(200);
    testUtil.AllowedObjectProps(["username", "token"], cResult.body.data);
    expect(cResult.body.data.username).toBe("test");
    expect(cResult.body.error).toBeUndefined();

    vUser = await testUtil.GetTestUser(cReqBody.username);

    expect(vUser.token).not.toBe(cUserToken);
  });

  it("should be rejected if the password is incorrect", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post(cPath)
      .send({
        ...cReqBody,
        password: "test321",
      })
      .set(testUtil.env.setCaptchaCode, cAuth.captchaCode)
      .set(testUtil.env.setAuthentication, cAuth.token);

    expect(cResult.status).toBe(404);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("User Not Found");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the username is not found", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post(cPath)
      .send({
        ...cReqBody,
        username: "try",
      })
      .set(testUtil.env.setCaptchaCode, cAuth.captchaCode)
      .set(testUtil.env.setAuthentication, cAuth.token);

    expect(cResult.status).toBe(404);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("User Not Found");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if username validation fails", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cUsernameFailValidation = [
      123,
      "",
      "te",
      "test1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567",
      "test123!@#",
      "test123 ",
      " test123",
      "test  123",
    ];

    for (let i = 0; i < cUsernameFailValidation.length; i++) {
      const cResult = await supertest(app)
        .post(cPath)
        .send({
          ...cReqBody,
          username: cUsernameFailValidation[i],
        })
        .set(testUtil.env.setCaptchaCode, cAuth.captchaCode)
        .set(testUtil.env.setAuthentication, cAuth.token);

      expect(cResult.status).toBe(400);
      testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
      expect(cResult.body.error.title).toBe("Username Validation Failed");
      expect(cResult.body.data).toBeUndefined();
    }
  });

  it("should be rejected if username is undefined", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post(cPath)
      .send({
        password: cReqBody.password,
      })
      .set(testUtil.env.setCaptchaCode, cAuth.captchaCode)
      .set(testUtil.env.setAuthentication, cAuth.token);

    expect(cResult.status).toBe(400);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Username Validation Failed");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if password validation fails", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cPasswordFailValidation = [
      12345,
      "",
      "test",
      "test1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567",
    ];

    for (let i = 0; i < cPasswordFailValidation.length; i++) {
      const cResult = await supertest(app)
        .post(cPath)
        .send({
          ...cReqBody,
          password: cPasswordFailValidation[i],
        })
        .set(testUtil.env.setCaptchaCode, cAuth.captchaCode)
        .set(testUtil.env.setAuthentication, cAuth.token);

      expect(cResult.status).toBe(400);
      testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
      expect(cResult.body.error.title).toBe("Password Validation Failed");
      expect(cResult.body.data).toBeUndefined();
    }
  });

  it("should be rejected if password is undefined", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post(cPath)
      .send({
        username: cReqBody.username,
      })
      .set(testUtil.env.setCaptchaCode, cAuth.captchaCode)
      .set(testUtil.env.setAuthentication, cAuth.token);

    expect(cResult.status).toBe(400);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Password Validation Failed");
    expect(cResult.body.data).toBeUndefined();
  });
});
