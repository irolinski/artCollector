import request from "supertest";
import app from "./../app";
import mongoose, { ConnectOptions } from "mongoose";
import server from "./../server";
require("dotenv").config();

const dbUrl = process.env.DB_URL ?? "";

beforeAll(async () => {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
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
