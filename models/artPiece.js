const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});


const yearSchema = new Schema({
    year_finished: Number,
    year_started: Number
})

const sizeSchema = new Schema({
    x: Number,
    y: Number,
    z: Number,
    unit: String
})


const artPieceSchema = new Schema({
    title: String,
    artist: String,
    medium: String,
    year: [yearSchema],
    images: [imageSchema],
    size: [sizeSchema],
    owner: String,
    holder: String,
    acquiration_date: Date,
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