import supertest from "supertest";
import app from "../src/application/app.js";
import testUtil from "./test-util.js";

describe("POST /api/users/register", () => {
  afterEach(async () => {
    await testUtil.DeleteTestUsers("test");
  });

  it("should be able to register new users", async () => {
    const cAuth = testUtil.GetCaptchaCode();
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
    const cAuth = testUtil.GetCaptchaCode();

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
    const cAuth = testUtil.GetCaptchaCode();
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
    const cAuth = testUtil.GetCaptchaCode();
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
    const cAuth = testUtil.GetCaptchaCode();
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

  it("should be rejected if password confirmation is undefined", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cResult = await supertest(app)
      .post("/api/users/register")
      .send({
        username: "test",
        password: "test123",
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

  it("should be able to log in", async () => {
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
    expect(cResult.body.data.username).toBe("test");
    expect(cResult.body.data.password).toBeUndefined();
    expect(cResult.body.data.token).toBeDefined();
    expect(cResult.body.error).toBeUndefined();
  });

  it("should be rejected if the password is incorrect", async () => {
    const cAuth = testUtil.GetCaptchaCode();
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
    const cAuth = testUtil.GetCaptchaCode();
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
    const cAuth = testUtil.GetCaptchaCode();
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
    const cAuth = testUtil.GetCaptchaCode();
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

describe("PATCH /api/users/update", () => {
  beforeEach(async () => {
    await testUtil.CreateTestUser("test", "test123");
  });

  afterEach(async () => {
    await testUtil.DeleteTestUsers("test");
    await testUtil.DeleteTestUsers("try");
  });

  it("should be able to update the user without data", async () => {
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
    expect(cResult.body.data.username).toBe("test");
    expect(cResult.body.error).toBeUndefined();
  });

  it("should be able to just update the username", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .send({
        username: "try",
      })
      .set("Authorization", cLoginToken);

    expect(cResult.status).toBe(200);
    expect(cResult.body.data.username).toBe("try");
    expect(cResult.body.error).toBeUndefined();
  });

  it("should be able to just update the password", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .send({
        password: "try123",
        password_confirm: "try123",
        current_password: "test123",
      })
      .set("Authorization", cLoginToken);

    expect(cResult.status).toBe(200);
    expect(cResult.body.data.username).toBe("test");
    expect(cResult.body.data.password).toBeUndefined();
    expect(cResult.body.data.password_confirm).toBeUndefined();
    expect(cResult.body.data.current_password).toBeUndefined();
    expect(cResult.body.error).toBeUndefined();
  });

  it("should be able to update the user", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .send({
        username: "try",
        password: "try123",
        password_confirm: "try123",
        current_password: "test123",
      })
      .set("Authorization", cLoginToken);

    expect(cResult.status).toBe(200);
    expect(cResult.body.data.username).toBe("try");
    expect(cResult.body.data.password).toBeUndefined();
    expect(cResult.body.data.password_confirm).toBeUndefined();
    expect(cResult.body.data.current_password).toBeUndefined();
    expect(cResult.body.error).toBeUndefined();
  });

  it("should be rejected if the current password is incorrect", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .send({
        password: "try123",
        password_confirm: "try123",
        current_password: "try123",
      })
      .set("Authorization", cLoginToken);

    expect(cResult.status).toBe(422);
    expect(cResult.body.error.title).toBe("Current Password Incorrect");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if username validation fails", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
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
        .patch("/api/users/update")
        .send({
          username: cUsernameFailValidation[i],
        })
        .set("Authorization", cLoginToken);

      expect(cResult.status).toBe(400);
      expect(cResult.body.error.title).toBe("Username Validation Failed");
      expect(typeof cResult.body.error.messages).toBe("object");
      expect(cResult.body.data).toBeUndefined();
    }
  });

  it("should be rejected if password validation fails", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
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
        .patch("/api/users/update")
        .send({
          password: cPasswordFailValidation[i],
          password_confirm: cPasswordFailValidation[i],
          current_password: "test123",
        })
        .set("Authorization", cLoginToken);

      expect(cResult.status).toBe(400);
      expect(cResult.body.error.title).toBe("Password Validation Failed");
      expect(typeof cResult.body.error.messages).toBe("object");
      expect(cResult.body.data).toBeUndefined();
    }
  });

  it("should be rejected if password confirmation validation fails", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .send({
        password: "try123",
        password_confirm: "test123",
        current_password: "test123",
      })
      .set("Authorization", cLoginToken);

    expect(cResult.status).toBe(400);
    expect(cResult.body.error.title).toBe(
      "Password Confirmation Validation Failed"
    );
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if password confirmation is undefined", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .send({
        password: "try123",
        current_password: "test123",
      })
      .set("Authorization", cLoginToken);

    expect(cResult.status).toBe(400);
    expect(cResult.body.error.title).toBe(
      "Password Confirmation Validation Failed"
    );
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if current password validation fails", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .send({
        password: "try123",
        password_confirm: "try123",
        current_password: "",
      })
      .set("Authorization", cLoginToken);

    expect(cResult.status).toBe(400);
    expect(cResult.body.error.title).toBe("Current Password Validation Failed");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });

  it("should be rejected if current password is undefined", async () => {
    const cAuth = testUtil.GetCaptchaCode();
    const cLoginToken = await testUtil.GetLoginToken(
      "test",
      "test123",
      cAuth.captchaCode,
      cAuth.token
    );
    const cResult = await supertest(app)
      .patch("/api/users/update")
      .send({
        password: "try123",
        password_confirm: "try123",
      })
      .set("Authorization", cLoginToken);

    expect(cResult.status).toBe(400);
    expect(cResult.body.error.title).toBe("Current Password Validation Failed");
    expect(typeof cResult.body.error.messages).toBe("object");
    expect(cResult.body.data).toBeUndefined();
  });
});
