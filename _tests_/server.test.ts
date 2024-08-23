import request from "supertest";
import server from "../src/server";
require("dotenv").config();

const dbUrl = process.env.DB_URL ?? "";

describe("Checks basic server functions", () => {
  it("Should redirect to '/home' and return statusCode === 200", async () => {
    const res = await request(server).get("/");
    expect(res.statusCode).toBe(302);
    expect(res.headers.location).toBe("/home");
  });

  it("should return 404 on requesting a non-existent route", async () => {
    const res = await request(server).get("/some-non-existent-route");
    expect(res.statusCode).toBe(404);
  });

  it("should activate error handling middleware", async () => {
    const res = await request(server).get("/test/error-handling");
    expect(res.statusCode).toBe(500);
  });
});

afterAll(async () => {
  server.close();
});
