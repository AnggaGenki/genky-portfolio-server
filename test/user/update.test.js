import supertest from "supertest";
import testUtil from "../test-util.js";
import app from "../../src/application/app.js";

const cPath = "/api/users/update";
const cReqBody = {
  username: "try",
  password: "try123",
  password_confirm: "try123",
  current_password: "test123",
};
const cTestData = {
  username: "test",
  password: "test123",
};

describe(`PATCH ${cPath}`, () => {
  beforeEach(async () => {
    await testUtil.CreateTestUser(cTestData.username, cTestData.password);
  });

  afterEach(async () => {
    await testUtil.DeleteTestUsers(cTestData.username);
    await testUtil.DeleteTestUsers(cReqBody.username);
  });

  it("should be able to update the user without data", async () => {
    let vUser = await testUtil.GetTestUser(cTestData.username);
    const cUserPassword = vUser.password;

    expect(vUser.username).toBe("test");
    expect(cUserPassword).not.toBeNull();

    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cTestData.username,
      cTestData.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(200);
    testUtil.AllowedObjectProps(["username"], cResult.body.data);
    expect(cResult.body.data.username).toBe("test");
    expect(cResult.body.error).toBeUndefined();

    vUser = await testUtil.GetTestUser(cTestData.username);

    expect(vUser.username).toBe("test");
    expect(vUser.password).toBe(cUserPassword);

    vUser = await testUtil.GetTestUser(cReqBody.username);

    expect(vUser).toBeNull();
  });

  it("should be able to just update the username", async () => {
    let vUser = await testUtil.GetTestUser(cTestData.username);
    const cUserPassword = vUser.password;

    expect(vUser.username).toBe("test");
    expect(cUserPassword).not.toBeNull();

    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cTestData.username,
      cTestData.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .send({
        username: cReqBody.username,
      })
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(200);
    testUtil.AllowedObjectProps(["username"], cResult.body.data);
    expect(cResult.body.data.username).toBe("try");
    expect(cResult.body.error).toBeUndefined();

    vUser = await testUtil.GetTestUser(cTestData.username);

    expect(vUser).toBeNull();

    vUser = await testUtil.GetTestUser(cReqBody.username);

    expect(vUser.username).toBe("try");
    expect(vUser.password).toBe(cUserPassword);
  });

  it("should be able to just update the password", async () => {
    let vUser = await testUtil.GetTestUser(cTestData.username);
    const cUserPassword = vUser.password;

    expect(vUser.username).toBe("test");
    expect(cUserPassword).not.toBeNull();

    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cTestData.username,
      cTestData.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .send({
        password: cReqBody.password,
        password_confirm: cReqBody.password_confirm,
        current_password: cReqBody.current_password,
      })
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(200);
    testUtil.AllowedObjectProps(["username"], cResult.body.data);
    expect(cResult.body.data.username).toBe("test");
    expect(cResult.body.error).toBeUndefined();

    vUser = await testUtil.GetTestUser(cTestData.username);

    expect(vUser.username).toBe("test");
    expect(vUser.password).not.toBe(cUserPassword);

    vUser = await testUtil.GetTestUser(cReqBody.username);

    expect(vUser).toBeNull();
  });

  it("should be able to update the user", async () => {
    let vUser = await testUtil.GetTestUser(cTestData.username);
    const cUserPassword = vUser.password;

    expect(vUser.username).toBe("test");
    expect(cUserPassword).not.toBeNull();

    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cTestData.username,
      cTestData.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .send(cReqBody)
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(200);
    testUtil.AllowedObjectProps(["username"], cResult.body.data);
    expect(cResult.body.data.username).toBe("try");
    expect(cResult.body.error).toBeUndefined();

    vUser = await testUtil.GetTestUser(cTestData.username);

    expect(vUser).toBeNull();

    vUser = await testUtil.GetTestUser(cReqBody.username);

    expect(vUser.username).toBe("try");
    expect(vUser.password).not.toBe(cUserPassword);
  });

  it("should be rejected if the current password is incorrect", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cTestData.username,
      cTestData.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .send({
        ...cReqBody,
        current_password: "try123",
      })
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(422);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Current Password Incorrect");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if username validation fails", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cTestData.username,
      cTestData.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cUsernameFailValidation = [
      123,
      "te",
      "test1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567",
      "test123!@#",
      "test123 ",
      " test123",
      "test  123",
    ];

    for (let i = 0; i < cUsernameFailValidation.length; i++) {
      const cResult = await supertest(app)
        .patch(cPath)
        .send({
          username: cUsernameFailValidation[i],
        })
        .set(testUtil.env.setAuthorization, cLoginToken);

      expect(cResult.status).toBe(400);
      testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
      expect(cResult.body.error.title).toBe("Username Validation Failed");
      expect(cResult.body.data).toBeUndefined();
    }
  });

  it("should be rejected if password validation fails", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cTestData.username,
      cTestData.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cPasswordFailValidation = [
      12345,
      "test",
      "test1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567",
    ];

    for (let i = 0; i < cPasswordFailValidation.length; i++) {
      const cResult = await supertest(app)
        .patch(cPath)
        .send({
          password: cPasswordFailValidation[i],
          password_confirm: cPasswordFailValidation[i],
          current_password: cReqBody.current_password,
        })
        .set(testUtil.env.setAuthorization, cLoginToken);

      expect(cResult.status).toBe(400);
      testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
      expect(cResult.body.error.title).toBe("Password Validation Failed");
      expect(cResult.body.data).toBeUndefined();
    }
  });

  it("should be rejected if password confirmation validation fails", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cTestData.username,
      cTestData.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .send({
        password: cReqBody.password,
        password_confirm: "test123",
        current_password: cReqBody.current_password,
      })
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(400);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe(
      "Password Confirmation Validation Failed"
    );
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if password confirmation is undefined", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cTestData.username,
      cTestData.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .send({
        password: cReqBody.password,
        current_password: cReqBody.current_password,
      })
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(400);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe(
      "Password Confirmation Validation Failed"
    );
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if current password validation fails", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cTestData.username,
      cTestData.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .send({
        password: cReqBody.password,
        password_confirm: cReqBody.password_confirm,
        current_password: "",
      })
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(400);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Current Password Validation Failed");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if current password is undefined", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cTestData.username,
      cTestData.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .send({
        password: cReqBody.password,
        password_confirm: cReqBody.password_confirm,
      })
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(400);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Current Password Validation Failed");
    expect(cResult.body.data).toBeUndefined();
  });
});
