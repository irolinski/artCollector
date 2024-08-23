import request from "supertest";
import mongoose, { ConnectOptions } from "mongoose";
import server from "../server";
import {
  fakeUserLogin,
  testUserLogin,
  testUserRegister,
} from "./mock_data/user_mock";
import artpiece_mock from "./mock_data/artpiece_mock";
require("dotenv").config();

const dbUrl = process.env.DB_URL;
process.env.NODE_ENV = "test";

const requestAuth = (
  route: string,
  user: { username: string; password: string }
) => {
  const authenticatedAgentToBe = request.agent(server);
  return new Promise((resolve, reject) => {
    authenticatedAgentToBe
      .post(route)
      .send(user)
      .end((error, res) => {
        if (error) reject(error);
        resolve(authenticatedAgentToBe);
      });
  });
};

beforeAll(async () => {
  await mongoose.connect(dbUrl!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
});

describe("Check if CRUD functionality works", () => {
  it("should add a new piece and return 200", async () => {
    return requestAuth("/login", {
      username: testUserLogin.username,
      password: testUserLogin.password,
    }).then((authenticatedagent: any) => {
      return authenticatedagent
        .post("/collection")
        .send(artpiece_mock)
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .then((res: any) => {
          console.log(res);
          expect(res.statusCode).toBe(302);
          expect(res.headers.location).toBe("/collection");
        });
    });
  });
});

it("should edit the added piece and return 200", () => {});
//   it("should delete a chosen image");
//--i don't think it can be done because
// I would have to upload it through here ??
it("should delete the added piece and return 200", () => {});

describe("Check if routing works", () => {
  it("should render show page, edit page", () => {
    return requestAuth("/login", testUserLogin).then(
      (authenticatedagent: any) => {
        return (
          authenticatedagent.get("/collection").expect(200) &&
          authenticatedagent.get("/preferences").expect(200)
        );
      }
    );
  });
});

describe("Check if special features work", () => {
  it("should export collection to xlsx", () => {});
});

describe("Check if deleting works", () => {});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
