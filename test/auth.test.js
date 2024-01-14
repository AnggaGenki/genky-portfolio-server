import supertest from "supertest";
import app from "../src/application/app";
import testUtil from "./test-util";

describe("GET /", () => {
  it("should return the text 'Hello from Genky Portfolio Server!'", async () => {
    const cResult = await supertest(app).get("/");

    expect(cResult.status).toBe(200);
    expect(cResult.text).toBe("Hello from Genky Portfolio Server!");
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

describe("GET /api/", () => {
  it("should be able to authenticate", async () => {
    const cAuth = await testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .get("/api/")
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", cAuth.token);

    expect(cResult.status).toBe(200);
    expect(cResult.text).toBe("Hello from Genky Portfolio Server!");
  });

  it("should be rejected if the token keyword is false", async () => {
    const cAuth = await testUtil.GetCaptchaCode("bearer");
    const cResult = await supertest(app)
      .get("/api/")
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", cAuth.token);

    expect(cResult.status).toBe(401);
    expect(cResult.body.error.title).toBe("Problematic Code");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the token has expired", async () => {
    const cAuth = await testUtil.GetCaptchaCode(undefined, undefined, 3);

    setTimeout(async () => {
      const cResult = await supertest(app)
        .get("/api/")
        .set("Captcha-Code", cAuth.captchaCode)
        .set("Authorization", cAuth.token);

      expect(cResult.status).toBe(401);
      expect(cResult.body.error.title).toBe("Expired Code");
      expect(typeof cResult.body.error.messages).toBe("object");
      expect(cResult.body.data).toBeUndefined();
    }, 5000);
  });

  it("should be rejected if the token is problematic", async () => {
    const cAuth = await testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .get("/api/")
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", "token");

    expect(cResult.status).toBe(401);
    expect(cResult.body.error.title).toBe("Problematic Code");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the code does not match", async () => {
    const cAuth = await testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .get("/api/")
      .set("Captcha-Code", "aaaaaa")
      .set("Authorization", cAuth.token);

    expect(cResult.status).toBe(401);
    expect(cResult.body.error.title).toBe("Unmatch Code");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });
});
