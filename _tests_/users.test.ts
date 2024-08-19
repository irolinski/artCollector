const request = require("supertest");
const app = require("./../app");
const mongoose = require("mongoose");
const server = require("./../server");
require("dotenv").config();
const dbUrl = process.env.DB_URL ?? "";

beforeEach(async () => {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

describe("Checks whether the server works at all", () => {
  it("should return statusCode 200", async () => {
    const res = await request(server).get("/home");
    expect(res.statusCode).toBe(200);
  });
});
