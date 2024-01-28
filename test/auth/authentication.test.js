import supertest from "supertest";
import testUtil from "../test-util.js";
import app from "../../src/application/app.js";

const cPath = "/api/users/register";
const cReqBody = {
  username: "test",
  password: "test123",
  password_confirm: "test123",
};

describe("Authentication Test", () => {
  afterEach(async () => {
    await testUtil.DeleteTestUsers(cReqBody.username);
  });

  it("should be able to authenticate", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post(cPath)
      .send(cReqBody)
      .set(testUtil.env.setCaptchaCode, cAuth.captchaCode)
      .set(testUtil.env.setAuthentication, cAuth.token);

    expect(cResult.status).toBe(201);
    expect(cResult.body.data).toBeDefined();
    expect(cResult.body.error).toBeUndefined();
  });

  it("should be rejected if the token is not authentication", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post(cPath)
      .send(cReqBody)
      .set(testUtil.env.setCaptchaCode, cAuth.captchaCode)
      .set(testUtil.env.setAuthorization, cAuth.token);

    expect(cResult.status).toBe(401);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Problematic Code");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the token keyword is wrong", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post(cPath)
      .send(cReqBody)
      .set(testUtil.env.setCaptchaCode, cAuth.captchaCode)
      .set(testUtil.env.setAuthentication, "wrong");

    expect(cResult.status).toBe(401);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Problematic Code");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the token has expired", async () => {
    const cAuth = testUtil.GetCaptchaCode(0);
    const cResult = await supertest(app)
      .post(cPath)
      .send(cReqBody)
      .set(testUtil.env.setCaptchaCode, cAuth.captchaCode)
      .set(testUtil.env.setAuthentication, cAuth.token);

    expect(cResult.status).toBe(401);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Expired Code");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the token is problematic", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post(cPath)
      .send(cReqBody)
      .set(testUtil.env.setCaptchaCode, cAuth.captchaCode)
      .set(testUtil.env.setAuthentication, `${process.env.TOKENKEY} wrong`);

    expect(cResult.status).toBe(401);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Problematic Code");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the code does not match", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post(cPath)
      .send(cReqBody)
      .set(testUtil.env.setCaptchaCode, "aaaaaa")
      .set(testUtil.env.setAuthentication, cAuth.token);

    expect(cResult.status).toBe(401);
    testUtil.AllowedObjectProps(["title", "messages"], cResult.body.error);
    expect(cResult.body.error.title).toBe("Unmatch Code");
    expect(cResult.body.data).toBeUndefined();
  });
});
