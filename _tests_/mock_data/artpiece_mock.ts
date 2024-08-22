import { ArtPieceType } from "../../src/models/mongoose/ArtPiece";

const artpiece_mock: ArtPieceType = {
  title: "Probono",
  artist: "Frendon",
  medium: "Oil on Canvas",
  year: [
    {
      year_finished: 2000,
      year_started: null,
      // _id: "66c353c6f2a4db27ef042484",
    },
  ],
  size: [
    {
      x: 400,
      y: 200,
      z: null,
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
  user_id: "6595bee8e15d921df771a205",
  forSale: true,
  price: [
    {
      price: 200000,
      currency: "€",
      // _id: "66c353c6f2a4db27ef042488",
    },
  ],
  catalogue: "2000",
  // _id: "66c353c6f2a4db27ef042443",
  images: [
    {
      url: "https://res.cloudinary.com/dtjtqp7r1/image/upload/v1724076998/artCollector/knj7qsujrp48ul9hbvld.png",
      filename: "artCollector/knj7qsujrp48ul9hbvld",
      // _id: "66c353c6f2a4db27ef042489",
    },
  ],
};

export default artpiece_mock;
