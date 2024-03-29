import supertest from "supertest";
import testUtil from "../test-util.js";
import app from "../../src/application/app.js";

const cPath = "/api/users/logout";
const cTestData = {
  username: "test",
  password: "test123",
};

describe(`DELETE ${cPath}`, () => {
  beforeEach(async () => {
    await testUtil.CreateTestUser(cTestData.username, cTestData.password);
  });

  afterEach(async () => {
    await testUtil.DeleteTestUsers(cTestData.username);
  });

  it("should be able to log out", async () => {
    let vUser = await testUtil.GetTestUser(cTestData.username);

    expect(vUser.token).not.toBeNull();

    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      cTestData.username,
      cTestData.password,
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

    vUser = await testUtil.GetTestUser(cTestData.username);

    expect(vUser.token).toBeNull();
  });
});
