import supertest from "supertest";
import app from "../../src/application/app.js";
import testUtil from "../test-util.js";

describe("GET /captchaCode", () => {
  it("should be able to get the captcha code", async () => {
    const cResult = await supertest(app).get("/captchaCode");

    expect(cResult.status).toBe(200);
    testUtil.AllowedObjectProps(["captcha_code", "token"], cResult.body.data);
    expect(cResult.body.error).toBeUndefined();
  });
});
