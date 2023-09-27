const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});


const artPieceSchema = new Schema({
    title: String,
    artist: String,
    medium: String,
    year: Number,
    images: [ImageSchema],
    size_x: Number,
    size_y: Number,
    owner: String,
    holder: String,
    acquiration_date: Date, // if updated, have to notiy mongoose with 'doc.markModified('pathToYourDate')' -- check the docs if in doubt
    archival: Boolean,
    description: String,
    user_id: String,
    forSale: Boolean,
    price: Number
},
{
    timestamps: true, 

}
);

const ArtPiece = mongoose.model('ArtPiece', artPieceSchema, 'artpieces');
module.exports = ArtPiece; 