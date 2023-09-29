const express = require('express');
const path = require('path');
const ejsMate = require ('ejs-mate');
const moment = require('moment');
const $ = require('jquery');

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
const { constants } = require('buffer');






app.get('/homepage', (req, res) => {
    res.render('homepage')
});

app.get('/collection', async (req, res) => {

    let queryString = JSON.stringify(req.query);
    const archivalStatus = req.query.archival;

    let artPieces = await ArtPiece.find({});
    const archivalPieces = await ArtPiece.find({ archival: {$in: [ 'true' ]}});

    if (archivalStatus === 'hide') {
        artPieces = await ArtPiece.find({ archival: !{$in: [ 'true' ]}})
    } if (archivalStatus === 'showOnly') {
        artPieces = archivalPieces
    }

    res.render('collection', { artPieces, moment: moment, archivalStatus, queryString })
});

app.get('/new', (req, res) => {
    res.render('new')
})


// ------- PIECE GENERATOR -------

app.get('/makeArtPiece', async (req, res) => {
    const piece = new ArtPiece({
    title: 'Baking a cake (or flick)',
    artist: 'Man from Truman Show',
    medium: 'Stone or something',
    year: [
        {year_finished: 1993}
        
    ],
    images: [
        {url: 'https://source.unsplash.com/random/?duck,attacking'} 
    ],
    size: [
        {x: 25, y: 252, z:300, unit:'in'}
    ],
    owner: 'Museum of Ducks',
    holder: 'Museum of Puss',
    acquiration_date: new Date("1600-01-21T11:25"),
    archival: true,
    forSale: false,
    description: 'lorem ipsum dolor sit amet sdadasfasfasfasfasfasfasfa costam',
    user_id: 's8799fasfafas99944999' })
   
    await piece.save(); 
    res.send(piece)
    })

// ------- END -------

app.listen(3000, () => {
    console.log('Serving on port 3000!')
});
