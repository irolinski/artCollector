const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
});

// const dateSchema = new Schema({
//     day: Number,
//     month: Number,
//     year: Number
// })

const yearSchema = new Schema({
    year_finished: Number,
    year_started: Number
})



const artPieceSchema = new Schema({
    title: String,
    artist: String,
    medium: String,
    year: [yearSchema],
    images: [imageSchema],
    size_x: Number,
    size_y: Number,
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