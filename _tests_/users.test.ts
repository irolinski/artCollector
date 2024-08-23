import request from "supertest";
import mongoose, { ConnectOptions } from "mongoose";
import server from "../server";
import {
  fakeUserLogin,
  testUserLogin,
  testUserRegister,
} from "./mock_data/user_mock";
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

describe("Check if authentication and route protection middleware (isLoggedIn) work", () => {
  it("allows authenticated user onto private routes", () => {
    return requestAuth("/login", testUserLogin).then(
      (authenticatedagent: any) => {
        return (
          authenticatedagent.get("/collection").expect(200) &&
          authenticatedagent.get("/preferences").expect(200)
        );
      }
    );
  });

  it("redirects from private routes if the authentication fails", () => {
    return requestAuth("/login", fakeUserLogin).then(
      (authenticatedagent: any) => {
        return (
          authenticatedagent.get("/collection").expect(302) &&
          authenticatedagent.get("/preferences").expect(302)
        );
      }
    );
  });

  it("gives access to shared user data under 'discover", async () => {
    const res = await request(server).get(
      `/discover/${testUserLogin.username}`
    );
    expect(res.statusCode).toBe(200);
  });
});

const newUser = testUserRegister;
describe("Check if user registration works", () => {
  it("registers a new user", async () => {
    const res = await request(server)
      .post("/register")
      .send(newUser)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(res.statusCode).toBe(302);
    expect(res.header.location).toBe("/collection");
  });
});

newUser.username += "new";
newUser.password += "new";
describe("Check if user updating works", () => {
  it("edits user data", async () => {
    return requestAuth("/login", testUserRegister).then(
      (authenticatedagent: any) => {
        const usernameChange = authenticatedagent
          .put("/preferences/edit")
          .send({
            username: newUser.username,
            email: testUserRegister.email,
            show_name: "Y. Pies",
            contact_info: "",
            share_collection: false,
            share_pass: "",
          })
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        const passwordChange = authenticatedagent
          .put("/preferences/change_password")
          .send({ username: newUser.username, new_password: newUser.password })
          .set("Content-Type", "application/json")
          .set("Accept", "application/json");

        usernameChange.then((res: any) => {
          expect(res.statusCode).toBe(302);
          expect(res.headers.location).toBe("/collection");
        });

        passwordChange.then((res: any) => {
          expect(res.statusCode).toBe(302);
          expect(res.headers.location).toBe("/collection");
        });
      }
    );
  });

  it("deletes the newly created user", async () => {
    return requestAuth("/login", newUser).then((authenticatedagent: any) => {
      return authenticatedagent
        .delete("/preferences/deleteAcc")
        .send({
          username: newUser.username,
          password: newUser.password,
        })
        .then((res: any) => {
          expect(res.statusCode).toBe(302);
          expect(res.headers.location).toBe("/home");
          expect(res.headers).not.toBe("/preferences");
        });
    });
  });
});

describe("Check special features", () => {
  it("sends token", async () => {
    const res = await request(server)
      .post(`/forgotten`)
      .send("example.mail@mail.com")
      .then((res: any) => {
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe("/home");
      });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
