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



app.use(
    express.static(path.join(__dirname, "node_modules/bootstrap/dist/"))
  );


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
    title: 'Baking a steak (or or or or)',
    artist: 'Man from Turman Gown',
    medium: 'Baloons',
    year: [
        {year_finished: 2010}
        
    ],
    images: [
        {url: 'https://source.unsplash.com/random/?duck,attacking'} 
    ],
    size: [
        {x: 255, y: 222, z:300, unit:'in'}
    ],
    owner: [
        {name: 'Michael Stokes', contact_info: 'phone number: 8333 333 333'}
    ],
    holder: [
        {name: 'Michael Stokes', contact_info: 'phone number: 8333 333 333'}
],
    acquiration_date: new Date("1800-05-21T11:25"),

    price: [
        {price: 244, currency: '$'}
    ],
    archival: false,
    forSale: true,
    description: 'lorem ipsum dolor sit amet sdadasfasfasfasfasfasfasfa costam',
    user_id: 's8799fasfafas99944999' })
   
    await piece.save(); 
    res.send(piece)
    })

// ------- END -------

app.listen(3000, () => {
    console.log('Serving on port 3000!')
});
