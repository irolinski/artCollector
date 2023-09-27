const express = require('express');
const path = require('path');
const ejsMate = require ('ejs-mate');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/artCollection',
{ useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('connection open!')
})
.catch(err => {
    console.log('oh no!')
    console.log(err)
});
const ArtPiece = require('./models/artPiece.js');






app.get('/homepage', (req, res) => {
    res.render('homepage')
});

app.get('/collection', async (req, res) => {
    const artpieces = await ArtPiece.find({});
    res.render('collection', {artpieces})
});

app.get('/new', (req, res) => {
    res.render('new')
})


// ------- PIECE GENERATOR -------

// app.get('/makeArtPiece', async (req, res) => {
//     const piece = new ArtPiece({
//     title: 'Water Lilies (or something)',
//     artist: 'Monet Claude',
//     technique: 'Oil on Canvas',
//     year: 1858,
//     images: [
//         {url: 'https://source.unsplash.com/random/?impressionistic,painting'} 
//     ],
//     size_x: 121,
//     size_y: 253,
//     owner: 'Italy',
//     holder: 'Italy',
//     acquiration_date: 22-0o1-1833,
//     archival: false,
//     description: 'lorem ipsum dolor sit amet sdadasfasfasfasfasfasfasfa costam',
//     user_id: 's8799fasfafas99944999' })
   
//     await piece.save(); 
//     res.send(piece)
//     })

// ------- END -------

app.listen(3000, () => {
    console.log('Serving on port 3000!')
});
