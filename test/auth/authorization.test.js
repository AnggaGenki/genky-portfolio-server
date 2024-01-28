import supertest from "supertest";
import testUtil from "../test-util.js";
import app from "../../src/application/app.js";

const cPath = "/api/users/update";
const cReqBody = {
  username: "test",
  password: "test123",
};

describe("Authorization Test", () => {
  beforeEach(async () => {
    await testUtil.CreateTestUser(cReqBody.username, cReqBody.password);
  });

  afterEach(async () => {
    await testUtil.DeleteTestUsers(cReqBody.username);
  });

  it("should be able to authorized", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cReqBody.username,
      cReqBody.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(200);
    expect(cResult.body.data).toBeDefined();
    expect(cResult.body.error).toBeUndefined();
  });

  it("should be rejected if the token is not authorization", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cReqBody.username,
      cReqBody.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .set(testUtil.env.setAuthentication, cLoginToken);

    expect(cResult.status).toBe(401);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Problematic Login Session");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the token keyword is wrong", async () => {
    const cResult = await supertest(app)
      .patch(cPath)
      .set(testUtil.env.setAuthorization, "wrong");

    expect(cResult.status).toBe(401);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Problematic Login Session");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the token has expired", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cReqBody.username,
      cReqBody.password,
      cAuth.captchaCode,
      cAuth.token,
      0
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(401);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Login Session Expired");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the token is problematic", async () => {
    const cResult = await supertest(app)
      .patch(cPath)
      .set(testUtil.env.setAuthorization, `${process.env.TOKENKEY} wrong`);

    expect(cResult.status).toBe(401);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Problematic Login Session");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the user is not found", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cReqBody.username,
      cReqBody.password,
      cAuth.captchaCode,
      cAuth.token,
      undefined,
      "not found"
    );
    const cResult = await supertest(app)
      .patch(cPath)
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(401);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Problematic Login Session");
    expect(cResult.body.data).toBeUndefined();
  });
});
