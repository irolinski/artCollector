const request = require("supertest");
const app = require("./../app");
const mongoose = require("mongoose");
const server = require("./../server");
require("dotenv").config();
const dbUrl = process.env.DB_URL ?? "";

beforeAll(async () => {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

describe("Checks whether the server works at all", () => {
  it("Should return statusCode 200", async () => {
    const res = await request(server).get("/server-check");
    expect(res.statusCode).toBe(200);
  });
});

afterAll(async () => {
  await server.close();
  await mongoose.connection.close();
});
