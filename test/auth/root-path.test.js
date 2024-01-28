import supertest from "supertest";
import app from "../../src/application/app.js";

describe("Root Path Test", () => {
  it("should be able to return the root path text", async () => {
    const cResult = await supertest(app).get("/");

    expect(cResult.status).toBe(200);
    expect(cResult.text).toBe("Hello from Genky Portfolio server!");
    expect(cResult.body.data).toBeUndefined();
    expect(cResult.body.error).toBeUndefined();
  });
});
