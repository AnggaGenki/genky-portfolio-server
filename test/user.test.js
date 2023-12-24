import supertest from "supertest";
import app from "../src/application/app.js";

describe("ROOT PATH", () => {
  it("should return text 'Hello from Genky Portfolio Server!'", async () => {
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
  });
});
