import supertest from "supertest";
import app from "../src/application/app";
import testUtil from "./test-util";

describe("GET /", () => {
  it("should return the text 'Hello from Genky Portfolio Server!'", async () => {
    const cResult = await supertest(app).get("/");

    expect(cResult.status).toBe(200);
    expect(cResult.text).toBe("Hello from Genky Portfolio server!");
  });
});

describe("GET /captchaCode", () => {
  it("should return captcha code and token", async () => {
    const cResult = await supertest(app).get("/captchaCode");

    expect(cResult.status).toBe(200);
    expect(cResult.body.data.captcha_code).toBeDefined();
    expect(cResult.body.data.token).toBeDefined();
    expect(cResult.body.error).toBeUndefined();
  });
});

describe("Test Auth Before Login", () => {
  beforeEach(async () => {
    await testUtil.CreateTestUser("test", "test123");
  });

  afterEach(async () => {
    await testUtil.DeleteTestUsers("test");
  });

  it("should be able to authenticate", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post("/api/users/login")
      .send({
        username: "test",
        password: "test123",
      })
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", cAuth.token);

    expect(cResult.status).toBe(200);
    expect(cResult.body.data).toBeDefined();
    expect(cResult.body.error).toBeUndefined();
  });

  it("should be rejected if the token keyword is false", async () => {
    const cAuth = testUtil.GetCaptchaCode("bearer");
    const cResult = await supertest(app)
      .post("/api/users/login")
      .send({
        username: "test",
        password: "test123",
      })
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", cAuth.token);

    expect(cResult.status).toBe(401);
    expect(cResult.body.error.title).toBe("Problematic Code");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the token has expired", async () => {
    const cAuth = testUtil.GetCaptchaCode(undefined, undefined, 0);
    const cResult = await supertest(app)
      .post("/api/users/login")
      .send({
        username: "test",
        password: "test123",
      })
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", cAuth.token);

    expect(cResult.status).toBe(401);
    expect(cResult.body.error.title).toBe("Expired Code");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the token is problematic", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post("/api/users/login")
      .send({
        username: "test",
        password: "test123",
      })
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", `${process.env.TOKENKEY} token`);

    expect(cResult.status).toBe(401);
    expect(cResult.body.error.title).toBe("Problematic Code");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the code does not match", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post("/api/users/login")
      .send({
        username: "test",
        password: "test123",
      })
      .set("Captcha-Code", "aaaaaa")
      .set("Authorization", cAuth.token);

    expect(cResult.status).toBe(401);
    expect(cResult.body.error.title).toBe("Unmatch Code");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });
});

describe("Test Auth After Login", () => {
  beforeEach(async () => {
    await testUtil.CreateTestUser("test", "test123");
  });

  afterEach(async () => {
    await testUtil.DeleteTestUsers("test");
  });

  it("should be able to authenticate", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .set("Authorization", cLoginToken);

    expect(cResult.status).toBe(200);
    expect(cResult.body.data).toBeDefined();
    expect(cResult.body.error).toBeUndefined();
  });

  it("should be rejected if the token keyword is false", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
      cAuth.captchaCode,
      cAuth.token,
      "bearer"
    );
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .set("Authorization", cLoginToken);

    expect(cResult.status).toBe(401);
    expect(cResult.body.error.title).toBe("Problematic Login Session");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the token has expired", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
      cAuth.captchaCode,
      cAuth.token,
      undefined,
      0
    );
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .set("Authorization", cLoginToken);

    expect(cResult.status).toBe(401);
    expect(cResult.body.error.title).toBe("Login Session Expired");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the token is problematic", async () => {
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .set("Authorization", `${process.env.TOKENKEY} token`);

    expect(cResult.status).toBe(401);
    expect(cResult.body.error.title).toBe("Problematic Login Session");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the user is not found", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
      cAuth.captchaCode,
      cAuth.token,
      undefined,
      undefined,
      "user"
    );
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .set("Authorization", cLoginToken);

    expect(cResult.status).toBe(401);
    expect(cResult.body.error.title).toBe("Problematic Login Session");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });
});
