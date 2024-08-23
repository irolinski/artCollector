import request from "supertest";
import mongoose, { ConnectOptions } from "mongoose";
import server from "../server";
import { testUserLogin } from "./mock_data/user_mock";
import artpiece_mock from "./mock_data/artpiece_mock";
const editedArtpiece = artpiece_mock;
editedArtpiece.title = "I don't like my old title";
editedArtpiece.forSale = false;

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

const testPiece = artpiece_mock;
describe("Check if adding works", () => {
  it("should add a new piece and redirect to '/collection'", async () => {
    return requestAuth("/login", testUserLogin).then(
      async (authenticatedagent: any) => {
        const checkAdd = await authenticatedagent
          .post("/collection")
          .send(testPiece)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .then((res: any) => {
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe("/collection");
            testPiece._id = res.headers.newpiece_id;
          });
      }
    );
  });
});

describe("Check if routing works", () => {
  it("should return 200 on every .get route", async () => {
    return requestAuth("/login", testUserLogin).then(
      async (authenticatedagent: any) => {
        const checkNewPage = await authenticatedagent
          .get("/collection/new")
          .expect(200);

        const checkShowPage = await authenticatedagent
          .get(`/collection/show/${testPiece._id}`)
          .expect(200);

        const checkEditPage = await authenticatedagent
          .get(`/collection/show/${testPiece._id}/edit`)
          .expect(200);

        const checkEditImagesPage = await authenticatedagent
          .get(`/collection/show/${testPiece._id}/edit/images`)
          .expect(200);
      }
    );
  });
});

describe("Check if editing/deleting works", () => {
  it("should add a new piece and redirect to '/collection'", async () => {
    return requestAuth("/login", testUserLogin).then(
      async (authenticatedagent: any) => {
        const editedPiece = testPiece;
        editedPiece.title = "I did not like my previous title";
        const checkEdit = await authenticatedagent
          .put(`/collection/show/${testPiece._id}`)
          .send(editedPiece)
          .set("Content-Type", "application/json")
          .set("Accept", "application/json")
          .then((res: any) => {
            // console.log(res);
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe(
              `/collection/show/${testPiece._id}`
            );
          });
      }
    );
  });

  it("should add a new piece and redirect to '/collection'", async () => {
    return requestAuth("/login", testUserLogin).then(
      async (authenticatedagent: any) => {
        const checkDelete = await authenticatedagent
          .delete(`/collection/show/${testPiece._id}`)
          .then((res: any) => {
            expect(res.statusCode).toBe(302);
            expect(res.headers.location).toBe("/collection");
          });
      }
    );
  });
});

describe("Check if special features work", () => {
  it("should export collection to xlsx", () => {
    return requestAuth("/login", testUserLogin).then(
      async (authenticatedagent: any) => {
        return await authenticatedagent
          .post("/collection/export_collection")
          .expect(200);
      }
    );
  });
});

afterAll(async () => {
  await mongoose.connection.close();
  server.close();
});
