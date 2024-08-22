"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const artPieceSchema = new Schema({
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
}, {
    timestamps: true,
});
const ArtPiece = mongoose.model("ArtPiece", artPieceSchema, "artpieces");
exports.default = ArtPiece;
//# sourceMappingURL=ArtPiece.js.map