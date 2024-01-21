import supertest from "supertest";
import app from "../src/application/app.js";
import testUtil from "./test-util.js";

describe("POST /api/users/register", () => {
  afterEach(async () => {
    await testUtil.DeleteTestUsers("test");
  });

  it("should be able to register new users", async () => {
    const cAuth = await testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post("/api/users/register")
      .send({
        username: "test",
        password: "test123",
        password_confirm: "test123",
      })
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", cAuth.token);

    expect(cResult.status).toBe(201);
    expect(cResult.body.data.username).toBe("test");
    expect(cResult.body.data.password).toBeUndefined();
    expect(cResult.body.data.password_confirm).toBeUndefined();
    expect(cResult.body.data.token).toBeDefined();
    expect(cResult.body.error).toBeUndefined();
  });

  it("should be rejected if the username already exists", async () => {
    const cAuth = await testUtil.GetCaptchaCode();

    let vResult = await supertest(app)
      .post("/api/users/register")
      .send({
        username: "test",
        password: "test123",
        password_confirm: "test123",
      })
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", cAuth.token);

    vResult = await supertest(app)
      .post("/api/users/register")
      .send({
        username: "test",
        password: "test123",
        password_confirm: "test123",
      })
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", cAuth.token);

    expect(vResult.status).toBe(400);
    expect(vResult.body.error.title).toBe("Username Already Exists");
    expect(typeof vResult.body.error.messages).toBe("object");
    expect(vResult.body.data).toBeUndefined();
  });

  it("should be rejected if username validation fails", async () => {
    const cAuth = await testUtil.GetCaptchaCode();
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
        .post("/api/users/register")
        .send({
          username: cUsernameFailValidation[i],
          password: "test123",
          password_confirm: "test123",
        })
        .set("Captcha-Code", cAuth.captchaCode)
        .set("Authorization", cAuth.token);

      expect(cResult.status).toBe(400);
      expect(cResult.body.error.title).toBe("Username Validation Failed");
      expect(typeof cResult.body.error.messages).toBe("object");
      expect(cResult.body.data).toBeUndefined();
    }
  });

  it("should be rejected if password validation fails", async () => {
    const cAuth = await testUtil.GetCaptchaCode();
    const cPasswordFailValidation = [
      12345,
      "",
      "test",
      "test1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567",
    ];

    for (let i = 0; i < cPasswordFailValidation.length; i++) {
      const cResult = await supertest(app)
        .post("/api/users/register")
        .send({
          username: "test",
          password: cPasswordFailValidation[i],
          password_confirm: cPasswordFailValidation[i],
        })
        .set("Captcha-Code", cAuth.captchaCode)
        .set("Authorization", cAuth.token);

      expect(cResult.status).toBe(400);
      expect(cResult.body.error.title).toBe("Password Validation Failed");
      expect(typeof cResult.body.error.messages).toBe("object");
      expect(cResult.body.data).toBeUndefined();
    }
  });

  it("should be rejected if password confirmation validation fails", async () => {
    const cAuth = await testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post("/api/users/register")
      .send({
        username: "test",
        password: "test123",
        password_confirm: "test321",
      })
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", cAuth.token);

    expect(cResult.status).toBe(400);
    expect(cResult.body.error.title).toBe(
      "Password Confirmation Validation Failed"
    );
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });
});

describe("POST /api/users/login", () => {
  beforeEach(async () => {
    await testUtil.CreateTestUser("test", "test123");
  });

  afterEach(async () => {
    await testUtil.DeleteTestUsers("test");
  });

  it("should can login", async () => {
    const cAuth = await testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post("/api/users/login")
      .send({
        username: "test",
        password: "test123",
      })
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", cAuth.token);

    expect(cResult.status).toBe(200);
    expect(cResult.body.data.username).toBe("test");
    expect(cResult.body.data.password).toBeUndefined();
    expect(cResult.body.data.token).toBeDefined();
    expect(cResult.body.error).toBeUndefined();
  });

  it("should be rejected if the password is incorrect", async () => {
    const cAuth = await testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post("/api/users/login")
      .send({
        username: "test",
        password: "test1231",
      })
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", cAuth.token);

    expect(cResult.status).toBe(404);
    expect(cResult.body.error.title).toBe("User Not Found");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if the username is not found", async () => {
    const cAuth = await testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post("/api/users/login")
      .send({
        username: "test1",
        password: "test123",
      })
      .set("Captcha-Code", cAuth.captchaCode)
      .set("Authorization", cAuth.token);

    expect(cResult.status).toBe(404);
    expect(cResult.body.error.title).toBe("User Not Found");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if username validation fails", async () => {
    const cAuth = await testUtil.GetCaptchaCode();
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
        .post("/api/users/login")
        .send({
          username: cUsernameFailValidation[i],
          password: "test123",
        })
        .set("Captcha-Code", cAuth.captchaCode)
        .set("Authorization", cAuth.token);

      expect(cResult.status).toBe(400);
      expect(cResult.body.error.title).toBe("Username Validation Failed");
      expect(typeof cResult.body.error.messages).toBe("object");
      expect(cResult.body.data).toBeUndefined();
    }
  });

  it("should be rejected if password validation fails", async () => {
    const cAuth = await testUtil.GetCaptchaCode();
    const cPasswordFailValidation = [
      12345,
      "",
      "test",
      "test1234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567",
    ];

    for (let i = 0; i < cPasswordFailValidation.length; i++) {
      const cResult = await supertest(app)
        .post("/api/users/login")
        .send({
          username: "test",
          password: cPasswordFailValidation[i],
        })
        .set("Captcha-Code", cAuth.captchaCode)
        .set("Authorization", cAuth.token);

      expect(cResult.status).toBe(400);
      expect(cResult.body.error.title).toBe("Password Validation Failed");
      expect(typeof cResult.body.error.messages).toBe("object");
      expect(cResult.body.data).toBeUndefined();
    }
  });
});
