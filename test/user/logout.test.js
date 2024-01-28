import supertest from "supertest";
import testUtil from "../test-util.js";
import app from "../../src/application/app.js";

const cPath = "/api/users/logout";
const cReqBody = {
  username: "test",
  password: "test123",
};

describe(`DELETE ${cPath}`, () => {
  beforeEach(async () => {
    await testUtil.CreateTestUser(cReqBody.username, cReqBody.password);
  });

  afterEach(async () => {
    await testUtil.DeleteTestUsers(cReqBody.username);
  });

  it("should be able to log out", async () => {
    let vUser = await testUtil.GetTestUser(cReqBody.username);

    expect(vUser.token).not.toBeNull();

    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cReqBody.username,
      cReqBody.password,
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .delete(cPath)
      .set(testUtil.env.setAuthorization, cLoginToken);

    expect(cResult.status).toBe(200);
    testUtil.AllowedObjectProps(["status"], cResult.body.data);
    expect(cResult.body.data.status).toBe("Logout Successful");
    expect(cResult.body.error).toBeUndefined();

    vUser = await testUtil.GetTestUser(cReqBody.username);

    expect(vUser.token).toBeNull();
  });
});
