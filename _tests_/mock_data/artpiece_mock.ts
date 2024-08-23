import { ArtPieceType } from "../../src/models/mongoose/ArtPiece";
import { testUserLogin } from "./user_mock";

const artpiece_mock: ArtPieceType = {
  title: (Math.random() + 1).toString(36).substring(7),
  artist: (Math.random() + 1).toString(36).substring(7),
  medium: "Oil on Canvas",
  year: [
    {
      year_finished: "",
      year_started: 1998,
      // _id: "66c353c6f2a4db27ef042484",
    },
  ],
  size: [
    {
      x: 400,
      y: 200,
      z: "",
      unit: "cm",
      // _id: "66c353c6f2a4db27ef042485",
    },
  ],
  owner: [
    {
      status: "self",
      name: "",
      contact_info: "",
      // _id: "66c353c6f2a4db27ef042486",
    },
  ],
  holder: [
    {
      status: "self",
      name: "",
      contact_info: "",
      // _id: "66c353c6f2a4db27ef042487",
    },
  ],
  acquiration_date: new Date("2024-08-22T00:00:00.000Z"),
  archival: false,
  description:
    "As Gregor Samsa awoke one morning from uneasy dreams he found himself transformed in his bed into a gigantic insect.",
  // user_id: "6595bee8e15d921df771a205",
  forSale: true,
  price: [
    {
      price: 200000,
      currency: "€",
      // _id: "66c353c6f2a4db27ef042488",
    },
  ],
  catalogue: "2000",
  // _id: "10001test",
  images: [],
  user_id: testUserLogin.user_id,
};

export default artpiece_mock;
