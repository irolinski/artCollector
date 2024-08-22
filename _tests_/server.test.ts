import request from "supertest";
import server from "../src/server";
require("dotenv").config();

const dbUrl = process.env.DB_URL ?? "";

describe("Checks whether the server works at all", () => {
  it("Should redirect to '/home' and return statusCode === 200", async () => {
    const res = await request(server).get("/");
    expect(res.statusCode).toBe(200);
    expect(res.headers.location).toBe("/home");
  });
});

afterAll(async () => {
  server.close();
});
