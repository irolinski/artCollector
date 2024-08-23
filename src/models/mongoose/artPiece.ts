const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  url: String,
  filename: String,
});

const yearSchema = new Schema({
  year_finished: Number,
  year_started: Number,
});

const sizeSchema = new Schema({
  x: Number,
  y: Number,
  z: Number,
  unit: String,
});

const personSchema = new Schema({
  status: String,
  name: String,
  contact_info: String,
});

const priceSchema = new Schema({
  price: Number,
  currency: String,
});

const artPieceSchema = new Schema(
  {
    title: String,
    artist: String,
    medium: String,
    year: [yearSchema],
    images: [imageSchema],
    size: [sizeSchema],
    owner: [personSchema],
    holder: [personSchema],
    acquiration_date: Date,
    archival: Boolean,
    description: String,
    user_id: String,
    forSale: Boolean,
    price: [priceSchema],
    catalogue: String,
  },
  {
    timestamps: true,
  }
);

type Person = [
  {
    status: string;
    name: string;
    contact_info: string;
    _id?: string;
  }
];

export type ArtPieceType = {
  title: string;
  artist: string;
  medium: string;
  year?: [
    { year_started: number | ""; year_finished: number | ""; _id?: string }
  ];
  images?: [{ url: string; filename: string; _id?: string }] | [];
  size: [
    {
      x?: number | "";
      y?: number | "";
      z?: number | "";
      unit: "cm" | "in" | null;
      _id?: string;
    }
  ];
  owner?: Person;
  holder?: Person;
  acquiration_date?: Date;
  archival: boolean;
  description?: string;
  user_id: string;
  forSale?: boolean;
  price?: [{ price: number; currency: "PLN" | "$" | "€" | null; _id?: string }];
  catalogue?: string;
  _id?: string;
};

const ArtPiece = mongoose.model("ArtPiece", artPieceSchema, "artpieces");
export default ArtPiece;
